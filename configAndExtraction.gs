/** FQA QuIPS — configuration, extraction, staging and shared helpers. */

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

const COUNTY_MAP = {
  1: 'Mombasa', 2: 'Makueni', 3: 'Kisii', 4: 'Nakuru', 5: "Murang'a", 6: 'Kakamega',
};
const FACILITY_LEVEL_MAP = { 2: 'Level 2', 3: 'Level 3', 4: 'Level 4' };
const CONTACT_PERSON_MAP = {
  1: 'Clinical officer in charge',
  2: 'Nursing officer in charge',
  3: 'Facility in charge',
  4: 'MNH in charge',
  5: 'Medical officer in charge',
  6: 'Medical superintendent',
  7: 'Other, please specify',
};
const YES_NO_MAP = { 1: 'Yes', 0: 'No' };
const REFERRAL_WEIGHT_MAP = {
  1: 'Any infant less than 1.7kg',
  2: 'Any infant less than 2kg',
  3: 'Any infant less than 2.5kg',
};
const LAB_AVAILABILITY_MAP = {
  1: 'Yes',
  2: 'No but can be performed in facility laboratory',
  3: 'No cannot be performed at this facility',
};
const MATERNITY_LAB_AVAILABILITY_MAP = {
  1: 'Yes',
  2: 'No, but can be performed in the facility laboratory',
  3: 'No, cannot be performed at this facility',
};
const UNIT_AVAILABILITY_MAP = {
  1: 'Yes - immediately available in this unit',
  2: 'No but can be performed in facility laboratory',
  3: 'No cannot be performed at this facility',
};
const RADIOLOGY_AVAILABILITY_MAP = {
  1: 'Yes - immediately available in this unit',
  2: 'No but can be performed in facility radiology unit',
  3: 'No cannot be performed at this facility',
};
const IMAGING_TIME_MAP = {
  1: 'Less than hour',
  2: 'One to <2 hours',
  3: '2 to 4 hours',
  4: '> 4 hours',
};
const NEWBORN_ADMISSION_AVAIL_MAP = {
  1: 'Always available',
  2: 'Sometimes available',
  3: 'Never available',
};
const MATERNITY_FILE_AVAILABILITY_MAP = {
  1: 'Always available',
  2: 'Sometimes available',
  3: 'Never available',
  4: 'Have not needed this form in the past 3 months',
};
const ROOM_PRIVACY_MAP = {
  1: 'All rooms',
  2: 'Some rooms',
  3: 'No rooms',
};
const SOP_PROTOCOL_MAP = {
  1: 'They have displayed, up to date protocols',
  2: 'They have written up to date protocols, not displayed',
  3: 'They do not have up to date displayed or written protocols',
};
const WATER_SOURCE_MAP = {
  1: 'Present, functional',
  2: 'Present, non-functional',
  3: 'Not present',
};
const HAND_HYGIENE_MAP = {
  1: 'Present in ALL service areas',
  2: 'Present in some service areas',
  3: 'Not present in service areas',
};
const WASTE_MANAGEMENT_MAP = {
  1: 'Present, well displayed',
  2: 'Present, not displayed',
  3: 'Not present',
};
const EQUIP_FUNCTIONAL_MAP = {
  1: 'Yes, functional',
  2: 'Yes, non-functional',
  3: 'No',
};
const ALWAYS_SOMETIMES_NEVER_MAP = {
  1: 'Always',
  2: 'Sometimes',
  3: 'Never',
};
const NBU_OPEN_MAP = {
  1: '< 24 hours per day',
  3: '24 hours per day',
};
const ULTRASOUND_AVAIL_MAP = {
  1: 'Yes, available in this unit',
  2: 'No but available in a separate unit in this facility',
  3: 'Not available in this facility',
};
/**
 * select_multiple: records/patient_files
 * Output columns: patient_files_<choice_slug> = Yes / No / '' (blank if skipped)
 */
const PATIENT_FILES_CHOICES = [
  { code: '1', slug: 'observation_charts' },
  { code: '2', slug: 'treatment_sheet' },
  { code: '3', slug: 'weight_chart' },
  { code: '4', slug: 'medication_chart' },
  { code: '5', slug: 'ballard_scoring_sheet' },
  { code: '6', slug: 'input_output_monitoring_chart' },
  { code: '7', slug: 'vital_signs_chart' },
  { code: '8', slug: 'care_plans' },
  { code: '9', slug: 'discharge_summary' },
  { code: '10', slug: 'consent_form' },
  { code: '11', slug: 'pre_medication_notes' },
  { code: '12', slug: 'continuation_sheet' },
  { code: '13', slug: 'none' },
];

/**
 * select_multiple: sop/policy
 * Output columns: sop_policy_<choice_slug> = Yes / No / '' (blank if skipped)
 */
const SOP_POLICY_CHOICES = [
  { code: '1', slug: 'incubator_temperature_setting' },
  { code: '2', slug: 'gestational_age_assessment' },
  { code: '3', slug: 'essential_newborn_care' },
  { code: '4', slug: 'pre_maturity' },
  { code: '5', slug: 'low_birth_weight' },
  { code: '6', slug: 'neonatal_convulsions' },
  { code: '7', slug: 'neonatal_asphyxia' },
  { code: '8', slug: 'neonatal_infection_sepsis' },
  { code: '9', slug: 'congenital_malformations' },
  { code: '10', slug: 'macrosomic_babies' },
  { code: '11', slug: 'breastfeeding' },
  { code: '12', slug: 'handling_of_ebm' },
  { code: '13', slug: 'assisted_feeding' },
  { code: '14', slug: 'standard_infection_prevention_control_and_precautions_for_transmission' },
  { code: '15', slug: 'pre_referral_stabilization_of_infants' },
  { code: '16', slug: 'verbal_and_written_hand_over_of_newborns_at_shift_changes' },
  { code: '17', slug: 'triage_and_waiting_times_for_emergency_and_non_emergency_consultations_and_treatment' },
  { code: '18', slug: 'kmc' },
  { code: '19', slug: 'none' },
];

