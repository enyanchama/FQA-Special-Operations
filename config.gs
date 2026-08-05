/**
 * Shared pipeline configuration.
 * Set Script Property KOBO_API_TOKEN under Project Settings → Script properties.
 */

const KOBO_BASE_URL = 'https://eu.kobotoolbox.org';
const UUID_FIELD = '_uuid';
/** Smaller pages reduce 502/503 gateway timeouts on large assets. */
const PAGE_SIZE = 300;
const KOBO_MAX_RETRIES = 6;
const KOBO_RETRY_BASE_MS = 2000;
const KOBO_PAGE_PAUSE_MS = 500;
const KOBO_FORM_PAUSE_MS = 1500;
const FACILITY_MAP_CUTOFF = '2026-01-01';

/**
 * Transformed sheets: true keeps every raw Kobo field that no transform has
 * consumed yet (written after the transformed columns), false writes the
 * preferred transformed columns only. Flip to false once a form's transforms
 * are finished.
 */
const KEEP_UNTRANSFORMED_COLUMNS = {
  'Newborn Unit': true,
  'Inpatient Maternity': true,
};

/** Raw Kobo fields never worth a column: bulky blobs or internal bookkeeping. */
const RAW_PASSTHROUGH_SKIP_KEYS = {
  _attachments: true,
  _supplementalDetails: true,
  _notes: true,
  _tags: true,
  _validation_status: true,
};

/** Google Sheets rejects cell text beyond 50k characters. */
const MAX_CELL_CHARS = 45000;

const FORM_CONFIG = [
  { uid: 'aQb68NgWt27XdYZcLjBeEg', sheetName: 'Newborn Unit' },
  { uid: 'ayJmtRyKnrwh2qVL5BRmBv', sheetName: 'Inpatient Maternity' },
  { uid: 'a6kFhM7A67mPyb26udMR3o', sheetName: 'Outpatient' },
  { uid: 'aJxN6izu5HKcEQMkbMyAb6', sheetName: 'Lab' },
  { uid: 'aPk9ZZ4YMqX4uYaMFXmDQF', sheetName: 'Operating Theatre' },
  { uid: 'aaaFehxBcdYrZuQQBAGMkF', sheetName: 'Pharmacy' },
  { uid: 'afkfnzSqqg3DiGxgvP8nR2', sheetName: 'Central Store' },
  { uid: 'ajaViXRxTMrixfE9udoord', sheetName: 'Facility General' },
];


const RAW_SHEET_PREFIX = '_raw_';
const RAW_PRESENT_KEYS_FIELD = '__present_keys';
