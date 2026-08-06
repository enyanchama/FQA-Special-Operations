/** Outpatient transformation and preferred headers. */

const OUTPATIENT_SOURCE_KEYS = {
  starttime: true,
  start: true,
  endtime: true,
  end: true,
};

function transformOutpatientRecord_(rec) {
  const out = {};
  out[UUID_FIELD] =
    rec[UUID_FIELD] == null ? '' : rec[UUID_FIELD];

  /*
   * Preserve every field not transformed below.
   * `_submission_time` is retained as a raw column too.
   */
  assignPassthrough_(
    out,
    rec,
    OUTPATIENT_SOURCE_KEYS
  );

  out.date_started = formatDateMinute_(
    firstValue_(rec, ['starttime', 'start'])
  );

  out.date_ended = formatDateMinute_(
    firstValue_(rec, ['endtime', 'end'])
  );

  out.date_submitted = formatDateMinute_(
    rec['_submission_time']
  );

  return out;
}

function outpatientPreferredHeaders_() {
  return [
    UUID_FIELD,
    'date_started',
    'date_ended',
    'date_submitted',
  ];
}
