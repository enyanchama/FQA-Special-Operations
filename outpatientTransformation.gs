/** Outpatient transformation and preferred headers. */

const OUTPATIENT_SOURCE_KEYS = makeKeySet_([
  'starttime',
  'start',
  'endtime',
  'end',
  'facility_profile/county',
  'facility_profile/gazetted',
  'facility_profile/contact',
  'facility_profile/phone_contact',
  'facility_profile/unit',
  'general_services/admission',
  'general_services/preconception_service',
  'general_services/gynecological_service',
  'general_services/family_plan',
  'general_services/anc_low_risk',
  'general_services/anc_high_risk',
  'general_services/registration',
  'general_services/ultrasound',
  'general_services/mothers_pnc',
  'general_services/infants_pnc',
  'general_services/infant_imm',
  'general_services/gen_microscopy',
  'general_services/hemogram',
  'general_services/urinalysis',
  'general_services/urine_rapid',
  'general_services/urine_protein',
  'general_services/urine_glucose',
  'general_services/hiv_rapid',
  'general_services/hiv_viral',
  'general_services/syphilis_screening',
  'general_services/blood_group',
  'general_services/malaria_smear',
  'general_services/malaria_bs',
  'general_services/hepatitis_b',
  'general_services/tb_test',
  'general_services/blood_glucose',
  'human_resource_health/consultation',
  'human_resource_health/medical_officers',
  'human_resource_health/medical_officers3',
  'human_resource_health/nurse_midwives',
  'human_resource_health/nurse_midwives3',
  'human_resource_health/clinical_officers',
  'human_resource_health/clinical_officers3',
  'human_resource_health/mhe_access',
  'human_resource_health/staff_shortage',
  'health_records_facility/mc_booklet',
  'health_records_facility/anc_register',
  'health_records_facility/pnc_register',
  'health_records_facility/inf_charts',
  'health_records_facility/imm_register',
  'health_records_facility/imm_sheet',
  'health_records_facility/imm_tally',
  'health_records_facility/prev_mtc',
  'health_records_facility/fam_plan',
  'health_records_facility/gyna_files',
  'health_records_facility/mental_stat',
  'health_records_facility/aysrh_register',
  'health_records_facility/gbv_register',
  'health_records_facility/prc_form',
  'health_records_facility/cvc_form',
  'health_records_facility/cvc_register',
  'health_records_facility/pac_register',
  'health_records_facility/ptb_register',
]);

