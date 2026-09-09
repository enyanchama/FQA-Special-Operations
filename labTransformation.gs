/** Lab transformation and preferred headers. */

const LAB_SOURCE_KEYS = makeKeySet_([
  'starttime',
  'start',
  'endtime',
  'end',
  'group_1/participation',
  'group_1/county',
  'group_1/gazetted',
  'group_1/facility',
  'group_1/contact',
  'group_1/con_faci',
  'group_1/nam_contact',
  'group_1/phone_contact',
  'group_1/units',
  'group_2/abo_blood',
  'group_2/abo_monthly',
  'group_2/perform_hbsag',
  'group_2/hbsag_monthly',
  'group_2/perform_rpr',
  'group_2/rpr_monthly',
  'group_2/perform_vdrl',
  'group_2/vdrl_monthly',
  'group_2/perform_syphilis',
  'group_2/perform_microscopy',
  'group_2/microscopy_monthly',
  'group_2/perform_hb',
  'group_2/HB_monthly',
  'group_2/per_urinalyisis_micro',
  'group_2/urinalyisis_micro_mon',
  'group_2/perform_urine_rapid',
  'group_2/urine_rapid_monthly',
  'group_2/perform_urine_protein',
  'group_2/urine_protein_monthly',
  'group_2/glucose_dipstick',
  'group_2/glucose_dipstick_monthly',
  'group_2/dipstick_param',
  'group_2/perform_hiv',
  'group_2/hivrapid_monthly',
  'group_2/perform_malaria',
  'group_2/malaria_monthly',
  'group_2/perform_tb',
  'group_2/tb_monthly',
  'group_2/perform_blood_gluc',
  'group_2/blood_gluc_monthly',
  'group_2/perform_vaginal_swab',
  'group_2/vaginal_swab_monthly',
  'group_2/perform_esr',
  'group_2/esr_monthly',
  'group_2/perform_thyroid',
  'group_2/thyroid_monthly',
  'group_2/perform_hormone_prof',
  'group_2/hormone_prof_monthly',
  'group_2/able_Hga1c',
  'group_2/Hga1c_monthly',
  'group_2/perform_crp',
  'group_2/crp_monthly',
  'group_2/perform_coombs',
  'group_2/coombs_monthly',
  'group_2/offer_bloodtransfusion',
  'group_2/transfusion_monthly',
  'group_2/perform_crossmatch',
  'group_2/crossmatch_monthly',
  'group_2/perform_hepc',
  'group_2/hepc_monthly',
  'group_2/per_urinalysis_culture',
  'group_2/culture_monthly',
  'group_2/per_hiv_elisa',
  'group_2/hiv_elisa_monthly',
  'group_2/eid_hiv',
  'group_2/per_dbs',
  'group_2/dbs_monthly',
  'group_2/sample_viral',
  'group_2/per_liver_tests',
  'group_2/liver_tests_monthly',
  'group_2/per_urea_elec',
  'group_2/urea_elec_monthly',
  'group_2/able_birirubin',
  'group_2/birirubin_monthly',
  'group_2/per_uric_acid',
  'group_2/uric_acid_monthly',
  'group_2/per_coagulation',
  'group_2/coagulation_monthly',
  'group_2/per_blood_culture',
  'group_2/blood_culture_monthly',
  'group_2/perform_pap_smear',
  'group_2/pap_smear_referral',
  'group_2/pap_smear_monthly',
  'group_2/per_hpv_testing',
  'group_2/HPV_testing_monthly',
  'group_2/via_test',
  'group_2/via_monthly',
  'group_2/perform_via',
  'group_2/per_hpylori',
  'group_2/hpylori_monthly',
]);

