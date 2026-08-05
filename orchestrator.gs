/**
 * Pipeline orchestrator. Public functions in this file are safe to run manually
 * or from Apps Script triggers.
 */

/** Incrementally extract Kobo records, then rebuild successful outputs. */
function pullAllForms() {
  runPipeline_(false);
}

/** Fully replace raw staging data, then rebuild successful outputs. */
function fullRefreshAllForms() {
  runPipeline_(true);
}

/** Descriptive public alias for a full end-to-end run. */
function runFullPipeline() {
  runPipeline_(true);
}

function runPipeline_(fullRefresh) {
  Logger.log('[PIPELINE] Started (' + (fullRefresh ? 'full refresh' : 'incremental') + ')');
  const extraction = extractAllKoboData_(fullRefresh);
  const summary = { extraction: extraction, transformation: {} };

  FORM_CONFIG.forEach(function (form) {
    if (!extraction[form.sheetName] || !extraction[form.sheetName].ok) {
      Logger.log('[TRANSFORM] Skipped "' + form.sheetName + '" because extraction failed');
      summary.transformation[form.sheetName] = { ok: false, skipped: true };
      return;
    }
    try {
      Logger.log('[TRANSFORM] Starting "' + form.sheetName + '"');
      const result = runDatasetTransformation_(form.sheetName);
      const validation = validateOutputSheet_(form.sheetName);
      summary.transformation[form.sheetName] = {
        ok: true,
        rows: result.rows,
        validation: validation,
      };
      Logger.log('[TRANSFORM] Completed "' + form.sheetName + '": ' + result.rows + ' rows');
    } catch (err) {
      summary.transformation[form.sheetName] = { ok: false, error: err.message };
      logPipelineError_('TRANSFORM', form.sheetName, err);
    }
  });

  Logger.log('[PIPELINE] Finished: ' + JSON.stringify(summary));
  return summary;
}

function runDatasetTransformation_(sheetName) {
  if (sheetName === 'Newborn Unit') return transformNewbornUnit();
  if (sheetName === 'Inpatient Maternity') return transformInpatientMaternity();
  return publishRawDataset_(sheetName);
}

function logPipelineError_(stage, dataset, err) {
  Logger.log(
    '[' + stage + '] ERROR "' + dataset + '": ' + err.message +
    (err.stack ? '\n' + err.stack : '')
  );
}

function createDailyTrigger() {
  ScriptApp.newTrigger('pullAllForms')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();
}
