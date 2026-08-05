/** Google Sheets persistence helpers for raw staging and final datasets. */

function appendNewRecordsToSheet(ss, sheetName, records, preferredHeaders) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  if (!records || records.length === 0) {
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1).setValue('No submissions found.');
    return { appended: 0, skipped: 0 };
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const firstCell = lastRow > 0 ? String(sheet.getRange(1, 1).getValue()) : '';
  const isEmptyOrPlaceholder =
    lastRow === 0 || lastCol === 0 ||
    (lastRow === 1 && firstCell === 'No submissions found.');

  if (isEmptyOrPlaceholder) {
    sheet.clearContents();
    const headers = ensureUuidFirst_(buildHeaderUnion_(records));
    const preferred = preferredHeaders || [];
    // Transformed columns first, then whatever raw fields the records still
    // carry; whitelist sheets write the preferred columns only.
    const ordered = isWhitelistSheet_(sheetName)
      ? preferred
      : orderHeaders_(headers, preferred);
    writeRows_(sheet, ordered, records, 2, true);
    sheet.setFrozenRows(1);
    return { appended: records.length, skipped: 0 };
  }

  let headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  const uuidColIndex = headers.indexOf(UUID_FIELD);
  if (uuidColIndex === -1) {
    throw new Error('Sheet "' + sheetName + '" has no "' + UUID_FIELD + '" column. Run fullRefreshAllForms().');
  }

  const existingUuidSet = {};
  if (lastRow >= 2) {
    const numDataRows = lastRow - 1;
    sheet.getRange(2, uuidColIndex + 1, numDataRows, 1).getValues().forEach(function (row) {
      if (row[0] !== '' && row[0] != null) existingUuidSet[String(row[0])] = true;
    });
  }

  const newRecords = records.filter(function (rec) {
    const uuid = rec[UUID_FIELD];
    return uuid != null && uuid !== '' && !existingUuidSet[String(uuid)];
  });
  const skipped = records.length - newRecords.length;
  if (newRecords.length === 0) return { appended: 0, skipped: skipped };

  // Whitelist sheets stay on preferred columns; do not append meta/raw keys.
  if (!isWhitelistSheet_(sheetName)) {
    const headerSet = {};
    headers.forEach(function (h) { headerSet[h] = true; });
    buildHeaderUnion_(newRecords).forEach(function (key) {
      if (!headerSet[key]) { headers.push(key); headerSet[key] = true; }
    });
    if (headers.length > lastCol) {
      ensureSheetCapacity_(sheet, 1, headers.length);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  writeRows_(sheet, headers, newRecords, lastRow + 1, false);
  sheet.setFrozenRows(1);
  return { appended: newRecords.length, skipped: skipped };
}

/** Replace a complete dataset only after its records are ready in memory. */
function replaceRecordsInSheet_(ss, sheetName, records, preferredHeaders) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  sheet.clearContents();
  return appendNewRecordsToSheet(ss, sheetName, records, preferredHeaders || []);
}

/** Reconstruct raw Kobo objects, including whether each field was present. */
function readRawRecords_(ss, sheetName) {
  const rawName = rawSheetName_(sheetName);
  const sheet = ss.getSheetByName(rawName);
  if (!sheet) {
    throw new Error(
      'Missing raw staging sheet "' + rawName + '". Run extractAllKoboData() first.'
    );
  }
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return [];

  const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = values[0].map(String);
  const presenceIndex = headers.indexOf(RAW_PRESENT_KEYS_FIELD);
  return values.slice(1).map(function (row, rowIndex) {
    let presentKeys = headers;
    if (presenceIndex !== -1 && row[presenceIndex]) {
      try {
        presentKeys = JSON.parse(String(row[presenceIndex]));
      } catch (err) {
        throw new Error(
          'Invalid ' + RAW_PRESENT_KEYS_FIELD + ' in "' + rawName +
          '" row ' + (rowIndex + 2) + ': ' + err.message
        );
      }
    }
    const presentSet = {};
    presentKeys.forEach(function (key) { presentSet[key] = true; });
    const rec = {};
    headers.forEach(function (header, colIndex) {
      if (header !== RAW_PRESENT_KEYS_FIELD && presentSet[header]) {
        rec[header] = row[colIndex];
      }
    });
    return rec;
  });
}