const RESUS_EQUIP_CHOICES = [
  { code: '1', slug: '200ml_ambubag' },
  { code: '2', slug: '300ml_ambubag' },
  { code: '3', slug: 'size_0_ambubag_masks' },
  { code: '4', slug: 'size_1_ambubag_masks' },
  { code: '5', slug: 'size_2_ambubag_masks' },
  { code: '6', slug: 'none' },
];

const OXY_SOURCE_CHOICES = [
  { code: '1', slug: 'full_oxygen_cylinders_or_central_supply' },
  { code: '2', slug: 'oxygen_concentrator' },
  { code: '3', slug: 'oxygen_masks_different_sizes' },
  { code: '4', slug: 'nasal_prongs_different_sizes' },
  { code: '5', slug: 'nasal_prongs_for_continuous_positive_airway_pressure_cpap' },
  { code: '6', slug: 'none' },
];

const CANNULAE_CHOICES = [
  { code: '1', slug: 'size_24' },
  { code: '2', slug: 'size_26' },
  { code: '3', slug: 'none' },
];

const SIZE_4_6_8_CHOICES = [
  { code: '1', slug: 'size_4' },
  { code: '2', slug: 'size_6' },
  { code: '3', slug: 'size_8' },
  { code: '4', slug: 'none' },
];

const MATERIALS_CHOICES = [
  { code: '1', slug: 'kmc' },
  { code: '2', slug: 'breastfeeding' },
  { code: '3', slug: 'latching' },
  { code: '4', slug: 'neonatal_danger_signs' },
  { code: '5', slug: 'cord_care' },
  { code: '6', slug: 'none' },
];

const MATERNITY_IMMUNIZATION_CHOICES = [
  { code: '1', slug: 'bcg' },
  { code: '2', slug: 'hep_b' },
  { code: '3', slug: 'opv' },
  { code: '4', slug: 'none' },
];

const MATERNITY_PATIENT_FILE_CHOICES = [
  { code: '1', slug: 'observation_charts' },
  { code: '2', slug: 'patient_cardex' },
  { code: '3', slug: 'fluid_ins_outs_record' },
  { code: '4', slug: 'partograph' },
  { code: '5', slug: 'treatment_sheet' },
  { code: '6', slug: 'care_plans' },
  { code: '7', slug: 'discharge_summary' },
  { code: '8', slug: 'consent_form' },
  { code: '9', slug: 'pre_medication_notes' },
  { code: '10', slug: 'theatre_notes' },
  { code: '11', slug: 'consultation_progress_notes' },
  { code: '12', slug: 'none' },
];

const MATERNITY_BED_SPACE_MAP = {
  1: 'All beds are appropriately spaced',
  2: 'Some beds are appropriately spaced',
  3: 'No beds are appropriately spaced',
};

const MATERNITY_BARRIER_MAP = {
  1: 'Visual barriers in place for ALL exam spaces',
  2: 'Visual barriers in place for SOME exam spaces',
  3: 'Visual barriers in place for NO exam spaces',
};

const MATERNITY_DISPOSABLE_TOWELS_MAP = {
  1: 'Present in ALL service areas',
  2: 'Present in some service areas',
  3: 'Present in no service areas',
};

const MATERNITY_LATRINE_MAP = {
  1: 'Flush/pour flush to piped sewer system, septic tank',
  2: 'Pit latrine (ventilated improved pit latrine (VIP)) with slab',
  3: 'Pit latrine without slab/open pit',
  4: 'Composting toilet',
  5: 'Bucket',
  6: 'Hanging toilet/hanging latrine',
  7: 'Other, specify',
  8: 'None',
};

const MATERNITY_BATHROOM_CLEANING_MAP = {
  1: 'Daily AND as necessary',
  2: 'Daily',
  3: 'ONLY when they are visibly dirty',
  4: 'They are not cleaned routinely with disinfectant solution',
};

const MATERNITY_POLICY_A_CHOICES = [
  { code: '1', slug: 'pain_management_in_labour' },
  { code: '2', slug: 'breastfeeding' },
  { code: '3', slug: 'postnatal_care_in_the_maternity_and_or_postnatal_care_areas_of_the_maternity_unit' },
  { code: '4', slug: 'standard_infection_prevention_control_and_precautions_for_transmission' },
  { code: '5', slug: 'harmful_practices_and_unnecessary_interventions_during_labour_childbirth_and_the_early_postnatal_period' },
  { code: '6', slug: 'identification_pre_referral_management_and_referral_of_women_with_complications_related_to_pregnancy_labour_childbirth_and_postpartum_period' },
  { code: '7', slug: 'obstetric_hemorrhage' },
  { code: '8', slug: 'premature_labour' },
  { code: '9', slug: 'pre_eclampsia_and_post_eclampsia' },
  { code: '10', slug: 'anaemia' },
  { code: '11', slug: 'none' },
];

const MATERNITY_POLICY_B_CHOICES = [
  { code: '1', slug: 'abnormal_lie_after_36_weeks' },
  { code: '2', slug: 'treatment_of_women_with_or_at_risk_for_infections_during_labour_childbirth_and_the_early_postnatal_period' },
  { code: '3', slug: 'febrile_conditions' },
  { code: '4', slug: 'deep_venous_thrombosis' },
  { code: '5', slug: 'chronic_medical_conditions' },
  { code: '6', slug: 'prolonged_obstructed_labour' },
  { code: '7', slug: 'fetal_distress_cord_accidents' },
  { code: '8', slug: 'maternal_sepsis' },
  { code: '9', slug: 'maternal_resuscitation_cpr' },
  { code: '10', slug: 'post_partum_sepsis' },
  { code: '11', slug: 'none' },
];

