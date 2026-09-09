# FQA Special Operations

Google Apps Script pipeline that pulls QuIPS KoboToolbox submissions into Google Sheets and transforms each dataset independently.

## Files

| File | Responsibility |
|---|---|
| `configAndExtraction.gs` | Config, choice maps, Kobo fetch, shared helpers, sheet writes |
| `newbornUnitTransformation.gs` | Newborn Unit transforms and preferred headers |
| `maternityTransformation.gs` | Inpatient Maternity transforms and preferred headers |
| `outpatientTransformation.gs` | Outpatient transforms and preferred headers |
| `labTransformation.gs` | Lab transforms and preferred headers |
| `operatingTheatreTransformation.gs` | Operating Theatre date transforms |
| `pharmacyTransformation.gs` | Pharmacy date transforms |
| `centralStoreTransformation.gs` | Central Store date transforms |
| `facilityGeneralTransformation.gs` | Facility General date transforms |
| `orchestrator.gs` | Form registry, `pullAllForms`, `fullRefreshAllForms`, routing |

## Behavior

- Transformed columns are written first in preferred order.
- Raw Kobo fields not listed in each dataset’s `*_SOURCE_KEYS` pass through unchanged after the transformed columns.
- `fullRefreshAllForms()` fetches and transforms before clearing a sheet.
- `pullAllForms()` appends only new `_uuid` values.
- Wide sheets grow automatically before writes.

## Setup

1. Paste each `.gs` file into the Apps Script project using the same filenames.
2. Set Script Property `KOBO_API_TOKEN`.
3. Run `fullRefreshAllForms()`.
4. Optionally run `createDailyTrigger()` once for a daily 6 AM incremental pull.
