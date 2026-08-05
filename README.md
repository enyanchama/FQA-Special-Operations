# FQA Special Operations

Google Apps Script pipeline for extracting QuIPS KoboToolbox submissions into
Google Sheets and transforming each dataset independently.

## Project structure

- `config.gs` — API/runtime settings and the form registry.
- `dataExtraction.gs` — Kobo API access and raw staging-sheet loading only.
- `newbornUnitTransformation.gs` — Newborn Unit transformations and headers.
- `maternityTransformation.gs` — Inpatient Maternity transformations and headers.
- `transformationUtils.gs` — shared transformation helpers.
- `sharedMappings.gs` — shared coded-value and select-multiple mappings.
- `sheetRepository.gs` — generic Google Sheets reads, writes, and validation.
- `orchestrator.gs` — end-to-end pipeline coordination and triggers.

Raw data is stored in sheets prefixed with `_raw_`. Dataset transformations read
from those staging sheets and rebuild the user-facing sheets, so extraction can
be rerun without mixing API concerns with cleaning logic.

## Main functions

- `runFullPipeline()` / `fullRefreshAllForms()` — fully extract and transform.
- `pullAllForms()` — incrementally stage new UUIDs, then rebuild outputs.
- `extractAllKoboData()` — fully refresh raw staging only.
- `extractLatestKoboData()` — incrementally update raw staging only.
- `transformNewbornUnit()` — independently rebuild Newborn Unit.
- `transformInpatientMaternity()` / `transformMaternity()` — independently
  rebuild Inpatient Maternity.

Set the `KOBO_API_TOKEN` Script Property before running extraction.

## Adding a transformed dataset

1. Add the Kobo asset and target sheet to `FORM_CONFIG`.
2. Create `<dataset>Transformation.gs` with one public `transform<Dataset>()`
   function and private record/header helpers.
3. Add one dispatch case in `runDatasetTransformation_()`.
4. Keep mappings local to the dataset unless another transform shares them.