const MATERNITY_POLICY_C_CHOICES = [
  { code: '1', slug: 'postpartum_psychosis' },
  { code: '2', slug: 'essential_newborn_care' },
  { code: '3', slug: 'pre_maturity' },
  { code: '4', slug: 'low_birth_weight' },
  { code: '5', slug: 'neonatal_convulsions' },
  { code: '6', slug: 'neonatal_asphyxia' },
  { code: '7', slug: 'neonatal_infection_sepsis' },
  { code: '8', slug: 'congenital_malformations' },
  { code: '9', slug: 'macrosomic_babies' },
  { code: '10', slug: 'wound_care' },
  { code: '11', slug: 'none' },
];

const MATERNITY_POLICY_D_CHOICES = [
  { code: '1', slug: 'how_to_deal_with_the_deceased' },
  { code: '2', slug: 'handling_and_processing_of_contaminated_materials_and_infectious_waste' },
  { code: '3', slug: 'triage_and_waiting_times_for_emergency_and_non_emergency_consultations_and_treatment' },
  { code: '4', slug: 'verbal_and_written_hand_over_of_women_and_newborns_at_shift_changes' },
  { code: '5', slug: 'against_inappropriate_use_of_social_media_by_health_workers' },
  { code: '6', slug: 'obtaining_informed_consent_before_examinations_and_procedures' },
  { code: '7', slug: 'companion_of_choice_during_labour_childbirth_and_immediate_postnatal_period' },
  { code: '8', slug: 'zero_tolerance_non_discriminatory_policy_against_mistreatment' },
  { code: '9', slug: 'none' },
];

const FACILITY_MAP_FROM_2026 = {
  1: 'Kitutu Chache North Sub County Referral Hospital',
  2: 'Entanda Health Centre',
  3: 'Kenyenya Sub County Hospital',
  4: 'Gucha Sub County Referral Hospital',
  5: 'Nyamache Sub County Referral Hospital',
  6: 'Nyacheki Sub County Hospital',
  7: 'Gesusu Sub-County Referral Hospital',
  8: 'Masimba Sub-County Hospital',
  9: 'Keumbu Sub County Hospital',
  10: 'Christamarianne Mission Hospital',
  11: 'Nyanchwa Adventist Hospital',
  12: 'Nduru Sub County Referral Hospital',
  13: 'Etago Sub-county Hospital',
  14: 'Tabaka Mission Hospital',
  15: 'Iyabe Sub County Hospital',
  16: 'Kisii Teaching And Referral Hospital (Level 6)',
  17: 'Iranda Sub-County Hospital',
  18: 'Mosocho Market Dispensary',
  19: 'Kioge Dispensary',
  20: 'Matongo Health Centre',
  21: 'Nyaore Dispensary',
  22: 'Raganga Health Centre',
  23: 'Keera Dispensary',
  24: 'Kiamwasi Dispensary',
  25: 'Getembe Dispensary',
  26: 'Mwamogesa Dispensary',
  27: 'Oresi Sub County Hospital',
  28: 'Ram Hospital',
  29: 'Mediforte Hospital Limited',
  30: 'Oasis Specialist Hospital',
  31: 'Nyangena Hospital',
  32: 'Bosongo Medical Centre',
  33: 'Mbooni Sub County Hospital',
  34: 'Tawa Sub-County Hospial',
  35: 'Tulimani Health Centre',
  36: 'Katilini Dispensary',
  37: 'Ngai Health Center',
  38: 'Kako Health Centre',
  39: 'Kalawa Sub County Hospital',
  40: 'Kali Health Centre',
  41: 'Kaliani Health Centre',
  42: 'Kathulumbi Health Centre',
  43: 'Kisau Sub County Hospital',
  44: 'Kisoi Munyao Memorial Health Centre',
  45: 'Utuneni Dispensary',
  46: 'Uviluni Dispensary',
  47: 'Emali Sub County Hospital',
  48: 'Mukuyuni Sub County Hospital',
  49: 'Waia Dispensary',
  50: 'Kilungu Sub County Hospital',
  51: 'Kibwezi Sub County Hospital',
  52: 'Kambu Sub County Hospital',
  53: 'Mtito Andei Sub County Hospital',
  54: 'Makindu Sub County Hospital',
  55: 'Nthongoni Sub County Hospital',
  56: 'Matiliku Sub County Hospital',
  57: 'Sultan Hamud Sub County Hospital',
  58: 'Makueni County Referral Hospital',
  59: 'Jomvu Model Health Centre',
  60: 'Miritini CDF Health Centre',
  61: 'Bokole CDF Dispensary',
  62: 'Mlaleo CDF Health Centre',
  63: 'Mikindani Hospital',
  64: 'Port Reitz Sub County Hospital',
  65: 'Sayyida Fatimah Hospital',
  66: 'Likoni Subcounty Hospital',
  67: 'Mrima Maternity Hospital',
  68: 'St Thomas Maternity Hospital - Ferry Branch',
  69: 'Mbungoni Catholic Dispensary (CBHC)',
  70: 'Shika Adabu (MCM) Dispensary',
  71: 'Mbuta Model Health Centre',
  72: 'Mtongwe Health Centre',
  73: 'Mtongwe Dispensary',
  74: 'Coast General Teaching and Referral Hospital Vikwatani Outreach Centre',
  75: 'Shimo La Tewa Annex GK Prison Dispensary',
  76: 'Tudor District Hospital (Mombasa)',
  77: 'Coast General Teaching and Referal Hospital-Utange Fied Hospital',
  78: 'Coast General Teaching and Referral Hospital',
  79: 'Shelly Beach Hospital',
  80: 'Bahati Sub County Hospital',
  81: 'Njoro Sub County Hospital',
  82: 'Mau Narok Health Centre',
  83: 'Molo Sub County hospital',
  84: 'Elburgon Sub County Hospital',
  85: 'Olenguruone Sub County Hospital',
  86: 'Keringet Sub county Hospital',
  87: 'Mirugi Kariuki Sub County Hospital',
  88: 'Lanet Health Centre',
  89: 'Bondeni Sub County Hospital',
  90: 'Our Lady Of Mercy Mission Hospital',
  91: 'Soin Sub county hospital',
  92: 'Rongai Health Centre',
  93: "Mang'u Health Centre",
  94: 'Subukia Sub County Hospital',
  95: 'Naivasha Sub County Hospital',
  96: 'Karagita Health Centre',
  97: 'Olkaria Community Health Centre (Naivasha)',
  98: 'Oserian Health Centre',
  99: 'Mai Mahiu Health Centre',
  100: 'Maiela Health Centre',
  101: 'Naivasha (AIC) Medical Centre',
  102: 'Mulemi Hospital.',
  103: 'Annex Hospital',
  104: 'Nakuru County Teaching and Referral Hospital',
  105: 'Ronda Health Centre',
  106: 'Kuresoi Health Centre',
  107: 'Gilgil Sub county Hospital',
  108: 'Kiptangwanyi Health Center',
  109: "Murang'a County Referal Hospital",
  110: 'Kirwara Sub County Hospital',
  111: 'Muriranjas Sub County Hospital',
  112: 'Kandara Sub County Hospital',
  113: 'Gaichanjiru Mission Hospital',
  114: 'Kiriaini Mission Hospital',
  115: 'Kigumo Sub County Hospital',
  116: 'Kangema Sub County Hospital',
  117: 'Maragua Sub County Hospital',
  118: 'Makuyu Health Centre',
  119: 'Kenol Hospital',
  120: 'Kamahuha Health Centre',
  121: 'Maragua Ridge Health Centre',
  122: 'Gikono Dispensary',
  123: 'Kambiti Dispensary',
  124: 'Ithanga Health Centre',
  125: 'Kakamega County General Refferal Hospital',
  126: 'Navakholo sub county Hospital',
  127: 'Bushiri Health Centre',
  128: 'Khwisero SC county hospital',
  129: 'Butere sub county Hopsital',
  130: 'Lumakanda Sub county Hospital',
  131: 'Mautuma Sub County Hospital',
  132: 'Matungu sub county Hospital',
  133: 'Malava Sub County Hospital',
  134: 'Shivanga Health Center',
  135: 'Shamberere Health Center',
  136: 'Chevoso Dispensary',
  137: 'Chombeli Health Center',
  138: 'Sheywe Dispensary',
  139: 'Kuvasali Health Center',
  140: "Kimang'eti Dispensary",
  141: 'St Marthas Chimoi Health Centre',
  142: 'Kakamega Orthopaedic Hospital',
  143: 'Likuyani Sub County Hospital',
  144: 'Matunda Sub County Hospital',
  145: 'Iguhu Sub County Hospital',
  146: 'Shibwe Sub County Hospital',
  147: 'Mukumu Hospital',
  148: 'Mumias Hospital',
  149: "St Mary's Hospital (Mumias)",
};