function transformLabRecord_(rec) {
  const out = {};
  out[UUID_FIELD] = rec[UUID_FIELD] == null ? '' : rec[UUID_FIELD];

  /*
   * Preserve every field not transformed below.
   * `_submission_time` is retained as a raw column too.
   */
  assignPassthrough_(out, rec, LAB_SOURCE_KEYS);

  out.date_started = formatDateMinute_(firstValue_(rec, ['starttime', 'start']));
  out.date_ended = formatDateMinute_(firstValue_(rec, ['endtime', 'end']));
  out.date_submitted = formatDateMinute_(rec['_submission_time']);

  out.participation = lookupCoded_(rec['group_1/participation'], LAB_YES_NO_MAP);
  out.county = lookupCoded_(rec['group_1/county'], COUNTY_MAP);
  out.facility_level = lookupCoded_(
    rec['group_1/gazetted'], OUTPATIENT_FACILITY_LEVEL_MAP
  );
  // Lab facility list has always matched the post-2026 coding (code 1 =
  // Kitutu), including 2024 submissions — do not apply the maternity cutoff.
  out.facility = lookupCoded_(rec['group_1/facility'], FACILITY_MAP_FROM_2026);
  out.contact = lookupCoded_(rec['group_1/contact'], CONTACT_PERSON_MAP);
  out.contact_other = rec['group_1/con_faci'] == null ? '' : rec['group_1/con_faci'];
  out.contact_name = rec['group_1/nam_contact'] == null
    ? '' : rec['group_1/nam_contact'];
  out.phone_number = rec['group_1/phone_contact'] == null
    ? '' : rec['group_1/phone_contact'];
  out.lab_unit = lookupCoded_(rec['group_1/units'], LAB_UNIT_MAP);

  out.abo_blood = lookupCoded_(
    rec['group_2/abo_blood'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.abo_monthly = lookupCoded_(rec['group_2/abo_monthly'], LAB_YES_NO_MAP);
  out.perform_hbsag = lookupCoded_(
    rec['group_2/perform_hbsag'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hbsag_monthly = lookupCoded_(rec['group_2/hbsag_monthly'], LAB_YES_NO_MAP);
  out.perform_rpr = lookupCoded_(
    rec['group_2/perform_rpr'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.rpr_monthly = lookupCoded_(rec['group_2/rpr_monthly'], LAB_YES_NO_MAP);
  out.perform_vdrl = lookupCoded_(
    rec['group_2/perform_vdrl'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.vdrl_monthly = lookupCoded_(rec['group_2/vdrl_monthly'], LAB_YES_NO_MAP);
  out.perform_syphilis = lookupCoded_(
    rec['group_2/perform_syphilis'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.perform_microscopy = lookupCoded_(
    rec['group_2/perform_microscopy'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.microscopy_monthly = lookupCoded_(
    rec['group_2/microscopy_monthly'], LAB_YES_NO_MAP
  );
  out.perform_hb = lookupCoded_(
    rec['group_2/perform_hb'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hb_monthly = lookupCoded_(rec['group_2/HB_monthly'], LAB_YES_NO_MAP);
  out.perform_urine_microscopy = lookupCoded_(
    rec['group_2/per_urinalyisis_micro'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.urine_microscopy_monthly = lookupCoded_(
    rec['group_2/urinalyisis_micro_mon'], LAB_YES_NO_MAP
  );
  out.perform_urine_rapid = lookupCoded_(
    rec['group_2/perform_urine_rapid'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.urine_rapid_monthly = lookupCoded_(
    rec['group_2/urine_rapid_monthly'], LAB_YES_NO_MAP
  );
  out.perform_urine_dipstick = lookupCoded_(
    rec['group_2/perform_urine_protein'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.urine_dipstick_monthly = lookupCoded_(
    rec['group_2/urine_protein_monthly'], LAB_YES_NO_MAP
  );
  out.glucose_dipstick = lookupCoded_(
    rec['group_2/glucose_dipstick'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.glucose_dipstick_monthly = lookupCoded_(
    rec['group_2/glucose_dipstick_monthly'], LAB_YES_NO_MAP
  );
  expandSelectMultiple_(
    out,
    rec['group_2/dipstick_param'],
    'dipstick_param',
    LAB_DIPSTICK_CHOICES
  );
  out.perform_hiv = lookupCoded_(
    rec['group_2/perform_hiv'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hiv_monthly = lookupCoded_(
    rec['group_2/hivrapid_monthly'], LAB_YES_NO_MAP
  );
  out.perform_malaria = lookupCoded_(
    rec['group_2/perform_malaria'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.malaria_monthly = lookupCoded_(
    rec['group_2/malaria_monthly'], LAB_YES_NO_MAP
  );
  out.perform_tb = lookupCoded_(
    rec['group_2/perform_tb'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.tb_monthly = lookupCoded_(rec['group_2/tb_monthly'], LAB_YES_NO_MAP);
  out.perform_blood_glucose = lookupCoded_(
    rec['group_2/perform_blood_gluc'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.blood_glucose_monthly = lookupCoded_(
    rec['group_2/blood_gluc_monthly'], LAB_YES_NO_MAP
  );
  out.perform_vaginal_swab = lookupCoded_(
    rec['group_2/perform_vaginal_swab'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.vaginal_swab_monthly = lookupCoded_(
    rec['group_2/vaginal_swab_monthly'], LAB_YES_NO_MAP
  );
  out.perform_esr = lookupCoded_(
    rec['group_2/perform_esr'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.esr_monthly = lookupCoded_(rec['group_2/esr_monthly'], LAB_YES_NO_MAP);
  out.perform_thyroid = lookupCoded_(
    rec['group_2/perform_thyroid'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.thyroid_monthly = lookupCoded_(
    rec['group_2/thyroid_monthly'], LAB_YES_NO_MAP
  );
  out.perform_hormone_profile = lookupCoded_(
    rec['group_2/perform_hormone_prof'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hormone_profile_monthly = lookupCoded_(
    rec['group_2/hormone_prof_monthly'], LAB_YES_NO_MAP
  );
  out.perform_hba1c = lookupCoded_(
    rec['group_2/able_Hga1c'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hba1c_monthly = lookupCoded_(
    rec['group_2/Hga1c_monthly'], LAB_YES_NO_MAP
  );
  out.perform_crp = lookupCoded_(
    rec['group_2/perform_crp'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.crp_monthly = lookupCoded_(rec['group_2/crp_monthly'], LAB_YES_NO_MAP);
  out.perform_coombs = lookupCoded_(
    rec['group_2/perform_coombs'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.coombs_monthly = lookupCoded_(
    rec['group_2/coombs_monthly'], LAB_YES_NO_MAP
  );
  out.offer_blood_transfusion = lookupCoded_(
    rec['group_2/offer_bloodtransfusion'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.transfusion_monthly = lookupCoded_(
    rec['group_2/transfusion_monthly'], LAB_YES_NO_MAP
  );
  out.perform_crossmatch = lookupCoded_(
    rec['group_2/perform_crossmatch'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.crossmatch_monthly = lookupCoded_(
    rec['group_2/crossmatch_monthly'], LAB_YES_NO_MAP
  );
  out.perform_hepc = lookupCoded_(
    rec['group_2/perform_hepc'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hepc_monthly = lookupCoded_(rec['group_2/hepc_monthly'], LAB_YES_NO_MAP);
  out.perform_urine_culture = lookupCoded_(
    rec['group_2/per_urinalysis_culture'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.urine_culture_monthly = lookupCoded_(
    rec['group_2/culture_monthly'], LAB_YES_NO_MAP
  );
  out.perform_hiv_elisa = lookupCoded_(
    rec['group_2/per_hiv_elisa'], LAB_HIV_ELISA_MAP
  );
  out.hiv_elisa_monthly = lookupCoded_(
    rec['group_2/hiv_elisa_monthly'], LAB_YES_NO_MAP
  );
  out.eid_hiv = lookupCoded_(rec['group_2/eid_hiv'], LAB_YES_NO_MAP);
  out.perform_dbs = lookupCoded_(
    rec['group_2/per_dbs'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.dbs_monthly = lookupCoded_(rec['group_2/dbs_monthly'], LAB_YES_NO_MAP);
  out.sample_viral_load = lookupCoded_(
    rec['group_2/sample_viral'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.perform_liver_tests = lookupCoded_(
    rec['group_2/per_liver_tests'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.liver_tests_monthly = lookupCoded_(
    rec['group_2/liver_tests_monthly'], LAB_YES_NO_MAP
  );
  out.perform_urea_electrolytes = lookupCoded_(
    rec['group_2/per_urea_elec'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.urea_electrolytes_monthly = lookupCoded_(
    rec['group_2/urea_elec_monthly'], LAB_YES_NO_MAP
  );
  out.perform_bilirubin = lookupCoded_(
    rec['group_2/able_birirubin'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.bilirubin_monthly = lookupCoded_(
    rec['group_2/birirubin_monthly'], LAB_YES_NO_MAP
  );
  out.perform_uric_acid = lookupCoded_(
    rec['group_2/per_uric_acid'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.uric_acid_monthly = lookupCoded_(
    rec['group_2/uric_acid_monthly'], LAB_YES_NO_MAP
  );
  out.perform_coagulation = lookupCoded_(
    rec['group_2/per_coagulation'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.coagulation_monthly = lookupCoded_(
    rec['group_2/coagulation_monthly'], LAB_YES_NO_MAP
  );
  out.perform_blood_culture = lookupCoded_(
    rec['group_2/per_blood_culture'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.blood_culture_monthly = lookupCoded_(
    rec['group_2/blood_culture_monthly'], LAB_YES_NO_MAP
  );
  out.perform_pap_smear = lookupCoded_(
    rec['group_2/perform_pap_smear'], LAB_YES_NO_MAP
  );
  out.pap_smear_referral = lookupCoded_(
    rec['group_2/pap_smear_referral'], LAB_YES_NO_MAP
  );
  out.pap_smear_monthly = lookupCoded_(
    rec['group_2/pap_smear_monthly'], LAB_YES_NO_MAP
  );
  out.perform_hpv = lookupCoded_(
    rec['group_2/per_hpv_testing'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hpv_monthly = lookupCoded_(
    rec['group_2/HPV_testing_monthly'], LAB_YES_NO_MAP
  );
  out.perform_via = lookupCoded_(
    firstValue_(rec, ['group_2/via_test', 'group_2/perform_via']),
    ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.via_monthly = lookupCoded_(rec['group_2/via_monthly'], LAB_YES_NO_MAP);
  out.perform_hpylori = lookupCoded_(
    rec['group_2/per_hpylori'], ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.hpylori_monthly = lookupCoded_(
    rec['group_2/hpylori_monthly'], LAB_YES_NO_MAP
  );

  return out;
}

function labPreferredHeaders_() {
  return [
    UUID_FIELD,
    'date_started',
    'date_ended',
    'date_submitted',
    'participation',
    'county',
    'facility_level',
    'facility',
    'contact',
    'contact_other',
    'contact_name',
    'phone_number',
    'lab_unit',
    'abo_blood',
    'abo_monthly',
    'perform_hbsag',
    'hbsag_monthly',
    'perform_rpr',
    'rpr_monthly',
    'perform_vdrl',
    'vdrl_monthly',
    'perform_microscopy',
    'microscopy_monthly',
    'perform_hb',
    'hb_monthly',
    'perform_urine_microscopy',
    'urine_microscopy_monthly',
    'perform_urine_rapid',
    'urine_rapid_monthly',
    'perform_urine_dipstick',
    'urine_dipstick_monthly',
  ]
    .concat(selectMultipleHeaders_('dipstick_param', LAB_DIPSTICK_CHOICES))
    .concat([
      'perform_hiv',
      'hiv_monthly',
      'perform_malaria',
      'malaria_monthly',
      'perform_tb',
      'tb_monthly',
      'perform_blood_glucose',
      'blood_glucose_monthly',
      'perform_vaginal_swab',
      'vaginal_swab_monthly',
      'perform_esr',
      'esr_monthly',
      'perform_thyroid',
      'thyroid_monthly',
      'perform_hormone_profile',
      'hormone_profile_monthly',
      'perform_hba1c',
      'hba1c_monthly',
      'perform_crp',
      'crp_monthly',
      'perform_coombs',
      'coombs_monthly',
      'offer_blood_transfusion',
      'transfusion_monthly',
      'perform_crossmatch',
      'crossmatch_monthly',
      'perform_hepc',
      'hepc_monthly',
      'perform_urine_culture',
      'urine_culture_monthly',
      'perform_hiv_elisa',
      'hiv_elisa_monthly',
      'eid_hiv',
      'perform_dbs',
      'dbs_monthly',
      'sample_viral_load',
      'perform_liver_tests',
      'liver_tests_monthly',
      'perform_urea_electrolytes',
      'urea_electrolytes_monthly',
      'perform_bilirubin',
      'bilirubin_monthly',
      'perform_uric_acid',
      'uric_acid_monthly',
      'perform_coagulation',
      'coagulation_monthly',
      'perform_blood_culture',
      'blood_culture_monthly',
      'perform_pap_smear',
      'pap_smear_referral',
      'perform_hpv',
      'hpv_monthly',
      'perform_via',
      'via_monthly',
      'perform_syphilis',
      'glucose_dipstick',
      'glucose_dipstick_monthly',
      'pap_smear_monthly',
      'perform_hpylori',
      'hpylori_monthly',
    ]);
}