/** Publish a form with no dedicated transform as an unchanged raw dataset. */
function publishRawDataset_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const records = readRawRecords_(ss, sheetName);
  replaceRecordsInSheet_(ss, sheetName, records, []);
  return { rows: records.length, columns: buildHeaderUnion_(records).length };
}

/** Fail fast on structural output errors after each transformation. */
function validateOutputSheet_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) {
    return { rows: 0, columns: sheet ? sheet.getLastColumn() : 0 };
  }
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  const seenHeaders = {};
  headers.forEach(function (header) {
    if (!header) throw new Error('Blank header in "' + sheetName + '".');
    if (seenHeaders[header]) throw new Error('Duplicate header "' + header + '" in "' + sheetName + '".');
    seenHeaders[header] = true;
  });

  const uuidIndex = headers.indexOf(UUID_FIELD);
  if (uuidIndex === -1) throw new Error('Missing "' + UUID_FIELD + '" in "' + sheetName + '".');
  const seenUuids = {};
  sheet.getRange(2, uuidIndex + 1, lastRow - 1, 1).getValues().forEach(function (row) {
    const uuid = row[0];
    if (uuid === '' || uuid == null) return;
    if (seenUuids[String(uuid)]) {
      throw new Error('Duplicate ' + UUID_FIELD + ' "' + uuid + '" in "' + sheetName + '".');
    }
    seenUuids[String(uuid)] = true;
  });
  return { rows: lastRow - 1, columns: lastCol };
}

function buildHeaderUnion_(records) {
  const headerSet = {};
  records.forEach(function (rec) {
    Object.keys(rec).forEach(function (key) { headerSet[key] = true; });
  });
  return Object.keys(headerSet);
}

function ensureUuidFirst_(headers) {
  return [UUID_FIELD].concat(headers.filter(function (h) { return h !== UUID_FIELD; }));
}

function orderHeaders_(headers, preferredFront) {
  const set = {};
  headers.forEach(function (h) { set[h] = true; });
  const front = preferredFront.filter(function (h) { return set[h]; });
  const frontSet = {};
  front.forEach(function (h) { frontSet[h] = true; });
  return front.concat(headers.filter(function (h) { return !frontSet[h]; }));
}

function isWhitelistSheet_(sheetName) {
  return KEEP_UNTRANSFORMED_COLUMNS[sheetName] === false;
}

function flattenCell_(val) {
  if (val === undefined || val === null) return '';
  const cell = typeof val === 'object' ? JSON.stringify(val) : val;
  if (typeof cell === 'string' && cell.length > MAX_CELL_CHARS) {
    return cell.substring(0, MAX_CELL_CHARS);
  }
  return cell;
}

/** A sheet starts at 26 columns, so wide pass-through writes need room first. */
function ensureSheetCapacity_(sheet, lastRowNeeded, lastColNeeded) {
  const maxRows = sheet.getMaxRows();
  if (lastRowNeeded > maxRows) sheet.insertRowsAfter(maxRows, lastRowNeeded - maxRows);
  const maxCols = sheet.getMaxColumns();
  if (lastColNeeded > maxCols) sheet.insertColumnsAfter(maxCols, lastColNeeded - maxCols);
}

function writeRows_(sheet, headers, records, startRow, writeHeader) {
  const numRows = records ? records.length : 0;
  ensureSheetCapacity_(sheet, startRow + Math.max(numRows, 1) - 1, headers.length);
  if (writeHeader) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (numRows === 0) return;

  // Write in chunks to avoid Apps Script setValues payload limits on wide sheets.
  const CHUNK = 100;
  let rowOffset = 0;
  while (rowOffset < records.length) {
    const slice = records.slice(rowOffset, rowOffset + CHUNK);
    const rows = slice.map(function (rec) {
      return headers.map(function (h) { return flattenCell_(rec[h]); });
    });
    const destRow = startRow + rowOffset;
    sheet.getRange(destRow, 1, rows.length, headers.length).setValues(rows);
    rowOffset += slice.length;
  }
}