const FACILITY_MAP_BEFORE_2026 = {
  1: 'Matongo Medical Clinic',
  2: 'Eberege Health Centre',
  3: 'Isecha Health Centre',
  4: 'Kegogi Health Centre',
  5: 'Kionyo Health Centre',
  6: 'Magena Health Centre',
  7: 'Magenche Health Centre',
  8: 'Moticho Health Centre',
  9: 'Riana Health Centre',
  10: 'Riotanchi Health Centre',
  11: 'Entanda Health Centre',
  12: 'Oresi Health Centre',
  13: 'Raganga Health Centre',
  14: 'Etago Sub-County Hospital',
  15: 'Iranda Sub-County Referral Hospital',
  16: 'Iyabe Sub County Hospital',
  17: 'Gesusu Sub-County Referral Hospital',
  18: 'Gucha Sub County Referral Hospital',
  19: 'Kenyenya Sub County Referral Hospital',
  20: 'Keumbu Sub County Hospital',
  21: 'Nyamache Sub County Referral Hospital',
  22: 'Kitutu Chache North Sub County Referral Hospital',
  23: 'Masimba Sub-County Hospital',
  24: 'Nduru Sub County Referral Hospital',
  25: 'Misesi Sub County Hospital',
  26: 'Nyamagundo sub county hospital',
  27: 'Nyamasibi Sub-County Hospital',
  28: 'Suguta Sub County Hospital',
  29: 'Kisii Teaching And Referral Hospital (Level 6)',
  30: 'Bamburi Dispensary',
  31: 'Cdc Ganjoni Dispensary',
  32: 'Junda Dispensary',
  33: 'Magongo (MCM) Dispensary',
  34: 'Majengo Dispensary (Mombasa)',
  35: 'Maweni CDF Dispensary',
  36: 'Mikindani (MCM) Dispensary',
  37: 'Mtongwe (MCM) Dispensary',
  38: 'Mwembe Tayari Dispensary',
  39: 'Shika Adabu (MCM) Dispensary',
  40: 'Shimo La Tewa Annex Dispensary (GK Prison)',
  41: 'Bokole CDF Dispensary',
  42: 'Coast General Teaching and Referral Hospital (Chaani Outreach Centre)',
  43: 'Coast General Teaching and Referral Hospital Vikwatani Outreach Centre',
  44: 'Jomvu Model Health Centre',
  45: 'Kisauni Health Centre',
  46: 'Kongowea Health Centre',
  47: 'Mbuta Model Health Centre',
  48: 'Miritini CDF Health Centre',
  49: 'Mlaleo Health Centre (MOH)',
  50: 'Mvita Dispensary',
  51: 'Shimo-La Tewa Health Centre (GK Prison)',
  52: "Ziwa la ngo'mbe Health centre",
  53: 'Likoni Subcounty Hospital',
  54: 'Mrima Maternity Hospital',
  55: 'Port Reitz Sub County Hospital',
  56: 'Tudor District Hospital (Mombasa)',
  57: 'Coast General Teaching and Referral Hospital',
  58: 'Kasikeu Dispensary',
  59: 'Tulimani Health Centre',
  60: 'Kalulini Health Centre (Kibwezi)',
  61: 'Ilatu Health Centre',
  62: 'Masongaleni Health Centre',
  63: 'Kilala Health Centre',
  64: 'Kyambeke Health Centre',
  65: 'Ngwata Health Centre',
  66: 'Kanzokea Health Centre',
  67: 'Nziu Health Centre',
  68: 'Kalawa Sub County Hospital',
  69: 'Kathonzweni Health Centre',
  70: 'Itumbule Health Centre',
  71: 'Mavindini Health Centre',
  72: 'Nthongoni Health Centre',
  73: 'Emali Model Health Centre',
  74: 'Athi Kamunyuni Health Centre',
  75: 'Kisau Sub County Hospital',
  76: 'Mtito Andei Sub County Hospital',
  77: 'Mukuyuni Sub County Hospital',
  78: 'Mbooni Sub County Hospital',
  79: 'Kibwezi Sub County Hospital',
  80: 'Matiliku Sub County Hospital',
  81: 'Sultan Hamud Sub County Hospital',
  82: 'Makindu Sub County Hospital',
  83: 'Kambu Sub County Hospital',
  84: 'Tawa Sub County Hospial',
  85: 'Kikoko Mission Hospital',
  86: 'Kilungu Sub County Hospital',
  87: 'Makueni County Referral Hospital',
};



