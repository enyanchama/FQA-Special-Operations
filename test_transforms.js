/**
 * Lightweight transform checks without Apps Script runtime.
 * Stubs GAS globals, concatenates .gs files, and asserts key mappings.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = [
  'configAndExtraction.gs',
  'newbornUnitTransformation.gs',
  'maternityTransformation.gs',
  'outpatientTransformation.gs',
  'labTransformation.gs',
  'operatingTheatreTransformation.gs',
  'pharmacyTransformation.gs',
  'centralStoreTransformation.gs',
  'facilityGeneralTransformation.gs',
  'orchestrator.gs',
];

const context = {
  PropertiesService: {
    getScriptProperties: function () {
      return { getProperty: function () { return 'test-token'; } };
    },
  },
  Session: { getScriptTimeZone: function () { return 'Africa/Nairobi'; } },
  Utilities: {
    formatDate: function (d) {
      const pad = function (n) { return String(n).padStart(2, '0'); };
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    },
    sleep: function () {},
  },
  SpreadsheetApp: {},
  ScriptApp: { newTrigger: function () { return { timeBased: function () { return {}; } }; } },
  UrlFetchApp: {},
  Logger: { log: function () {} },
  console: console,
};

const source = files.map(function (f) {
  return fs.readFileSync(path.join(__dirname, f), 'utf8');
}).join('\n');

vm.createContext(context);
vm.runInContext(source, context);

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(label + ': expected ' + JSON.stringify(expected) + ' got ' + JSON.stringify(actual));
  }
}

const uuid = '11111111-1111-1111-1111-111111111111';

const lab = context.transformLabRecord_({
  _uuid: uuid,
  starttime: '2026-03-01T08:00:00',
  endtime: '2026-03-01T09:00:00',
  _submission_time: '2026-03-01T09:05:00',
  'group_1/county': 3,
  'group_1/facility': 1,
  'group_1/gazetted': 5,
  'group_1/contact': 2,
  'group_1/nam_contact': 'Jane',
  'group_1/phone_contact': '0700',
  'group_1/units': 3,
  'group_2/abo_blood': 1,
  'group_2/abo_monthly': 1,
  'group_3/lab_register': 1,
  'group_3/standard_lab_request': '1 10',
  'group_4/cert_lab_techs': '4',
  'group_4/personnel': 0,
  'group_5/training_blood_safety': '2024_06',
  'group_6/handwashing_protocol': 2,
  'group_6/sop': '1 16',
});

assertEqual(lab.county, 'Kisii', 'lab county');
assertEqual(lab.facility, 'Kitutu Chache North Sub County Referral Hospital', 'lab facility 2026 map');
assertEqual(lab.facility_level, 'Level 5', 'lab level 5');
assertEqual(lab.units, 'Basic Laboratory services', 'lab units');
assertEqual(lab.blood_group_testing, 'Always', 'lab abo always');
assertEqual(lab.abo_monthly, 'Yes', 'lab monthly yes/no');
assertEqual(lab.lab_register, 'Yes', 'lab register');
assertEqual(lab.standard_lab_request_patient_name, 'Yes', 'lab request yes');
assertEqual(lab.standard_lab_request_none, 'Yes', 'lab request none');
assertEqual(lab.standard_lab_request_patient_gender, 'No', 'lab request no');
assertEqual(lab.personnel, 'Not present', 'lab personnel');
assertEqual(lab.contact_name, 'Jane', 'lab contact name');
assertEqual(lab.sop_personal_protective_equipment_ppe_use, 'Yes', 'lab sop yes');
assertEqual(lab.sop_none, 'Yes', 'lab sop none');

const labOld = context.transformLabRecord_({
  _uuid: uuid,
  _submission_time: '2025-06-01T09:05:00',
  'group_1/facility': 1,
});
assertEqual(labOld.facility, 'Matongo Medical Clinic', 'lab facility pre-2026 map');

const ot = context.transformOperatingTheatreRecord_({
  _uuid: uuid,
  starttime: '2026-02-01T08:00:00',
  endtime: '2026-02-01T09:00:00',
  _submission_time: '2026-02-01T09:05:00',
  'facility_profile/county': 4,
  'facility_profile/facility': 104,
  'facility_profile/gazetted_facility': 5,
  'facility_profile/contact': 6,
  'facility_profile/nam_contact': 'OT Contact',
  'facility_profile/phone_contact': '0711',
});
assertEqual(ot.county, 'Nakuru', 'ot county');
assertEqual(ot.facility, 'Nakuru County Teaching and Referral Hospital', 'ot facility');
assertEqual(ot.facility_level, 'Level 5', 'ot level');
assertEqual(ot.contact, 'Medical superintendent', 'ot contact');
assertEqual(ot.contact_name, 'OT Contact', 'ot name');

const fg = context.transformFacilityGeneralRecord_({
  _uuid: uuid,
  _submission_time: '2026-02-01T09:05:00',
  'facility_profile/facilities': 16,
  'facility_profile/county': 3,
});
assertEqual(fg.facility, 'Kisii Teaching And Referral Hospital (Level 6)', 'fg facilities key');

const nbu = context.transformNewbornUnitRecord_({
  _uuid: uuid,
  starttime: '2026-01-15T08:00:00',
  'facility_profile/gazetted_facility': 5,
  'facility_profile/county': 1,
  'facility_profile/facility': 78,
  today: '2026-01-15',
});
assertEqual(nbu.facility_level, 'Level 5', 'nbu level 5');
assertEqual(nbu.county, 'Mombasa', 'nbu county');

const headers = context.labPreferredHeaders_();
if (headers[0] !== '_uuid') throw new Error('lab headers must start with _uuid');
if (headers.indexOf('standard_lab_request_patient_name') === -1) {
  throw new Error('missing lab request headers');
}
if (headers.indexOf('confirm_sops_via_testing') === -1) {
  throw new Error('missing confirm_sops headers');
}

const otHeaders = context.operatingTheatrePreferredHeaders_();
assertEqual(otHeaders.indexOf('facility') > 0, true, 'ot preferred includes facility');

[
  'Newborn Unit',
  'Inpatient Maternity',
  'Outpatient',
  'Lab',
  'Operating Theatre',
  'Pharmacy',
  'Central Store',
  'Facility General',
].forEach(function (name) {
  const rows = context.transformRecordsForSheet_(name, [{ _uuid: uuid }]);
  if (!rows || rows.length !== 1) throw new Error('routing failed for ' + name);
});

console.log('All transform checks passed.');
