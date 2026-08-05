/**
 * Kobo extraction and raw staging only. No cleaning or transformations belong here.
 */

function getApiToken() {
  const token = PropertiesService.getScriptProperties().getProperty('KOBO_API_TOKEN');
  if (!token) {
    throw new Error(
      'Missing Script Property KOBO_API_TOKEN. ' +
      'Set it under Project Settings → Script properties.'
    );
  }
  return token;
}

function isTransientKoboStatus_(code) {
  return code === 429 || code === 502 || code === 503 || code === 504;
}

/** Fetch one Kobo page with exponential backoff on transient gateway errors. */
function fetchKoboPage_(url, token, assetUid) {
  let lastCode = 0;
  let lastBody = '';
  for (let attempt = 1; attempt <= KOBO_MAX_RETRIES; attempt++) {
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { Authorization: 'Token ' + token },
      muteHttpExceptions: true,
    });
    lastCode = response.getResponseCode();
    lastBody = response.getContentText();
    if (lastCode === 200) return response;
    if (!isTransientKoboStatus_(lastCode) || attempt === KOBO_MAX_RETRIES) break;
    const waitMs = KOBO_RETRY_BASE_MS * Math.pow(2, attempt - 1);
    Logger.log(
      'Transient HTTP ' + lastCode + ' for ' + assetUid +
      ' (attempt ' + attempt + '/' + KOBO_MAX_RETRIES + '); retrying in ' + waitMs + 'ms'
    );
    Utilities.sleep(waitMs);
  }
  throw new Error(
    'Kobo API returned HTTP ' + lastCode + ' for ' + assetUid +
    ' after ' + KOBO_MAX_RETRIES + ' attempt(s): ' + lastBody
  );
}

function fetchAllSubmissions(assetUid, token) {
  let allResults = [];
  let start = 0;
  let total = null;
  do {
    const url = KOBO_BASE_URL + '/api/v2/assets/' + assetUid + '/data.json'
      + '?limit=' + PAGE_SIZE + '&start=' + start;
    const response = fetchKoboPage_(url, token, assetUid);
    const json = JSON.parse(response.getContentText());
    total = json.count;
    allResults = allResults.concat(json.results || []);
    start += PAGE_SIZE;
    if (start < total) Utilities.sleep(KOBO_PAGE_PAUSE_MS);
  } while (start < total);
  return allResults;
}


/** Pull one form into its raw staging sheet. */
function extractKoboForm_(ss, form, token, fullRefresh) {
  Logger.log('[EXTRACT] Starting "' + form.sheetName + '"');
  const records = fetchAllSubmissions(form.uid, token);
  const rawSheetName = rawSheetName_(form.sheetName);
  if (fullRefresh) replaceRecordsInSheet_(ss, rawSheetName, prepareRawRecords_(records), []);
  else appendNewRecordsToSheet(ss, rawSheetName, prepareRawRecords_(records), []);
  Logger.log('[EXTRACT] Completed "' + form.sheetName + '": ' + records.length + ' fetched');
  return records.length;
}

/** Pull every configured form without applying any transformation. */
function extractAllKoboData_(fullRefresh) {
  const token = getApiToken();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const results = {};
  FORM_CONFIG.forEach(function (form, index) {
    try {
      results[form.sheetName] = {
        ok: true,
        count: extractKoboForm_(ss, form, token, fullRefresh),
      };
    } catch (err) {
      results[form.sheetName] = { ok: false, error: err.message };
      logPipelineError_('EXTRACT', form.sheetName, err);
    }
    if (index < FORM_CONFIG.length - 1) Utilities.sleep(KOBO_FORM_PAUSE_MS);
  });
  return results;
}

/** Public full extraction entry point; transformations are not executed. */
function extractAllKoboData() {
  return extractAllKoboData_(true);
}

/** Public incremental extraction entry point; transformations are not executed. */
function extractLatestKoboData() {
  return extractAllKoboData_(false);
}

function rawSheetName_(sheetName) {
  return RAW_SHEET_PREFIX + sheetName;
}

/** Preserve field presence so skipped select_multiple questions remain blank. */
function prepareRawRecords_(records) {
  return records.map(function (rec) {
    const staged = {};
    Object.keys(rec).forEach(function (key) { staged[key] = rec[key]; });
    staged[RAW_PRESENT_KEYS_FIELD] = JSON.stringify(Object.keys(rec));
    return staged;
  });
}