function makeKeySet_(keys) {
  const set = {};
  keys.forEach(function (key) { set[key] = true; });
  return set;
}

const NEWBORN_UNIT_SOURCE_KEYS = makeKeySet_([
  'Section_13_Hours_of_Operation/lab_open',
  '_submission_time',
  'adherence/birth_weight',
  'adherence/breastmilk',
  'adherence/care',
  'adherence/caregiver',
  'adherence/condition',
  'adherence/disch_note',
  'adherence/discharge',
  'adherence/express',
  'adherence/feeding',
  'adherence/gestation',
  'adherence/inf_refer',
  'adherence/kmc2',
  'adherence/neonates',
  'adherence/paediatric',
  'adherence/plan',
  'adherence/preterm',
  'adherence/system',
  'adherence/weight',
  'commodities/catheters',
  'commodities/chlorhexidine',
  'commodities/cups',
  'commodities/inf_form',
  'commodities/iv_fluid',
  'commodities/iv_sets',
  'commodities/latex',
  'commodities/materials',
  'commodities/microdrippers',
  'commodities/needles',
  'commodities/soluset',
  'commodities/sterile',
  'commodities/suction',
  'commodities/syringes',
  'commodities/tetraycline',
  'commodities/tubes',
  'commodities/vitk',
  'end',
  'endtime',
  'equip/bed_space',
  'equip/beds',
  'equip/bulbs',
  'equip/cannulae',
  'equip/clock',
  'equip/cpap',
  'equip/drip_stands',
  'equip/exam_light',
  'equip/glucometer',
  'equip/heat',
  'equip/lamp',
  'equip/low_therm',
  'equip/monitors',
  'equip/neobp',
  'equip/oximeters',
  'equip/oxy_source',
  'equip/pump',
  'equip/resus_equip',
  'equip/resuscitaires',
  'equip/scale',
  'equip/stethoscopes',
  'equip/therm',
  'equip/thermometer',
  'equip/trans_kit',
  'equip/warmer',
  'facility_profile/contact',
  'facility_profile/county',
  'facility_profile/facility',
  'facility_profile/gazetted_facility',
  'facility_profile/nam_contact',
  'facility_profile/phone_contact',
  'facility_profile/unit',
  'privacy/auditory_privacy',
  'privacy/visual_privacy',
  'records/consistent_use',
  'records/death_reg',
  'records/inpatient_neonatal_reg',
  'records/integrated_rh_mch',
  'records/nb_admission',
  'records/patient_files',
  'records/perinatal_notification',
  'records/perinatal_review',
  'resource/adeq_cos',
  'resource/adeq_mos',
  'resource/adeq_rn',
  'resource/available_24hrs',
  'resource/contract_cos',
  'resource/contract_mos',
  'resource/contract_neonatologists',
  'resource/contract_paed',
  'resource/contract_rn',
  'resource/employed_cos',
  'resource/employed_mos',
  'resource/employed_neonatologists',
  'resource/employed_paed',
  'resource/employed_rn',
  'sanitation/access',
  'sanitation/bins',
  'sanitation/checklist',
  'sanitation/clean',
  'sanitation/clean_reg',
  'sanitation/decontamination',
  'sanitation/disinfect',
  'sanitation/drainage',
  'sanitation/hand',
  'sanitation/lat_client',
  'sanitation/latrine',
  'sanitation/laundry',
  'sanitation/linen',
  'sanitation/menstrual',
  'sanitation/sharp',
  'sanitation/sharp3_4',
  'sanitation/sharp_full',
  'sanitation/sinks',
  'sanitation/station',
  'sanitation/utensil',
  'sanitation/waste',
  'sanitation/wat_sour',
  'sanitation/wav_avail',
  'service/asphyxia_care',
  'service/avg_time',
  'service/bilirubin',
  'service/blood_count',
  'service/blood_cultures',
  'service/blood_group',
  'service/bone_chem',
  'service/congenital_care',
  'service/coombs',
  'service/cranial_ultras',
  'service/creatinine',
  'service/crp_test',
  'service/electrolyte',
  'service/glucose',
  'service/hiv_antibody',
  'service/liver_func',
  'service/lumbar',
  'service/malaria_test',
  'service/needs',
  'service/nursing_care',
  'service/nutritional_services',
  'service/premature_care',
  'service/referral_weight',
  'service/thyroid_test',
  'service/urinalysis',
  'service/urine',
  'service/x_ray',
  'sop/handwash',
  'sop/hypoglycemia',
  'sop/hypoglycemia_001',
  'sop/hypoglycemia_sop',
  'sop/jaundice',
  'sop/kmc',
  'sop/neo_resus',
  'sop/policy',
  'sop/referral',
  'sop/sepsis',
  'start',
  'starttime',
  'structure/cctv',
  'structure/chang_area',
  'structure/charter',
  'structure/cots',
  'structure/couns_room',
  'structure/desk',
  'structure/draught',
  'structure/dust',
  'structure/fire',
  'structure/iso_room',
  'structure/kitchionette',
  'structure/kmc_area',
  'structure/lighting',
  'structure/maintenance',
  'structure/neo_space',
  'structure/priv_room',
  'structure/proc_rooms',
  'structure/resus_area',
  'structure/room_temp',
  'structure/signs',
  'structure/sluice',
  'structure/temp_store',
  'structure/ventilation',
  'structure/worktop',
  'today',
  'train/breastfeeding',
  'train/comprehensive',
  'train/hypoglycemia',
  'train/infections',
  'train/kangaroo',
  'train/neonate_hiv',
  'train/newborn',
  'train/newborn_jaundice',
  'train/nnr',
  'train/preterm_care',
  'train/sic',
]);

