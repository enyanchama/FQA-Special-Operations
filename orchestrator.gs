/**
 * FQA QuIPS Orchestrator
 *
 * Runs extraction, transformation, and staging for all 8 Kobo forms.
 *
 * Each form now has its own transformation file.
 */

const FORM_CONFIG = [
  {
    uid: 'aQb68NgWt27XdYZcLjBeEg',
    sheetName: 'Newborn Unit',
  },
  {
    uid: 'ayJmtRyKnrwh2qVL5BRmBv',
    sheetName: 'Inpatient Maternity',
  },
  {
    uid: 'a6kFhM7A67mPyb26udMR3o',
    sheetName: 'Outpatient',
  },
  {
    uid: 'aJxN6izu5HKcEQMkbMyAb6',
    sheetName: 'Lab',
  },
  {
    uid: 'aPk9ZZ4YMqX4uYaMFXmDQF',
    sheetName: 'Operating Theatre',
  },
  {
    uid: 'aaaFehxBcdYrZuQQBAGMkF',
    sheetName: 'Pharmacy',
  },
  {
    uid: 'afkfnzSqqg3DiGxgvP8nR2',
    sheetName: 'Central Store',
  },
  {
    uid: 'ajaViXRxTMrixfE9udoord',
    sheetName: 'Facility General',
  },
];

/**
 * Incremental refresh.
 *
 * Fetches every form and appends only submissions whose `_uuid`
 * is not already present in the corresponding sheet.
 */
function pullAllForms() {
  const token = getApiToken();
  const spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();

  FORM_CONFIG.forEach(function (form, index) {
    try {
      Logger.log(
        'Pulling form: ' +
        form.uid +
        ' → "' +
        form.sheetName +
        '"'
      );

      let records = fetchAllSubmissions(
        form.uid,
        token
      );

      records = transformRecordsForSheet_(
        form.sheetName,
        records
      );

      const preferredHeaders =
        preferredHeadersForSheet_(
          form.sheetName
        );

      const result = appendNewRecordsToSheet(
        spreadsheet,
        form.sheetName,
        records,
        preferredHeaders
      );

      Logger.log(
        'Sheet "' +
        form.sheetName +
        '": appended ' +
        result.appended +
        ' new row(s); skipped ' +
        result.skipped +
        ' existing UUID(s).'
      );
    } catch (err) {
      Logger.log(
        'ERROR pulling ' +
        form.uid +
        ' → "' +
        form.sheetName +
        '": ' +
        err.message +
        (err.stack ? '\n' + err.stack : '')
      );
    }

    if (index < FORM_CONFIG.length - 1) {
      Utilities.sleep(KOBO_FORM_PAUSE_MS);
    }
  });
}

/**
 * Full refresh.
 *
 * Fetches and transforms data before clearing a sheet. This prevents
 * extraction or transformation errors from erasing existing data.
 */
function fullRefreshAllForms() {
  const token = getApiToken();
  const spreadsheet =
    SpreadsheetApp.getActiveSpreadsheet();

  FORM_CONFIG.forEach(function (form, index) {
    try {
      Logger.log(
        'Full refresh for form: ' +
        form.uid +
        ' → "' +
        form.sheetName +
        '"'
      );

      /*
       * Fetch and transform successfully before clearing the sheet.
       */
      let records = fetchAllSubmissions(
        form.uid,
        token
      );

      records = transformRecordsForSheet_(
        form.sheetName,
        records
      );

      const preferredHeaders =
        preferredHeadersForSheet_(
          form.sheetName
        );

      const sheet =
        spreadsheet.getSheetByName(
          form.sheetName
        );

      if (sheet) {
        sheet.clearContents();
      }

      const result = appendNewRecordsToSheet(
        spreadsheet,
        form.sheetName,
        records,
        preferredHeaders
      );

      Logger.log(
        'Sheet "' +
        form.sheetName +
        '": wrote ' +
        result.appended +
        ' row(s).'
      );
    } catch (err) {
      Logger.log(
        'ERROR refreshing ' +
        form.uid +
        ' → "' +
        form.sheetName +
        '": ' +
        err.message +
        (err.stack ? '\n' + err.stack : '')
      );
    }

    if (index < FORM_CONFIG.length - 1) {
      Utilities.sleep(KOBO_FORM_PAUSE_MS);
    }
  });
}

/**
 * Route each form to its transformation function.
 */
function transformRecordsForSheet_(
  sheetName,
  records
) {
  if (sheetName === 'Newborn Unit') {
    return records.map(
      transformNewbornUnitRecord_
    );
  }

  if (sheetName === 'Inpatient Maternity') {
    return records.map(
      transformInpatientMaternityRecord_
    );
  }

  if (sheetName === 'Outpatient') {
    return records.map(
      transformOutpatientRecord_
    );
  }

  if (sheetName === 'Lab') {
    return records.map(
      transformLabRecord_
    );
  }

  if (sheetName === 'Operating Theatre') {
    return records.map(
      transformOperatingTheatreRecord_
    );
  }

  if (sheetName === 'Pharmacy') {
    return records.map(
      transformPharmacyRecord_
    );
  }

  if (sheetName === 'Central Store') {
    return records.map(
      transformCentralStoreRecord_
    );
  }

  if (sheetName === 'Facility General') {
    return records.map(
      transformFacilityGeneralRecord_
    );
  }

  throw new Error(
    'No transformation configured for sheet "' +
    sheetName +
    '".'
  );
}

/**
 * Return the preferred output-column order for each sheet.
 *
 * Untransformed/raw fields not included in these lists are still preserved
 * and placed after the preferred transformed columns.
 */
function preferredHeadersForSheet_(
  sheetName
) {
  if (sheetName === 'Newborn Unit') {
    return newbornUnitPreferredHeaders_();
  }

  if (sheetName === 'Inpatient Maternity') {
    return inpatientMaternityPreferredHeaders_();
  }

  if (sheetName === 'Outpatient') {
    return outpatientPreferredHeaders_();
  }

  if (sheetName === 'Lab') {
    return labPreferredHeaders_();
  }

  if (sheetName === 'Operating Theatre') {
    return operatingTheatrePreferredHeaders_();
  }

  if (sheetName === 'Pharmacy') {
    return pharmacyPreferredHeaders_();
  }

  if (sheetName === 'Central Store') {
    return centralStorePreferredHeaders_();
  }

  if (sheetName === 'Facility General') {
    return facilityGeneralPreferredHeaders_();
  }

  throw new Error(
    'No preferred headers configured for sheet "' +
    sheetName +
    '".'
  );
}

/**
 * Run once manually to create a daily incremental pull at 6 AM.
 *
 * Remove any existing `pullAllForms` trigger before running this again
 * to avoid duplicate scheduled executions.
 */
function createDailyTrigger() {
  ScriptApp
    .newTrigger('pullAllForms')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();
}