function transformOutpatientRecord_(rec) {
  const out = {};
  out[UUID_FIELD] = rec[UUID_FIELD] == null ? '' : rec[UUID_FIELD];

  /*
   * Preserve every field not transformed below.
   * `_submission_time` is retained as a raw column too.
   */
  assignPassthrough_(out, rec, OUTPATIENT_SOURCE_KEYS);

  out.date_started = formatDateMinute_(firstValue_(rec, ['starttime', 'start']));
  out.date_ended = formatDateMinute_(firstValue_(rec, ['endtime', 'end']));
  out.date_submitted = formatDateMinute_(rec['_submission_time']);

  out.county = lookupCoded_(rec['facility_profile/county'], COUNTY_MAP);
  out.facility_level = lookupCoded_(
    rec['facility_profile/gazetted'], OUTPATIENT_FACILITY_LEVEL_MAP
  );
  out.contact = lookupCoded_(rec['facility_profile/contact'], CONTACT_PERSON_MAP);
  out.phone_number = rec['facility_profile/phone_contact'] == null
    ? '' : rec['facility_profile/phone_contact'];
  out.unit = lookupCoded_(rec['facility_profile/unit'], OUTPATIENT_YES_NO_MAP);

  out.admission = toIntegerOrBlank_(rec['general_services/admission']);
  out.preconception_service = lookupCoded_(
    rec['general_services/preconception_service'], OUTPATIENT_YES_NO_MAP
  );
  out.gynecological_service = lookupCoded_(
    rec['general_services/gynecological_service'], OUTPATIENT_YES_NO_MAP
  );
  expandSelectMultiple_(
    out,
    rec['general_services/family_plan'],
    'general_services_family_plan',
    OUTPATIENT_FAMILY_PLAN_CHOICES
  );
  out.anc_low_risk = lookupCoded_(
    rec['general_services/anc_low_risk'], OUTPATIENT_YES_NO_MAP
  );
  out.anc_high_risk = lookupCoded_(
    rec['general_services/anc_high_risk'], OUTPATIENT_YES_NO_MAP
  );
  out.services_registration = lookupCoded_(
    rec['general_services/registration'], OUTPATIENT_YES_NO_MAP
  );
  out.ultrasound_services = lookupCoded_(
    rec['general_services/ultrasound'], OUTPATIENT_YES_NO_MAP
  );
  out.mothers_pnc = lookupCoded_(
    rec['general_services/mothers_pnc'], OUTPATIENT_YES_NO_MAP
  );
  out.infants_pnc = lookupCoded_(
    rec['general_services/infants_pnc'], OUTPATIENT_YES_NO_MAP
  );
  out.infant_immunization = lookupCoded_(
    rec['general_services/infant_imm'], OUTPATIENT_YES_NO_MAP
  );

  out.general_microscopy = lookupCoded_(
    rec['general_services/gen_microscopy'], LAB_AVAILABILITY_MAP
  );
  out.full_hemogram = lookupCoded_(
    rec['general_services/hemogram'], LAB_AVAILABILITY_MAP
  );
  out.perform_urinalysis = lookupCoded_(
    rec['general_services/urinalysis'], LAB_AVAILABILITY_MAP
  );
  out.urine_rapid = lookupCoded_(
    rec['general_services/urine_rapid'], LAB_AVAILABILITY_MAP
  );
  out.urine_protein = lookupCoded_(
    rec['general_services/urine_protein'], LAB_AVAILABILITY_MAP
  );
  out.urine_glucose = lookupCoded_(
    rec['general_services/urine_glucose'], LAB_AVAILABILITY_MAP
  );
  out.hiv_rapid = lookupCoded_(
    rec['general_services/hiv_rapid'], LAB_AVAILABILITY_MAP
  );
  out.hiv_viral = lookupCoded_(
    rec['general_services/hiv_viral'], LAB_AVAILABILITY_MAP
  );
  out.syphilis_screening = lookupCoded_(
    rec['general_services/syphilis_screening'], LAB_AVAILABILITY_MAP
  );
  out.blood_group = lookupCoded_(
    rec['general_services/blood_group'], LAB_AVAILABILITY_MAP
  );
  out.malaria_smear = lookupCoded_(
    rec['general_services/malaria_smear'], LAB_AVAILABILITY_MAP
  );
  out.malaria_bs = lookupCoded_(
    rec['general_services/malaria_bs'], LAB_AVAILABILITY_MAP
  );
  out.hepatitis_b = lookupCoded_(
    rec['general_services/hepatitis_b'], LAB_AVAILABILITY_MAP
  );
  out.tb_test = lookupCoded_(
    rec['general_services/tb_test'], LAB_AVAILABILITY_MAP
  );
  out.blood_glucose = lookupCoded_(
    rec['general_services/blood_glucose'], LAB_AVAILABILITY_MAP
  );

  out.consultation = lookupCoded_(
    rec['human_resource_health/consultation'], OUTPATIENT_YES_NO_MAP
  );
  out.hrh_medical_officer = toIntegerOrBlank_(
    rec['human_resource_health/medical_officers']
  );
  out.hrh_medical_officer3 = lookupCoded_(
    rec['human_resource_health/medical_officers3'], OUTPATIENT_YES_NO_MAP
  );
  out.hrh_nurse_midwives = toIntegerOrBlank_(
    rec['human_resource_health/nurse_midwives']
  );
  out.hrh_nurse_midwives3 = lookupCoded_(
    rec['human_resource_health/nurse_midwives3'], OUTPATIENT_YES_NO_MAP
  );
  out.hrh_clinical_officers = toIntegerOrBlank_(
    rec['human_resource_health/clinical_officers']
  );
  out.hrh_clinical_officers3 = lookupCoded_(
    rec['human_resource_health/clinical_officers3'], OUTPATIENT_YES_NO_MAP
  );
  out.mental_health_expertise_access = lookupCoded_(
    rec['human_resource_health/mhe_access'], OUTPATIENT_YES_NO_MAP
  );
  out.staff_shortage = lookupCoded_(
    rec['human_resource_health/staff_shortage'], OUTPATIENT_YES_NO_MAP
  );

  out.mc_booklet = lookupCoded_(
    rec['health_records_facility/mc_booklet'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.anc_register = lookupCoded_(
    rec['health_records_facility/anc_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.pnc_register = lookupCoded_(
    rec['health_records_facility/pnc_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.infant_chart = lookupCoded_(
    rec['health_records_facility/inf_charts'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.immunization_register = lookupCoded_(
    rec['health_records_facility/imm_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.immunization_sheet = lookupCoded_(
    rec['health_records_facility/imm_sheet'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.immunization_tally = lookupCoded_(
    rec['health_records_facility/imm_tally'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.pmtct_register = lookupCoded_(
    rec['health_records_facility/prev_mtc'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.family_planning_register = lookupCoded_(
    rec['health_records_facility/fam_plan'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.gyna_outpatient_clinic_files = lookupCoded_(
    rec['health_records_facility/gyna_files'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.mental_status_assessment_tool = lookupCoded_(
    rec['health_records_facility/mental_stat'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.aysrh_register = lookupCoded_(
    rec['health_records_facility/aysrh_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.gbv_register = lookupCoded_(
    rec['health_records_facility/gbv_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.post_rape_care_form = lookupCoded_(
    rec['health_records_facility/prc_form'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.cancer_screening_form = lookupCoded_(
    rec['health_records_facility/cvc_form'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.cervical_cancer_screening_register = lookupCoded_(
    rec['health_records_facility/cvc_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.post_abortion_care_register = lookupCoded_(
    rec['health_records_facility/pac_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.presumptive_tb_register = lookupCoded_(
    rec['health_records_facility/ptb_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );

  return out;
}

function outpatientPreferredHeaders_() {
  return [
    UUID_FIELD,
    'date_started',
    'date_ended',
    'date_submitted',
    'county',
    'facility_level',
    'contact',
    'phone_number',
    'unit',
    'admission',
    'preconception_service',
    'gynecological_service',
  ]
    .concat(selectMultipleHeaders_(
      'general_services_family_plan',
      OUTPATIENT_FAMILY_PLAN_CHOICES
    ))
    .concat([
      'anc_low_risk',
      'anc_high_risk',
      'services_registration',
      'ultrasound_services',
      'mothers_pnc',
      'infants_pnc',
      'infant_immunization',
      'general_microscopy',
      'full_hemogram',
      'perform_urinalysis',
      'urine_rapid',
      'urine_protein',
      'urine_glucose',
      'hiv_rapid',
      'hiv_viral',
      'syphilis_screening',
      'blood_group',
      'malaria_smear',
      'malaria_bs',
      'hepatitis_b',
      'tb_test',
      'blood_glucose',
      'consultation',
      'hrh_medical_officer',
      'hrh_medical_officer3',
      'hrh_nurse_midwives',
      'hrh_nurse_midwives3',
      'hrh_clinical_officers',
      'hrh_clinical_officers3',
      'mental_health_expertise_access',
      'staff_shortage',
      'mc_booklet',
      'anc_register',
      'pnc_register',
      'infant_chart',
      'immunization_register',
      'immunization_sheet',
      'immunization_tally',
      'pmtct_register',
      'family_planning_register',
      'gyna_outpatient_clinic_files',
      'mental_status_assessment_tool',
      'aysrh_register',
      'gbv_register',
      'post_rape_care_form',
      'cancer_screening_form',
      'cervical_cancer_screening_register',
      'post_abortion_care_register',
      'presumptive_tb_register',
    ]);
}