const INPATIENT_MATERNITY_SOURCE_KEYS = makeKeySet_([
  '_submission_time',
  'end',
  'endtime',
  'facility_profile/contact',
  'facility_profile/county',
  'facility_profile/facility',
  'facility_profile/gaz_facility',
  'facility_profile/gazetted_facility',
  'facility_profile/nam_contact',
  'facility_profile/phone_contact',
  'facility_profile/units',
  'health_records/birth',
  'health_records/birth_death',
  'health_records/bregister',
  'health_records/death',
  'health_records/delivery',
  'health_records/dl_register',
  'health_records/dregister',
  'health_records/autopsy_forms',
  'health_records/imf',
  'health_records/kmc',
  'health_records/maternal_death',
  'health_records/maternal_review',
  'health_records/newborn',
  'health_records/newborn_register',
  'health_records/nregister',
  'health_records/nutrition',
  'health_records/patient_file',
  'health_records/perinatal_death',
  'health_records/perinatl_review',
  'health_records/postnatal',
  'health_records/pregister',
  'hrh/rehab',
  'Section_5_Privacy_confidentiality/auditory',
  'Section_5_Privacy_confidentiality/barrier',
  'Section_5_Privacy_confidentiality/beds',
  'Section_5_Privacy_confidentiality/files',
  'Section_5_Privacy_confidentiality/single_rooms',
  'Section_5_Privacy_confidentiality/visual',
  'Section_7_Standard_operating_procedure/eclampsia',
  'Section_7_Standard_operating_procedure/handwashing',
  'Section_7_Standard_operating_procedure/intrapartum',
  'Section_7_Standard_operating_procedure/newborn_mgt',
  'Section_7_Standard_operating_procedure/policy_a',
  'Section_7_Standard_operating_procedure/policy_b',
  'Section_7_Standard_operating_procedure/policy_c',
  'Section_7_Standard_operating_procedure/policy_d',
  'Section_7_Standard_operating_procedure/pph',
  'Section_7_Standard_operating_procedure/pre_eclampsia',
  'Section_7_Standard_operating_procedure/procure',
  'Section_7_Standard_operating_procedure/referral',
  'Section_7_Standard_operating_procedure/rescuscitation',
  'Section_7_Standard_operating_procedure/sepsis',
  'Section_7_Standard_operating_procedure/sop',
  'Section_7_Standard_operating_procedure/checklist',
  'services_offered/anomalies',
  'services_offered/antibiotics',
  'services_offered/antibiotics_001',
  'services_offered/anticonvulsant',
  'services_offered/avd',
  'services_offered/blood_group',
  'services_offered/breastfeeding',
  'services_offered/bs_malaria',
  'services_offered/ctg',
  'services_offered/dbs',
  'services_offered/foetal_viability',
  'services_offered/gestation',
  'services_offered/glucose',
  'services_offered/hep_b',
  'services_offered/hgb',
  'services_offered/hiv_rapid',
  'services_offered/immunization',
  'services_offered/malaria',
  'services_offered/microscopy',
  'services_offered/newborn_care',
  'services_offered/no_foetuses',
  'services_offered/perineal_care',
  'services_offered/placenta',
  'services_offered/placenta_det',
  'services_offered/pocus',
  'services_offered/ppfp',
  'services_offered/resuscitation',
  'services_offered/retained',
  'services_offered/rpr_vdrl',
  'services_offered/tb_testing',
  'services_offered/ultrasound',
  'services_offered/urinalysis',
  'services_offered/urine_glucose',
  'services_offered/urine_protein',
  'services_offered/urine_rapid',
  'services_offered/uterotinics_freq',
  'services_offered/uterotonis',
  'services_offered/xray',
  'start',
  'starttime',
  'training/abortion_care',
  'training/breastfeeding_001',
  'training/cardio',
  'training/communication',
  'training/companion',
  'training/emotional_sup',
  'training/emonc_guidelines',
  'training/family_planning',
  'training/haemovigi',
  'training/harmful_prac',
  'training/ipc',
  'training/mpdsr_001',
  'training/newborn_care_001',
  'training/newborn_infection',
  'training/nnr',
  'training/obstetric_care',
  'training/pain_relief',
  'training/pnc',
  'training/rmc',
  'training/stress_mgt',
  'training/support',
  'wash/accessible',
  'wash/bathrooms',
  'wash/clean',
  'wash/disposable',
  'wash/disposal',
  'wash/drainage',
  'wash/gender',
  'wash/hand_washing',
  'wash/labour',
  'wash/latrine',
  'wash/leak_proof',
  'wash/menstrual',
  'wash/no_toilets',
  'wash/sharp',
  'wash/source',
  'wash/station',
  'wash/visible',
  'wash/water_freq',
]);

