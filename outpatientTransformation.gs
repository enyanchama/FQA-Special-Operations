/** Outpatient transformation and preferred headers. */

const OUTPATIENT_SOURCE_KEYS = makeKeySet_([
  'starttime',
  'start',
  'endtime',
  'end',
  'facility_profile/county',
  'facility_profile/gazetted',
  'facility_profile/contact',
  'facility_profile/nam_contact',
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
  'general_services/foetal_nonstress',
  'general_services/via',
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
  'patient_confidentiality/visual_privacy',
  'patient_confidentiality/auditory_privacy',
  'patient_confidentiality/patient_files',
  'staff_training/date_canc',
  'staff_training/date_gbv',
  'staff_training/date_prtc',
  'staff_training/date_rmc',
  'staff_training/date_sicpti',
  'staff_training/date_pmtct',
  'staff_training/date_pnc',
  'staff_training/date_clients',
  'staff_training/date_fam_plan',
  'staff_training/date_crh',
  'staff_training/date_asrh',
  'staff_training/date_rhcs',
  'sops_policies/staffing_policy',
  'sops_policies/procument_protocols',
  'sops_policies/triage_protocols',
  'sops_policies/handwashing_protocols',
  'sops_policies/fam_plan_guide',
  'sops_policies/fam_plan_protocols',
  'sops_policies/cervical_cancer',
  'sops_policies/anc_protocols',
  'sops_policies/staff_sop_guide',
  'sops_policies/complicated_pregnancy',
  'sops_policies/pnc_protocols',
  'sops_policies/kepi_vaccine',
  'sops_policies/weaning_education',
  'sops_policies/child_growth',
  'sops_policies/inf_diarrhea',
  'wash_ipc/water_source',
  'wash_ipc/water_availability',
  'wash_ipc/drainage_system',
  'wash_ipc/hand_hygiene',
  'wash_ipc/waste_mgt',
  'wash_ipc/waste_bins',
  'wash_ipc/functional_toilet',
  'wash_ipc/sharp_container',
  'wash_ipc/sharp_capacity',
  'wash_ipc/handwash_area',
  'wash_ipc/latrine_types',
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
  out.contact_name = rec['facility_profile/nam_contact'] == null
    ? '' : rec['facility_profile/nam_contact'];
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
  out.foetal_nonstress = lookupCoded_(
    rec['general_services/foetal_nonstress'], OUTPATIENT_YES_NO_MAP
  );
  out.services_via = lookupCoded_(
    rec['general_services/via'], OUTPATIENT_YES_NO_MAP
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

  out.visual_privacy = lookupCoded_(
    rec['patient_confidentiality/visual_privacy'], ROOM_PRIVACY_MAP
  );
  out.auditory_privacy = lookupCoded_(
    rec['patient_confidentiality/auditory_privacy'], ROOM_PRIVACY_MAP
  );
  out.patient_filec_privacy = lookupCoded_(
    rec['patient_confidentiality/patient_files'], OUTPATIENT_YES_NO_MAP
  );

  out.training_date_canc = formatYearMonth_(rec['staff_training/date_canc']);
  out.training_date_gbv = formatYearMonth_(rec['staff_training/date_gbv']);
  out.training_date_prtc = formatYearMonth_(rec['staff_training/date_prtc']);
  out.training_date_rmc = formatYearMonth_(rec['staff_training/date_rmc']);
  out.training_date_ipc = formatYearMonth_(rec['staff_training/date_sicpti']);
  out.training_date_pmtct = formatYearMonth_(rec['staff_training/date_pmtct']);
  out.training_date_pnc = formatYearMonth_(rec['staff_training/date_pnc']);
  out.training_date_clients_support = formatYearMonth_(
    rec['staff_training/date_clients']
  );
  out.training_family_planning = formatYearMonth_(
    rec['staff_training/date_fam_plan']
  );
  out.training_date_crh = formatYearMonth_(rec['staff_training/date_crh']);
  out.training_date_adolescent_rh = formatYearMonth_(
    rec['staff_training/date_asrh']
  );
  out.training_date_rh_cancer_screening = formatYearMonth_(
    rec['staff_training/date_rhcs']
  );

  out.staffing_policy = lookupCoded_(
    rec['sops_policies/staffing_policy'], OUTPATIENT_YES_NO_MAP
  );
  out.procurement_protocol = lookupCoded_(
    rec['sops_policies/procument_protocols'], OUTPATIENT_YES_NO_MAP
  );
  out.triage_protocol = lookupCoded_(
    rec['sops_policies/triage_protocols'], OUTPATIENT_YES_NO_MAP
  );
  out.handwashing_protocols = lookupCoded_(
    rec['sops_policies/handwashing_protocols'], OUTPATIENT_SOP_DISPLAY_MAP
  );
  out.family_planning_guide = lookupCoded_(
    rec['sops_policies/fam_plan_guide'], OUTPATIENT_YES_NO_MAP
  );
  out.family_planning_protocol = lookupCoded_(
    rec['sops_policies/fam_plan_protocols'], OUTPATIENT_YES_NO_MAP
  );
  out.sop_cervical_cancer = lookupCoded_(
    rec['sops_policies/cervical_cancer'], OUTPATIENT_YES_NO_MAP
  );
  out.anc_protocols = lookupCoded_(
    rec['sops_policies/anc_protocols'], OUTPATIENT_SOP_DISPLAY_MAP
  );
  out.staff_sop_guide = lookupCoded_(
    rec['sops_policies/staff_sop_guide'], OUTPATIENT_YES_NO_MAP
  );
  out.complicated_pregnancy = lookupCoded_(
    rec['sops_policies/complicated_pregnancy'], OUTPATIENT_YES_NO_MAP
  );
  out.sops_pnc_protocol = lookupCoded_(
    rec['sops_policies/pnc_protocols'], OUTPATIENT_PROTOCOL_AVAILABILITY_MAP
  );
  out.sops_kepi_vaccine = lookupCoded_(
    rec['sops_policies/kepi_vaccine'], OUTPATIENT_PROTOCOL_AVAILABILITY_MAP
  );
  out.sops_weaning_education = lookupCoded_(
    rec['sops_policies/weaning_education'], OUTPATIENT_YES_NO_MAP
  );
  out.sops_child_growth = lookupCoded_(
    rec['sops_policies/child_growth'], OUTPATIENT_YES_NO_MAP
  );
  out.sops_infant_diarrhea = lookupCoded_(
    rec['sops_policies/inf_diarrhea'], OUTPATIENT_YES_NO_MAP
  );

  out.wash_water_source = lookupCoded_(
    rec['wash_ipc/water_source'], WATER_SOURCE_MAP
  );
  out.wash_water_availability = lookupCoded_(
    rec['wash_ipc/water_availability'], OUTPATIENT_YES_NO_MAP
  );
  out.wash_drainage = lookupCoded_(
    rec['wash_ipc/drainage_system'], OUTPATIENT_YES_NO_MAP
  );
  out.wash_hand_hygiene = lookupCoded_(
    rec['wash_ipc/hand_hygiene'], OUTPATIENT_HAND_HYGIENE_MAP
  );
  out.wash_waste_management = lookupCoded_(
    rec['wash_ipc/waste_mgt'], WASTE_MANAGEMENT_MAP
  );
  out.wash_waste_bins = lookupCoded_(
    rec['wash_ipc/waste_bins'], OUTPATIENT_YES_NO_MAP
  );
  out.wash_functional_toilet = lookupCoded_(
    rec['wash_ipc/functional_toilet'], OUTPATIENT_YES_NO_MAP
  );
  out.wash_sharp_container = lookupCoded_(
    rec['wash_ipc/sharp_container'], OUTPATIENT_YES_NO_MAP
  );
  out.wash_sharp_capacity = lookupCoded_(
    rec['wash_ipc/sharp_capacity'], OUTPATIENT_YES_NO_MAP
  );
  out.was_handwash_area = lookupCoded_(
    rec['wash_ipc/handwash_area'], OUTPATIENT_YES_NO_MAP
  );
  out.wash_latrine_type = lookupCoded_(
    rec['wash_ipc/latrine_types'], MATERNITY_LATRINE_MAP
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
    'contact_name',
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
      'foetal_nonstress',
      'services_via',
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
      'visual_privacy',
      'auditory_privacy',
      'patient_filec_privacy',
      'training_date_canc',
      'training_date_gbv',
      'training_date_prtc',
      'training_date_rmc',
      'training_date_ipc',
      'training_date_pmtct',
      'training_date_pnc',
      'training_date_clients_support',
      'training_family_planning',
      'training_date_crh',
      'training_date_adolescent_rh',
      'training_date_rh_cancer_screening',
      'staffing_policy',
      'procurement_protocol',
      'triage_protocol',
      'handwashing_protocols',
      'family_planning_guide',
      'family_planning_protocol',
      'sop_cervical_cancer',
      'anc_protocols',
      'staff_sop_guide',
      'complicated_pregnancy',
      'sops_pnc_protocol',
      'sops_kepi_vaccine',
      'sops_weaning_education',
      'sops_child_growth',
      'sops_infant_diarrhea',
      'wash_water_source',
      'wash_water_availability',
      'wash_drainage',
      'wash_hand_hygiene',
      'wash_waste_management',
      'wash_waste_bins',
      'wash_functional_toilet',
      'wash_sharp_container',
      'wash_sharp_capacity',
      'was_handwash_area',
      'wash_latrine_type',
    ]);
}
