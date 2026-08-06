/** Inpatient Maternity transformation and preferred headers. */

function transformInpatientMaternityRecord_(rec) {
  const out = {};
  out[UUID_FIELD] = rec[UUID_FIELD] == null ? '' : rec[UUID_FIELD];

  assignPassthrough_(out, rec, INPATIENT_MATERNITY_SOURCE_KEYS);

  const dateSubmitted = formatDateMinute_(rec['_submission_time']);
  out.date_started = formatDateMinute_(firstValue_(rec, ['start', 'starttime']));
  out.date_ended = formatDateMinute_(firstValue_(rec, ['end', 'endtime']));
  out.date_submitted = dateSubmitted;

  assignFacilityProfile_(out, rec, dateSubmitted, 'facility_profile/gaz_facility');

  out.inpatient_unit = lookupCoded_(rec['facility_profile/units'], YES_NO_MAP);
  out.services_offered_pocus = lookupCoded_(rec['services_offered/pocus'], YES_NO_MAP);
  out.services_offered_ultrasound = lookupCoded_(rec['services_offered/ultrasound'], ULTRASOUND_AVAIL_MAP);
  out.services_offered_xray = lookupCoded_(rec['services_offered/xray'], YES_NO_MAP);
  out.foetal_viability = lookupCoded_(rec['services_offered/foetal_viability'], YES_NO_MAP);
  out.no_foetuses_us = lookupCoded_(rec['services_offered/no_foetuses'], YES_NO_MAP);
  out.gestational_age_us = lookupCoded_(rec['services_offered/gestation'], YES_NO_MAP);
  out.foetal_anomalies = lookupCoded_(rec['services_offered/anomalies'], YES_NO_MAP);
  out.placenta_insufficiency_us = lookupCoded_(rec['services_offered/placenta_det'], YES_NO_MAP);
  out.offer_ctg = lookupCoded_(rec['services_offered/ctg'], YES_NO_MAP);
  out.services_offered_uterotonis = lookupCoded_(rec['services_offered/uterotonis'], YES_NO_MAP);
  out.uterotonics_frequency = lookupCoded_(rec['services_offered/uterotinics_freq'], YES_NO_MAP);
  out.services_offered_antibiotics = lookupCoded_(rec['services_offered/antibiotics'], YES_NO_MAP);
  out.antibiotics_frequency = lookupCoded_(rec['services_offered/antibiotics_001'], YES_NO_MAP);
  out.offer_anticonvulsant = lookupCoded_(rec['services_offered/anticonvulsant'], YES_NO_MAP);
  out.retained_products = lookupCoded_(rec['services_offered/retained'], YES_NO_MAP);
  out.placenta_removal = lookupCoded_(rec['services_offered/placenta'], YES_NO_MAP);
  out.offer_avd = lookupCoded_(rec['services_offered/avd'], YES_NO_MAP);
  out.offer_resuscitation = lookupCoded_(rec['services_offered/resuscitation'], YES_NO_MAP);
  out.offer_perineal_care = lookupCoded_(rec['services_offered/perineal_care'], YES_NO_MAP);
  out.offer_ppfp = lookupCoded_(rec['services_offered/ppfp'], YES_NO_MAP);
  out.breastfeeding_counsel = lookupCoded_(rec['services_offered/breastfeeding'], YES_NO_MAP);
  out.offer_newborn_care = lookupCoded_(rec['services_offered/newborn_care'], YES_NO_MAP);
  out.offer_microscopy = lookupCoded_(rec['services_offered/microscopy'], MATERNITY_LAB_AVAILABILITY_MAP);
  out.offer_hgb = lookupCoded_(rec['services_offered/hgb'], MATERNITY_LAB_AVAILABILITY_MAP);
  out.services_offered_urinalysis = lookupCoded_(
    rec['services_offered/urinalysis'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.offered_urine_rapid = lookupCoded_(
    rec['services_offered/urine_rapid'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.offered_urine_protein = lookupCoded_(
    rec['services_offered/urine_protein'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.offered_urine_glucose = lookupCoded_(
    rec['services_offered/urine_glucose'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out['services_offered/hiv_rapid'] = lookupCoded_(
    rec['services_offered/hiv_rapid'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.offered_dbs = lookupCoded_(rec['services_offered/dbs'], MATERNITY_LAB_AVAILABILITY_MAP);
  out.offered_rpr_vdrl = lookupCoded_(
    rec['services_offered/rpr_vdrl'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.offered_blood_group = lookupCoded_(
    rec['services_offered/blood_group'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.offered_malaria = lookupCoded_(firstValue_(rec, [
    'services_offered/malaria',
    'services_offered/bs_malaria',
  ]), MATERNITY_LAB_AVAILABILITY_MAP);
  out.offered_hep_b = lookupCoded_(rec['services_offered/hep_b'], MATERNITY_LAB_AVAILABILITY_MAP);
  out.offer_tb_test = lookupCoded_(
    rec['services_offered/tb_testing'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.offered_glucose = lookupCoded_(
    rec['services_offered/glucose'], MATERNITY_LAB_AVAILABILITY_MAP
  );
  out.access_rehab = lookupCoded_(rec['hrh/rehab'], YES_NO_MAP);
  out.birth_register = lookupCoded_(rec['health_records/birth'], NEWBORN_ADMISSION_AVAIL_MAP);
  out.birth_register_available = lookupCoded_(rec['health_records/bregister'], YES_NO_MAP);
  out.death_register = lookupCoded_(rec['health_records/death'], NEWBORN_ADMISSION_AVAIL_MAP);
  out.death_register_available = lookupCoded_(rec['health_records/dregister'], YES_NO_MAP);
  out.birth_death_nvrs = lookupCoded_(rec['health_records/birth_death'], YES_NO_MAP);
  out.delivery_register = lookupCoded_(
    rec['health_records/delivery'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.delivery_reg_used = lookupCoded_(rec['health_records/dl_register'], YES_NO_MAP);
  out.postnatal_register = lookupCoded_(
    rec['health_records/postnatal'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.postnatal_reg_used = lookupCoded_(rec['health_records/pregister'], YES_NO_MAP);
  out.nutrition_register = lookupCoded_(
    rec['health_records/nutrition'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.newborn_register = lookupCoded_(
    rec['health_records/newborn_register'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.newborn_register_used = lookupCoded_(rec['health_records/nregister'], YES_NO_MAP);
  out.kmc_register = lookupCoded_(rec['health_records/kmc'], NEWBORN_ADMISSION_AVAIL_MAP);
  out.inpatient_maternity_file = lookupCoded_(
    rec['health_records/imf'], MATERNITY_FILE_AVAILABILITY_MAP
  );
  out.newborn_file = lookupCoded_(
    rec['health_records/newborn'], MATERNITY_FILE_AVAILABILITY_MAP
  );
  expandSelectMultiple_(
    out,
    rec['services_offered/immunization'],
    'services_offered_immunization',
    MATERNITY_IMMUNIZATION_CHOICES
  );

  return out;
}

function inpatientMaternityPreferredHeaders_() {
  return [
    UUID_FIELD, 'date_started', 'date_ended', 'date_submitted',
    'county', 'facility', 'facility_level', 'contact_person', 'name_contact',
    'phone_number', 'inpatient_unit',
    'services_offered_pocus', 'services_offered_ultrasound', 'services_offered_xray',
    'foetal_viability', 'no_foetuses_us', 'gestational_age_us', 'foetal_anomalies',
    'placenta_insufficiency_us', 'offer_ctg',
    'services_offered_uterotonis', 'uterotonics_frequency',
    'services_offered_antibiotics', 'antibiotics_frequency', 'offer_anticonvulsant',
    'retained_products', 'placenta_removal', 'offer_avd', 'offer_resuscitation',
    'offer_perineal_care', 'offer_ppfp', 'breastfeeding_counsel', 'offer_newborn_care',
    'offer_microscopy', 'offer_hgb', 'services_offered_urinalysis',
    'offered_urine_rapid', 'offered_urine_protein', 'offered_urine_glucose',
    'services_offered/hiv_rapid', 'offered_dbs', 'offered_rpr_vdrl',
    'offered_blood_group', 'offered_malaria', 'offered_hep_b', 'offer_tb_test',
    'offered_glucose', 'access_rehab',
    'birth_register', 'birth_register_available', 'death_register',
    'death_register_available', 'birth_death_nvrs', 'delivery_register',
    'delivery_reg_used', 'postnatal_register', 'postnatal_reg_used',
    'nutrition_register', 'newborn_register', 'newborn_register_used',
    'kmc_register', 'inpatient_maternity_file', 'newborn_file',
    'services_offered_immunization_bcg', 'services_offered_immunization_hep_b',
    'services_offered_immunization_opv', 'services_offered_immunization_none',
  ];
}