/**
 * Copy raw Kobo fields not consumed by a transform into out.
 * consumedKeys marks source fields already mapped to transformed columns.
 */
function assignPassthrough_(out, rec, consumedKeys) {
  Object.keys(rec).forEach(function (key) {
    if (key === UUID_FIELD) return;
    if (consumedKeys[key] || RAW_PASSTHROUGH_SKIP_KEYS[key]) return;
    if (out[key] === undefined) out[key] = flattenCell_(rec[key]);
  });
}

function getApiToken() {
  const token = PropertiesService.getScriptProperties().getProperty('KOBO_API_TOKEN');
  if (!token) {
    throw new Error(
      'Missing Script Property KOBO_API_TOKEN. ' +
      'Set it under Project Settings → Script properties.'
    );
  }
  return token;
}

function isTransientKoboStatus_(code) {
  return code === 429 || code === 502 || code === 503 || code === 504;
}

/** Fetch one Kobo page with exponential backoff on transient gateway errors. */
function fetchKoboPage_(url, token, assetUid) {
  let lastCode = 0;
  let lastBody = '';
  for (let attempt = 1; attempt <= KOBO_MAX_RETRIES; attempt++) {
    const response = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { Authorization: 'Token ' + token },
      muteHttpExceptions: true,
    });
    lastCode = response.getResponseCode();
    lastBody = response.getContentText();
    if (lastCode === 200) return response;
    if (!isTransientKoboStatus_(lastCode) || attempt === KOBO_MAX_RETRIES) break;
    const waitMs = KOBO_RETRY_BASE_MS * Math.pow(2, attempt - 1);
    Logger.log(
      'Transient HTTP ' + lastCode + ' for ' + assetUid +
      ' (attempt ' + attempt + '/' + KOBO_MAX_RETRIES + '); retrying in ' + waitMs + 'ms'
    );
    Utilities.sleep(waitMs);
  }
  throw new Error(
    'Kobo API returned HTTP ' + lastCode + ' for ' + assetUid +
    ' after ' + KOBO_MAX_RETRIES + ' attempt(s): ' + lastBody
  );
}

function fetchAllSubmissions(assetUid, token) {
  let allResults = [];
  let start = 0;
  let total = null;
  do {
    const url = KOBO_BASE_URL + '/api/v2/assets/' + assetUid + '/data.json'
      + '?limit=' + PAGE_SIZE + '&start=' + start;
    const response = fetchKoboPage_(url, token, assetUid);
    const json = JSON.parse(response.getContentText());
    total = json.count;
    allResults = allResults.concat(json.results || []);
    start += PAGE_SIZE;
    if (start < total) Utilities.sleep(KOBO_PAGE_PAUSE_MS);
  } while (start < total);
  return allResults;
}

/** Decode the shared facility_profile block onto out. */
function assignFacilityProfile_(out, rec, dateSubmitted, facilityKey) {
  out.county = lookupCoded_(rec['facility_profile/county'], COUNTY_MAP);
  const facilityMap = isOnOrAfterCutoff_(dateSubmitted, FACILITY_MAP_CUTOFF)
    ? FACILITY_MAP_FROM_2026 : FACILITY_MAP_BEFORE_2026;
  out.facility = lookupCoded_(rec['facility_profile/facility'], facilityMap);
  out.facility_level = lookupCoded_(rec[facilityKey], FACILITY_LEVEL_MAP);
  out.contact_person = lookupCoded_(rec['facility_profile/contact'], CONTACT_PERSON_MAP);
  out.name_contact = rec['facility_profile/nam_contact'] == null ? '' : rec['facility_profile/nam_contact'];
  out.phone_number = rec['facility_profile/phone_contact'] == null ? '' : rec['facility_profile/phone_contact'];
}

function firstValue_(rec, keys) {
  let found = '';
  for (let i = 0; i < keys.length; i++) {
    const v = rec[keys[i]];
    if (found === '' && v !== undefined && v !== null && v !== '') found = v;
  }
  return found;
}

function formatDateMinute_(value) {
  if (value === undefined || value === null || value === '') return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) {
    const s = String(value);
    const m = s.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
    if (m) return m[1] + ' ' + m[2];
    return s;
  }
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
}

function isOnOrAfterCutoff_(dateSubmittedFormatted, cutoffYmd) {
  if (!dateSubmittedFormatted) return false;
  return String(dateSubmittedFormatted).substring(0, 10) >= cutoffYmd;
}

function toIntegerOrBlank_(raw) {
  if (raw === undefined || raw === null || raw === '') return '';
  const n = Number(raw);
  return isNaN(n) ? String(raw) : n;
}

/** Kobo train dates: keep YYYY_MM and 0000_00; map unknown → 0000-00 */
function formatYearMonth_(raw) {
  if (raw === undefined || raw === null || raw === '') return '';
  const s = String(raw).trim();
  if (/^unknown$/i.test(s)) return '0000-00';
  return s;
}


/**
 * Expand a Kobo select_multiple into Yes/No/blank indicator columns.
 * Column naming: <prefix>_<choice_slug>
 * - Yes if choice code is in the space-separated value
 * - No if the question was answered but choice not selected
 * - blank if the question was skipped / irrelevant (field absent)
 */
function expandSelectMultiple_(out, raw, prefix, choices) {
  const irrelevant = raw === undefined || raw === null;
  let selectedSet = null;
  if (!irrelevant) {
    selectedSet = {};
    String(raw).split(/\s+/).filter(Boolean).forEach(function (code) {
      selectedSet[String(code)] = true;
    });
  }
  choices.forEach(function (choice) {
    const col = prefix + '_' + choice.slug;
    if (irrelevant) {
      out[col] = '';
    } else {
      out[col] = selectedSet[String(choice.code)] ? 'Yes' : 'No';
    }
  });
}

