/** Shared, dataset-agnostic transformation helpers. */

function transformDatasetRecords_(sheetName, records, transform) {
  const keepRaw = KEEP_UNTRANSFORMED_COLUMNS[sheetName] !== false;
  return records.map(function (rec) {
    return keepRaw ? transformKeepingRawFields_(rec, transform) : transform(rec);
  });
}
/** Read a staged dataset, transform it, and atomically rebuild its output. */
function transformDatasetSheet_(sheetName, transform, preferredHeadersFactory) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const records = readRawRecords_(ss, sheetName);
  const transformed = transformDatasetRecords_(sheetName, records, transform);
  const preferredHeaders = preferredHeadersFactory();
  replaceRecordsInSheet_(ss, sheetName, transformed, preferredHeaders);
  return {
    rows: transformed.length,
    columns: buildHeaderUnion_(transformed).length,
  };
}

/**
 * Run a transform, then append the raw fields it never read so work-in-progress
 * forms still show every Kobo column. Reads go through a Proxy, so a field stops
 * appearing raw the moment a transform starts using it.
 */
function transformKeepingRawFields_(rec, transform) {
  const consumed = {};
  const tracked = new Proxy(rec, {
    get: function (target, prop) {
      if (typeof prop === 'string') consumed[prop] = true;
      return target[prop];
    },
  });
  const out = transform(tracked);
  Object.keys(rec).forEach(function (key) {
    if (consumed[key] || RAW_PASSTHROUGH_SKIP_KEYS[key]) return;
    if (out[key] === undefined) out[key] = flattenCell_(rec[key]);
  });
  return out;
}

/** Decode the shared facility_profile block onto out. */
function assignFacilityProfile_(out, rec, dateSubmitted, facilityKey) {
  out.county = lookupCoded_(rec['facility_profile/county'], COUNTY_MAP);
  const facilityMap = isOnOrAfterCutoff_(dateSubmitted, FACILITY_MAP_CUTOFF)
    ? FACILITY_MAP_FROM_2026 : FACILITY_MAP_BEFORE_2026;
  out.facility = lookupCoded_(rec['facility_profile/facility'], facilityMap);
  out.facility_level = lookupCoded_(rec[facilityKey], FACILITY_LEVEL_MAP);
  out.contact_person = lookupCoded_(rec['facility_profile/contact'], CONTACT_PERSON_MAP);
  out.name_contact = rec['facility_profile/nam_contact'] == null ? '' : rec['facility_profile/nam_contact'];
  out.phone_number = rec['facility_profile/phone_contact'] == null ? '' : rec['facility_profile/phone_contact'];
}

function firstValue_(rec, keys) {
  let found = '';
  for (let i = 0; i < keys.length; i++) {
    const v = rec[keys[i]];
    if (found === '' && v !== undefined && v !== null && v !== '') found = v;
  }
  return found;
}

function formatDateMinute_(value) {
  if (value === undefined || value === null || value === '') return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    const s = String(value);
    const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
    if (m) return m[1] + ' ' + m[2];
    return s;
  }
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
}

function isOnOrAfterCutoff_(dateSubmittedFormatted, cutoffYmd) {
  if (!dateSubmittedFormatted) return false;
  return String(dateSubmittedFormatted).substring(0, 10) >= cutoffYmd;
}

function toIntegerOrBlank_(raw) {
  if (raw === undefined || raw === null || raw === '') return '';
  const n = Number(raw);
  return isNaN(n) ? String(raw) : n;
}

/** Kobo train dates: keep YYYY_MM and 0000_00; map unknown → 0000-00 */
function formatYearMonth_(raw) {
  if (raw === undefined || raw === null || raw === '') return '';
  const s = String(raw).trim();
  if (/^unknown$/i.test(s)) return '0000-00';
  return s;
}


/**
 * Expand a Kobo select_multiple into Yes/No/blank indicator columns.
 * Column naming: <prefix>_<choice_slug>
 * - Yes if choice code is in the space-separated value
 * - No if the question was answered but choice not selected
 * - blank if the question was skipped / irrelevant (field absent)
 */
function expandSelectMultiple_(out, raw, prefix, choices) {
  const irrelevant = raw === undefined || raw === null;
  let selectedSet = null;
  if (!irrelevant) {
    selectedSet = {};
    String(raw).split(/\s+/).filter(Boolean).forEach(function (code) {
      selectedSet[String(code)] = true;
    });
  }
  choices.forEach(function (choice) {
    const col = prefix + '_' + choice.slug;
    if (irrelevant) {
      out[col] = '';
    } else {
      out[col] = selectedSet[String(choice.code)] ? 'Yes' : 'No';
    }
  });
}

function lookupCoded_(raw, map) {
  if (raw === undefined || raw === null || raw === '') return '';
  const keyNum = Number(raw);
  if (!isNaN(keyNum) && map[keyNum] !== undefined) return map[keyNum];
  const keyStr = String(raw);
  if (map[keyStr] !== undefined) return map[keyStr];
  return keyStr;
}