function selectMultipleHeaders_(prefix, choices) {
  return choices.map(function (choice) {
    return prefix + '_' + choice.slug;
  });
}

function lookupCoded_(raw, map) {
  if (raw === undefined || raw === null || raw === '') return '';
  const keyNum = Number(raw);
  if (!isNaN(keyNum) && map[keyNum] !== undefined) return map[keyNum];
  const keyStr = String(raw);
  if (map[keyStr] !== undefined) return map[keyStr];
  return keyStr;
}


function appendNewRecordsToSheet(ss, sheetName, records, preferredHeaders) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);

  if (!records || records.length === 0) {
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1).setValue('No submissions found.');
    return { appended: 0, skipped: 0 };
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const firstCell = lastRow > 0 ? String(sheet.getRange(1, 1).getValue()) : '';
  const isEmptyOrPlaceholder =
    lastRow === 0 || lastCol === 0 ||
    (lastRow === 1 && firstCell === 'No submissions found.');

  if (isEmptyOrPlaceholder) {
    sheet.clearContents();
    const headers = ensureUuidFirst_(buildHeaderUnion_(records));
    const preferred = preferredHeaders || [];
    // Transformed columns first, then whatever raw fields the records still
    // carry; whitelist sheets write the preferred columns only.
    const ordered = isWhitelistSheet_(sheetName)
      ? preferred
      : orderHeaders_(headers, preferred);
    writeRows_(sheet, ordered, records, 2, true);
    sheet.setFrozenRows(1);
    return { appended: records.length, skipped: 0 };
  }

  let headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  const uuidColIndex = headers.indexOf(UUID_FIELD);
  if (uuidColIndex === -1) {
    throw new Error('Sheet "' + sheetName + '" has no "' + UUID_FIELD + '" column. Run fullRefreshAllForms().');
  }

  const existingUuidSet = {};
  if (lastRow >= 2) {
    const numDataRows = lastRow - 1;
    sheet.getRange(2, uuidColIndex + 1, numDataRows, 1).getValues().forEach(function (row) {
      if (row[0] !== '' && row[0] != null) existingUuidSet[String(row[0])] = true;
    });
  }

  const newRecords = records.filter(function (rec) {
    const uuid = rec[UUID_FIELD];
    return uuid != null && uuid !== '' && !existingUuidSet[String(uuid)];
  });
  const skipped = records.length - newRecords.length;
  if (newRecords.length === 0) return { appended: 0, skipped: skipped };

  // Whitelist sheets stay on preferred columns; do not append meta/raw keys.
  if (!isWhitelistSheet_(sheetName)) {
    const headerSet = {};
    headers.forEach(function (h) { headerSet[h] = true; });
    buildHeaderUnion_(newRecords).forEach(function (key) {
      if (!headerSet[key]) { headers.push(key); headerSet[key] = true; }
    });
    if (headers.length > lastCol) {
      ensureSheetCapacity_(sheet, 1, headers.length);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  writeRows_(sheet, headers, newRecords, lastRow + 1, false);
  sheet.setFrozenRows(1);
  return { appended: newRecords.length, skipped: skipped };
}

function buildHeaderUnion_(records) {
  const headerSet = {};
  records.forEach(function (rec) {
    Object.keys(rec).forEach(function (key) { headerSet[key] = true; });
  });
  return Object.keys(headerSet);
}

function ensureUuidFirst_(headers) {
  return [UUID_FIELD].concat(headers.filter(function (h) { return h !== UUID_FIELD; }));
}

function orderHeaders_(headers, preferredFront) {
  const set = {};
  headers.forEach(function (h) { set[h] = true; });
  const front = preferredFront.filter(function (h) { return set[h]; });
  const frontSet = {};
  front.forEach(function (h) { frontSet[h] = true; });
  return front.concat(headers.filter(function (h) { return !frontSet[h]; }));
}

function isWhitelistSheet_(sheetName) {
  return KEEP_UNTRANSFORMED_COLUMNS[sheetName] === false;
}

function flattenCell_(val) {
  if (val === undefined || val === null) return '';
  const cell = typeof val === 'object' ? JSON.stringify(val) : val;
  if (typeof cell === 'string' && cell.length > MAX_CELL_CHARS) {
    return cell.substring(0, MAX_CELL_CHARS);
  }
  return cell;
}

/** A sheet starts at 26 columns, so wide pass-through writes need room first. */
function ensureSheetCapacity_(sheet, lastRowNeeded, lastColNeeded) {
  const maxRows = sheet.getMaxRows();
  if (lastRowNeeded > maxRows) sheet.insertRowsAfter(maxRows, lastRowNeeded - maxRows);
  const maxCols = sheet.getMaxColumns();
  if (lastColNeeded > maxCols) sheet.insertColumnsAfter(maxCols, lastColNeeded - maxCols);
}

function writeRows_(sheet, headers, records, startRow, writeHeader) {
  ensureSheetCapacity_(sheet, startRow + Math.max(records ? records.length : 0, 1) - 1, headers.length);
  if (writeHeader) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (!records || records.length === 0) return;

  // Write in chunks to avoid Apps Script setValues payload limits on wide sheets.
  const CHUNK = 100;
  let rowOffset = 0;
  while (rowOffset < records.length) {
    const slice = records.slice(rowOffset, rowOffset + CHUNK);
    const rows = slice.map(function (rec) {
      return headers.map(function (h) { return flattenCell_(rec[h]); });
    });
    const destRow = startRow + rowOffset;
    sheet.getRange(destRow, 1, rows.length, headers.length).setValues(rows);
    rowOffset += slice.length;
  }
}

