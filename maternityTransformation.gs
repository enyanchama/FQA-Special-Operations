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
  out.services_offered_uterotonics = lookupCoded_(
    rec['services_offered/uterotonics'], YES_NO_MAP
  );
  out.anticonvulsant_frequency = lookupCoded_(
    rec['services_offered/anticonvu_freq'], YES_NO_MAP
  );
  out.retained_products_frequency = lookupCoded_(
    rec['services_offered/retained_freq'], YES_NO_MAP
  );
  out.manual_removal_placenta_freq = lookupCoded_(
    rec['services_offered/placenta_freq'], YES_NO_MAP
  );
  out.avd_frequency = lookupCoded_(rec['services_offered/avd_freq'], YES_NO_MAP);
  out.neonatal_resuscitation_freq = lookupCoded_(
    rec['services_offered/resusci_freq'], YES_NO_MAP
  );
  out.services_offered_understand = toIntegerOrBlank_(
    rec['services_offered/understand']
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
    rec['health_records/patient_file'],
    'health_records_patient_file',
    MATERNITY_PATIENT_FILE_CHOICES
  );
  out.maternal_death_forms = lookupCoded_(
    rec['health_records/maternal_death'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.perinatal_deaths_forms = lookupCoded_(
    rec['health_records/perinatal_death'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.maternal_review_forms = lookupCoded_(
    rec['health_records/maternal_review'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.perinatal_review_forms = lookupCoded_(
    rec['health_records/perinatl_review'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.autopsy_forms = lookupCoded_(
    rec['health_records/autopsy_forms'], NEWBORN_ADMISSION_AVAIL_MAP
  );

  out.visual_privacy = lookupCoded_(
    privacyValue_(rec, 'visual'), ROOM_PRIVACY_MAP
  );
  out.auditory_privacy = lookupCoded_(
    privacyValue_(rec, 'auditory'), ROOM_PRIVACY_MAP
  );
  out.patient_files_privacy = lookupCoded_(
    privacyValue_(rec, 'files'), YES_NO_MAP
  );
  out.single_rooms = lookupCoded_(
    privacyValue_(rec, 'single_rooms'), YES_NO_MAP
  );
  out.bed_space = lookupCoded_(
    privacyValue_(rec, 'beds', 'beds_space'), MATERNITY_BED_SPACE_MAP
  );
  out.barrier_procedure_rooms = lookupCoded_(
    privacyValue_(rec, 'barrier'), MATERNITY_BARRIER_MAP
  );

  out.training_emonc_guideline = formatYearMonth_(rec['training/emonc_guidelines']);
  out.training_support = formatYearMonth_(rec['training/support']);
  out.training_nnr = formatYearMonth_(rec['training/nnr']);
  out.training_pnc = formatYearMonth_(rec['training/pnc']);
  out.training_ipc = formatYearMonth_(rec['training/ipc']);
  out.training_newborn_infection = formatYearMonth_(rec['training/newborn_infection']);
  out.training_harmful_practices = formatYearMonth_(rec['training/harmful_prac']);
  out.training_communication = formatYearMonth_(rec['training/communication']);
  out.training_breastfeeding_001 = formatYearMonth_(rec['training/breastfeeding_001']);
  out.training_companion = formatYearMonth_(rec['training/companion']);
  out.training_pain_relief = formatYearMonth_(rec['training/pain_relief']);
  out.training_emotional_support = formatYearMonth_(rec['training/emotional_sup']);
  out.training_rmc = formatYearMonth_(rec['training/rmc']);
  out.training_obstretric_care = formatYearMonth_(rec['training/obstetric_care']);
  out.training_newborn_care_001 = formatYearMonth_(rec['training/newborn_care_001']);
  out.training_abortion_care = formatYearMonth_(rec['training/abortion_care']);
  out.training_family_planning = formatYearMonth_(rec['training/family_planning']);
  out.training_cardio = formatYearMonth_(rec['training/cardio']);
  out.training_haemovigilance = formatYearMonth_(rec['training/haemovigi']);
  out.training_stress_management = formatYearMonth_(rec['training/stress_mgt']);
  out.training_mpdsr_001 = formatYearMonth_(rec['training/mpdsr_001']);

  out.sop_intrapartum = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/intrapartum'], SOP_PROTOCOL_MAP
  );
  out.sop_pph = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/pph'], SOP_PROTOCOL_MAP
  );
  out.sop_pre_eclampsia = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/pre_eclampsia'], SOP_PROTOCOL_MAP
  );
  out.sop_eclampsia = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/eclampsia'], SOP_PROTOCOL_MAP
  );
  out.sop_sepsis = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/sepsis'], SOP_PROTOCOL_MAP
  );
  out.sop_newborn_management = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/newborn_mgt'], SOP_PROTOCOL_MAP
  );
  out.sop_rescuscitation = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/rescuscitation'], SOP_PROTOCOL_MAP
  );
  out.sop_handwashing = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/handwashing'], SOP_PROTOCOL_MAP
  );
  out.sop_referral = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/referral'], YES_NO_MAP
  );
  out.sop_procurement = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/procure'], YES_NO_MAP
  );
  out.sop_ultrasound = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/sop'], YES_NO_MAP
  );
  out.sop_checklist = lookupCoded_(
    rec['Section_7_Standard_operating_procedure/checklist'], YES_NO_MAP
  );
  expandSelectMultiple_(
    out,
    rec['Section_7_Standard_operating_procedure/policy_a'],
    'section_7_standard_operating_procedure_policy_a',
    MATERNITY_POLICY_A_CHOICES
  );
  expandSelectMultiple_(
    out,
    rec['Section_7_Standard_operating_procedure/policy_b'],
    'section_7_standard_operating_procedure_policy_b',
    MATERNITY_POLICY_B_CHOICES
  );
  expandSelectMultiple_(
    out,
    rec['Section_7_Standard_operating_procedure/policy_c'],
    'section_7_standard_operating_procedure_policy_c',
    MATERNITY_POLICY_C_CHOICES
  );
  expandSelectMultiple_(
    out,
    rec['Section_7_Standard_operating_procedure/policy_d'],
    'section_7_standard_operating_procedure_policy_d',
    MATERNITY_POLICY_D_CHOICES
  );
  out.wash_source = lookupCoded_(rec['wash/source'], WATER_SOURCE_MAP);
  out.wash_water_frequency = lookupCoded_(rec['wash/water_freq'], YES_NO_MAP);
  out.wash_hand_washing = lookupCoded_(rec['wash/hand_washing'], YES_NO_MAP);
  out.wash_drainage = lookupCoded_(rec['wash/drainage'], YES_NO_MAP);
  out.wash_disposable_towels = lookupCoded_(
    rec['wash/disposable'], MATERNITY_DISPOSABLE_TOWELS_MAP
  );
  out.wash_disposal = lookupCoded_(rec['wash/disposal'], WASTE_MANAGEMENT_MAP);
  out.wash_leak_proof = lookupCoded_(rec['wash/leak_proof'], YES_NO_MAP);
  out.wash_sharp = lookupCoded_(rec['wash/sharp'], YES_NO_MAP);
  out.wash_visible_waste_container = lookupCoded_(rec['wash/visible'], YES_NO_MAP);
  const latrineMap = rec['__version__'] === MATERNITY_LEGACY_LATRINE_VERSION
    ? MATERNITY_LEGACY_LATRINE_MAP
    : MATERNITY_LATRINE_MAP;
  out.wash_latrine = lookupCoded_(rec['wash/latrine'], latrineMap);
  out.wash_station = lookupCoded_(rec['wash/station'], YES_NO_MAP);
  out.wash_bathrooms_cleaning = lookupCoded_(
    rec['wash/bathrooms'], MATERNITY_BATHROOM_CLEANING_MAP
  );
  out.wash_clean = lookupCoded_(rec['wash/clean'], YES_NO_MAP);
  out.wash_accessible = lookupCoded_(rec['wash/accessible'], YES_NO_MAP);
  out.wash_gender_separated = lookupCoded_(rec['wash/gender'], YES_NO_MAP);
  out.wash_menstrual = lookupCoded_(rec['wash/menstrual'], YES_NO_MAP);
  out.wash_no_toilets = toIntegerOrBlank_(rec['wash/no_toilets']);
  out.wash_labour = lookupCoded_(rec['wash/labour'], YES_NO_MAP);
  out.infrastructure_triage = lookupCoded_(
    rec['Section_9_Infrastructure/triage'], YES_NO_MAP
  );
  out.infrastructure_waiting_area = lookupCoded_(
    rec['Section_9_Infrastructure/waiting_area'], YES_NO_MAP
  );
  out.infrastructure_benches = lookupCoded_(
    rec['Section_9_Infrastructure/benches'], YES_NO_MAP
  );
  out.infrastructure_ventilation = lookupCoded_(
    rec['Section_9_Infrastructure/ventilation'], YES_NO_MAP
  );
  out.infrastructure_maintenance = lookupCoded_(
    rec['Section_9_Infrastructure/maintenance'], YES_NO_MAP
  );
  out.infrastructure_material = lookupCoded_(
    rec['Section_9_Infrastructure/material'], YES_NO_MAP
  );
  out.infrastructure_structures = lookupCoded_(
    rec['Section_9_Infrastructure/structures'], YES_NO_MAP
  );
  out.infrastructure_lighting = lookupCoded_(
    rec['Section_9_Infrastructure/lighting'], YES_NO_MAP
  );
  out.infrastructure_fan = lookupCoded_(
    rec['Section_9_Infrastructure/fan'], YES_NO_MAP
  );
  out.infrastructure_rooms = toIntegerOrBlank_(rec['Section_9_Infrastructure/rooms']);
  out.Infrastructure_beds_001 = lookupCoded_(
    rec['Section_9_Infrastructure/beds_001'], YES_NO_MAP
  );
  out.infrastructure_access = lookupCoded_(
    rec['Section_9_Infrastructure/access'], YES_NO_MAP
  );
  out.infrastructure_isolate = lookupCoded_(
    rec['Section_9_Infrastructure/isolate'], YES_NO_MAP
  );
  out.infrastructure_extinguishers = lookupCoded_(
    rec['Section_9_Infrastructure/extinguishers'], YES_NO_MAP
  );
  out.infrastructure_cabinets = lookupCoded_(
    rec['Section_9_Infrastructure/cabinets'], YES_NO_MAP
  );
  out.infrastructure_signs = lookupCoded_(
    rec['Section_9_Infrastructure/signs'], YES_NO_MAP
  );
  out['infrastructure/charter'] = lookupCoded_(
    rec['Section_9_Infrastructure/charter'], YES_NO_MAP
  );
  out.labour_area = lookupCoded_(
    rec['Section_9_Infrastructure/labour_area'], MATERNITY_LABOUR_AREA_PRIVACY_MAP
  );
  out['Infrastructure/childbirth_area'] = lookupCoded_(
    rec['Section_9_Infrastructure/childbirth_area'],
    MATERNITY_CHILDBIRTH_AREA_PRIVACY_MAP
  );
  out.recovery_room = lookupCoded_(
    rec['Section_9_Infrastructure/recovery_room'], YES_NO_MAP
  );
  out.resuscitation_area = lookupCoded_(
    rec['Section_9_Infrastructure/resus_area'], YES_NO_MAP
  );
  out.temperature_documented = lookupCoded_(
    rec['Section_9_Infrastructure/temperature'], YES_NO_MAP
  );
  out.draught_free = lookupCoded_(
    rec['Section_9_Infrastructure/draught'], YES_NO_MAP
  );
  expandSelectMultiple_(
    out,
    rec['Section_9_Infrastructure/education'],
    'section_9_infrastructure_education',
    MATERNITY_EDUCATION_CHOICES
  );
  out.infrastructure_dust = lookupCoded_(
    rec['Section_9_Infrastructure/dust'], YES_NO_MAP
  );
  out.equipment_incubator = lookupCoded_(
    rec['Section_10_Equipment/incubators'], MATERNITY_INCUBATOR_MAP
  );
  out.equipment_ambubags = lookupCoded_(
    rec['Section_10_Equipment/ambubags'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['equipment/vd_kits'] = lookupCoded_(
    rec['Section_10_Equipment/vd_kits'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['equipment/obstetric'] = lookupCoded_(
    rec['Section_10_Equipment/obstetric'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['equipment/preclampsia'] = lookupCoded_(
    rec['Section_10_Equipment/preclampsia'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['equipment/resuscitation_kits'] = lookupCoded_(
    rec['Section_10_Equipment/resus_kits'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['equipment/pharyngeal'] = lookupCoded_(
    rec['Section_10_Equipment/pharyngeal'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.equipment_glucometer = lookupCoded_(
    rec['Section_10_Equipment/glucometer'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_ultrasound_001 = lookupCoded_(
    rec['Section_10_Equipment/ultrasound_001'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_oximeter = lookupCoded_(
    rec['Section_10_Equipment/oximeter'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_exam_light = lookupCoded_(
    rec['Section_10_Equipment/exam_light'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_fotoscopes = toIntegerOrBlank_(
    rec['Section_10_Equipment/fetoscopes']
  );
  out.equipment_doppler = toIntegerOrBlank_(rec['Section_10_Equipment/doppler']);
  out.equipment_vacuum = lookupCoded_(rec['Section_10_Equipment/vacuum'], YES_NO_MAP);
  out.equipment_bed = toIntegerOrBlank_(rec['Section_10_Equipment/beds_002']);
  out.equipment_suction = lookupCoded_(
    rec['Section_10_Equipment/suction'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_catheters = lookupCoded_(
    rec['Section_10_Equipment/catheters'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.equipment_bulbs = lookupCoded_(
    rec['Section_10_Equipment/bulbs'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.equipment_adult = lookupCoded_(
    rec['Section_10_Equipment/adult'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_infant = lookupCoded_(
    rec['Section_10_Equipment/infant'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_stadiometer = lookupCoded_(
    rec['Section_10_Equipment/stadiometer'], YES_NO_MAP
  );
  out.equipment_thermometer = lookupCoded_(
    rec['Section_10_Equipment/thermometers'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.equipment_stethoscope = lookupCoded_(
    rec['Section_10_Equipment/stethoscopes'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.equipment_laryngoscope = lookupCoded_(
    rec['Section_10_Equipment/laryngoscope'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_apparatus = lookupCoded_(
    rec['Section_10_Equipment/apparatus'], NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['equipment ctg_001'] = lookupCoded_(
    rec['Section_10_Equipment/ctg_001'], EQUIP_FUNCTIONAL_MAP
  );
  out.equipment_towels = lookupCoded_(rec['Section_10_Equipment/towels'], YES_NO_MAP);
  out.equipment_quantity = lookupCoded_(
    rec['Section_10_Equipment/quantity'], YES_NO_MAP
  );
  out['equipment/oxygen'] = lookupCoded_(
    rec['Section_10_Equipment/oxygen'], WATER_SOURCE_MAP
  );
  out['equipment/o2'] = lookupCoded_(rec['Section_10_Equipment/o2'], YES_NO_MAP);
  expandSelectMultiple_(
    out,
    rec['Section_10_Equipment/supplies'],
    'section_10_equipment_supplies',
    MATERNITY_SUPPLIES_CHOICES
  );
  out.equipment_storage = lookupCoded_(rec['Section_10_Equipment/storage'], YES_NO_MAP);
  out.equipment_milk_bank = lookupCoded_(
    rec['Section_10_Equipment/milk_bank'], YES_NO_MAP
  );
  out.equipment_refrigerator = lookupCoded_(
    rec['Section_10_Equipment/refrigerator'], WATER_SOURCE_MAP
  );
  out.equipment_resuscitaire = lookupCoded_(
    rec['Section_10_Equipment/resuscitaire'], WATER_SOURCE_MAP
  );
  expandSelectMultiple_(
    out,
    rec['Section_10_Equipment/em_tray'],
    'section_10_equipment_em_tray',
    MATERNITY_EM_TRAY_CHOICES
  );
  expandSelectMultiple_(
    out,
    rec['Section_10_Equipment/equipment'],
    'section_10_equipment_equipment',
    MATERNITY_RESUS_CART_CHOICES
  );
  out.labour_ward_tetracycline = lookupCoded_(
    labourWardValue_(rec, 'tetracycline'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_chlorhexidine = lookupCoded_(
    labourWardValue_(rec, 'chlorhexidine'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_vit_k = lookupCoded_(
    labourWardValue_(rec, 'vit_k'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_bcg = lookupCoded_(
    labourWardValue_(rec, 'bcg'), MATERNITY_BCG_AVAIL_MAP
  );
  out.labour_ward_hepb = lookupCoded_(
    labourWardValue_(rec, 'hepb'), MATERNITY_HEPB_AVAIL_MAP
  );
  out.labour_ward_oxytocin = lookupCoded_(
    labourWardValue_(rec, 'oxytocin'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_hsc = lookupCoded_(
    labourWardValue_(rec, 'hsc'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_misoprostol = lookupCoded_(
    labourWardValue_(rec, 'misoprostol'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_tranexamic = lookupCoded_(
    labourWardValue_(rec, 'tranexamic'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_magnesium = lookupCoded_(
    labourWardValue_(rec, 'magnesium'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_calcium = lookupCoded_(
    labourWardValue_(rec, 'calcium'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_hydralazine = lookupCoded_(
    labourWardValue_(rec, 'hydralazine'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_saline = lookupCoded_(
    labourWardValue_(rec, 'saline'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_methyldopa = lookupCoded_(
    labourWardValue_(rec, 'methyldopa'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_dexamethasone = lookupCoded_(
    labourWardValue_(rec, 'dexamethasone'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_latex = lookupCoded_(
    labourWardValue_(rec, 'latex'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_sterile = lookupCoded_(
    labourWardValue_(rec, 'sterile'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_masks = lookupCoded_(
    labourWardValue_(rec, 'masks'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_aprons = lookupCoded_(
    labourWardValue_(rec, 'aprons'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['labour_ward/iv'] = lookupCoded_(
    labourWardValue_(rec, 'iv'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_malaria_001 = lookupCoded_(
    labourWardValue_(rec, 'malaria_001'), MATERNITY_LAB_UNIT_AVAIL_MAP
  );
  out.labour_ward_syphilis = lookupCoded_(
    labourWardValue_(rec, 'syphilis', 'syphillis'), MATERNITY_LAB_UNIT_AVAIL_MAP
  );
  out.labour_ward_hiv = lookupCoded_(
    labourWardValue_(rec, 'hiv'), MATERNITY_LAB_UNIT_AVAIL_MAP
  );
  out.labour_ward_glucose_001 = lookupCoded_(
    labourWardValue_(rec, 'glucose_001'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_ketone = lookupCoded_(
    labourWardValue_(rec, 'ketone'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out['labour_ward/glucometer_001'] = lookupCoded_(
    labourWardValue_(rec, 'glucometer_001'), NEWBORN_ADMISSION_AVAIL_MAP
  );
  out.labour_ward_protein = lookupCoded_(
    labourWardValue_(rec, 'protein'), NEWBORN_ADMISSION_AVAIL_MAP
  );

  out.based_practices_ultrasound_002 = lookupCoded_(
    basedPracticesValue_(rec, 'ultrasound_002'), YES_NO_MAP
  );
  out.based_practices_calibration = lookupCoded_(
    basedPracticesValue_(rec, 'calibration'), YES_NO_MAP
  );
  out.based_practices_documentation = lookupCoded_(
    basedPracticesValue_(rec, 'documentation'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_consent_001 = lookupCoded_(
    basedPracticesValue_(rec, 'consent_001'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_meeting = lookupCoded_(
    basedPracticesValue_(rec, 'meeting'), YES_NO_MAP
  );
  out.based_practices_arrival = lookupCoded_(
    basedPracticesValue_(rec, 'arrival'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  expandSelectMultiple_(
    out,
    basedPracticesRaw_(rec, 'triage_001'),
    'based_practices_triage_001',
    MATERNITY_TRIAGE_ASSESSMENT_CHOICES
  );
  out.based_practices_guide = lookupCoded_(
    basedPracticesValue_(rec, 'guide'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  expandSelectMultiple_(
    out,
    basedPracticesRaw_(rec, 'charts'),
    'based_practices_charts',
    MATERNITY_CHARTS_CHOICES
  );
  out.based_practices_companion_001 = lookupCoded_(
    basedPracticesValue_(rec, 'companion_001'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_encourage = lookupCoded_(
    basedPracticesValue_(rec, 'encourage'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_delivery_001 = lookupCoded_(
    basedPracticesValue_(rec, 'delivery_001'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out['based_practices/information'] = lookupCoded_(
    basedPracticesValue_(rec, 'information'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  expandSelectMultiple_(
    out,
    basedPracticesRaw_(rec, 'counselling'),
    'based_practices_counselling',
    MATERNITY_LABOUR_COUNSELLING_CHOICES
  );
  out['based_practices/svd'] = toIntegerOrBlank_(
    basedPracticesValue_(rec, 'svd')
  );
  out.based_practices_roaming = lookupCoded_(
    basedPracticesValue_(rec, 'roaming'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_support_001 = lookupCoded_(
    basedPracticesValue_(rec, 'support_001'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_vital_signs = lookupCoded_(
    basedPracticesValue_(rec, 'vital_signs'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_pnc_001 = lookupCoded_(
    basedPracticesValue_(rec, 'pnc_001'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  expandSelectMultiple_(
    out,
    basedPracticesRaw_(rec, 'discharge'),
    'based_practices_discharge',
    MATERNITY_DISCHARGE_COUNSELLING_CHOICES
  );
  out.based_practices_grief = lookupCoded_(
    basedPracticesValue_(rec, 'grief'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_pain_drugs = lookupCoded_(
    basedPracticesValue_(rec, 'pain_drugs'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_examination = lookupCoded_(
    basedPracticesValue_(rec, 'examination'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_clinical = lookupCoded_(
    basedPracticesValue_(rec, 'clinical'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_latching = lookupCoded_(
    basedPracticesValue_(rec, 'latching'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_passage = lookupCoded_(
    basedPracticesValue_(rec, 'passage'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_register = lookupCoded_(
    basedPracticesValue_(rec, 'register'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_maternal = lookupCoded_(
    basedPracticesValue_(rec, 'maternal'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_feeding = lookupCoded_(
    basedPracticesValue_(rec, 'feeding'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.based_practices_system = lookupCoded_(
    basedPracticesValue_(rec, 'system'), ALWAYS_SOMETIMES_NEVER_MAP
  );
  out.operation_001 = lookupCoded_(
    rec['operation/operation_001'], MATERNITY_OPERATION_HOURS_MAP
  );
  expandSelectMultiple_(
    out,
    rec['services_offered/immunization'],
    'services_offered_immunization',
    MATERNITY_IMMUNIZATION_CHOICES
  );

  return out;
}

/**
 * Read a labour-ward commodity value, tolerating both the capitalized and
 * lowercase group names used across deployed maternity form versions.
 * Accepts one or more field-name spellings (some fields are misspelled in
 * only one form version, e.g. syphilis / syphillis).
 */
function labourWardValue_(rec) {
  const fields = Array.prototype.slice.call(arguments, 1);
  const keys = [];
  fields.forEach(function (field) {
    keys.push('Section_11_Commodit_cific_to_Labour_Ward/' + field);
    keys.push('Section_11_Commodit_cific_to_labour_ward/' + field);
  });
  return firstValue_(rec, keys);
}

/**
 * Read a Section 5 privacy/confidentiality value, tolerating both the
 * capitalized and lowercase group names used across deployed form versions.
 * Accepts one or more field-name spellings (bed spacing appears as both
 * "beds" and "beds_space" depending on form version).
 */
function privacyValue_(rec) {
  const fields = Array.prototype.slice.call(arguments, 1);
  const keys = [];
  fields.forEach(function (field) {
    keys.push('Section_5_Privacy_Confidentiality/' + field);
    keys.push('Section_5_Privacy_confidentiality/' + field);
  });
  return firstValue_(rec, keys);
}

/** Group-name variants used by Section 12 across deployed form versions. */
var MATERNITY_BASED_PRACTICES_PREFIXES = [
  'Section_12_Adherenc_ence_based_Practices/',
  'Section_12_Adherenc_ence_Based_Practices/',
  'Section_12_Adheranc_ence_based_practices/',
];

/** Read a Section 12 evidence-based-practice value across group-name variants. */
function basedPracticesValue_(rec, field) {
  return firstValue_(
    rec,
    MATERNITY_BASED_PRACTICES_PREFIXES.map(function (prefix) {
      return prefix + field;
    })
  );
}

/**
 * Raw Section 12 value across group-name variants, preserving undefined when
 * the field is absent so select_multiple expansion stays blank (not all-No).
 */
function basedPracticesRaw_(rec, field) {
  for (var i = 0; i < MATERNITY_BASED_PRACTICES_PREFIXES.length; i++) {
    var key = MATERNITY_BASED_PRACTICES_PREFIXES[i] + field;
    if (Object.prototype.hasOwnProperty.call(rec, key)) return rec[key];
  }
  return undefined;
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
    'offered_glucose', 'services_offered_uterotonics',
    'anticonvulsant_frequency', 'retained_products_frequency',
    'manual_removal_placenta_freq', 'avd_frequency',
    'neonatal_resuscitation_freq', 'services_offered_understand',
    'access_rehab',
    'birth_register', 'birth_register_available', 'death_register',
    'death_register_available', 'birth_death_nvrs', 'delivery_register',
    'delivery_reg_used', 'postnatal_register', 'postnatal_reg_used',
    'nutrition_register', 'newborn_register', 'newborn_register_used',
    'kmc_register', 'inpatient_maternity_file', 'newborn_file',
  ]
    .concat(selectMultipleHeaders_(
      'health_records_patient_file',
      MATERNITY_PATIENT_FILE_CHOICES
    ))
    .concat([
      'maternal_death_forms', 'perinatal_deaths_forms',
      'maternal_review_forms', 'perinatal_review_forms', 'autopsy_forms',
      'visual_privacy', 'auditory_privacy', 'patient_files_privacy',
      'single_rooms', 'bed_space', 'barrier_procedure_rooms',
      'training_emonc_guideline', 'training_support', 'training_nnr',
      'training_pnc', 'training_ipc', 'training_newborn_infection',
      'training_harmful_practices', 'training_communication',
      'training_breastfeeding_001', 'training_companion',
      'training_pain_relief', 'training_emotional_support', 'training_rmc',
      'training_obstretric_care', 'training_newborn_care_001',
      'training_abortion_care', 'training_family_planning', 'training_cardio',
      'training_haemovigilance', 'training_stress_management',
      'training_mpdsr_001',
      'sop_intrapartum', 'sop_pph', 'sop_pre_eclampsia', 'sop_eclampsia',
      'sop_sepsis', 'sop_newborn_management', 'sop_rescuscitation',
      'sop_handwashing', 'sop_referral', 'sop_procurement', 'sop_ultrasound',
      'sop_checklist',
    ])
    .concat(selectMultipleHeaders_(
      'section_7_standard_operating_procedure_policy_a',
      MATERNITY_POLICY_A_CHOICES
    ))
    .concat(selectMultipleHeaders_(
      'section_7_standard_operating_procedure_policy_b',
      MATERNITY_POLICY_B_CHOICES
    ))
    .concat(selectMultipleHeaders_(
      'section_7_standard_operating_procedure_policy_c',
      MATERNITY_POLICY_C_CHOICES
    ))
    .concat(selectMultipleHeaders_(
      'section_7_standard_operating_procedure_policy_d',
      MATERNITY_POLICY_D_CHOICES
    ))
    .concat([
      'wash_source', 'wash_water_frequency', 'wash_hand_washing',
      'wash_drainage', 'wash_disposable_towels', 'wash_disposal',
      'wash_leak_proof', 'wash_sharp', 'wash_visible_waste_container',
      'wash_latrine', 'wash_station', 'wash_bathrooms_cleaning', 'wash_clean',
      'wash_accessible', 'wash_gender_separated', 'wash_menstrual',
      'wash_no_toilets', 'wash_labour', 'infrastructure_triage',
      'infrastructure_waiting_area',
    ])
    .concat([
      'infrastructure_benches', 'infrastructure_ventilation',
      'infrastructure_maintenance', 'infrastructure_material',
      'infrastructure_structures', 'infrastructure_lighting',
      'infrastructure_fan', 'infrastructure_rooms', 'Infrastructure_beds_001',
      'infrastructure_access', 'infrastructure_isolate',
      'infrastructure_extinguishers', 'infrastructure_cabinets',
      'infrastructure_signs', 'infrastructure/charter', 'labour_area',
      'Infrastructure/childbirth_area', 'recovery_room', 'resuscitation_area',
      'temperature_documented', 'draught_free',
    ])
    .concat(selectMultipleHeaders_(
      'section_9_infrastructure_education',
      MATERNITY_EDUCATION_CHOICES
    ))
    .concat([
      'infrastructure_dust', 'equipment_incubator', 'equipment_ambubags',
      'equipment/vd_kits', 'equipment/obstetric', 'equipment/preclampsia',
      'equipment/resuscitation_kits', 'equipment/pharyngeal',
      'equipment_glucometer', 'equipment_ultrasound_001', 'equipment_oximeter',
      'equipment_exam_light', 'equipment_fotoscopes', 'equipment_doppler',
      'equipment_vacuum', 'equipment_bed', 'equipment_suction',
      'equipment_catheters', 'equipment_bulbs', 'equipment_adult',
      'equipment_infant', 'equipment_stadiometer', 'equipment_thermometer',
      'equipment_stethoscope', 'equipment_laryngoscope', 'equipment_apparatus',
      'equipment ctg_001', 'equipment_towels', 'equipment_quantity',
      'equipment/oxygen', 'equipment/o2',
    ])
    .concat(selectMultipleHeaders_(
      'section_10_equipment_supplies',
      MATERNITY_SUPPLIES_CHOICES
    ))
    .concat([
      'equipment_storage', 'equipment_milk_bank', 'equipment_refrigerator',
      'equipment_resuscitaire',
    ])
    .concat(selectMultipleHeaders_(
      'section_10_equipment_em_tray',
      MATERNITY_EM_TRAY_CHOICES
    ))
    .concat(selectMultipleHeaders_(
      'section_10_equipment_equipment',
      MATERNITY_RESUS_CART_CHOICES
    ))
    .concat([
      'labour_ward_tetracycline', 'labour_ward_chlorhexidine',
      'labour_ward_vit_k', 'labour_ward_bcg', 'labour_ward_hepb',
      'labour_ward_oxytocin', 'labour_ward_hsc', 'labour_ward_misoprostol',
      'labour_ward_tranexamic', 'labour_ward_magnesium', 'labour_ward_calcium',
      'labour_ward_hydralazine', 'labour_ward_saline', 'labour_ward_methyldopa',
      'labour_ward_dexamethasone',
      'labour_ward_latex', 'labour_ward_sterile', 'labour_ward_masks',
      'labour_ward_aprons', 'labour_ward/iv', 'labour_ward_malaria_001',
      'labour_ward_syphilis', 'labour_ward_hiv', 'labour_ward_glucose_001',
      'labour_ward_ketone', 'labour_ward/glucometer_001', 'labour_ward_protein',
      'based_practices_ultrasound_002', 'based_practices_calibration',
      'based_practices_documentation', 'based_practices_consent_001',
      'based_practices_meeting', 'based_practices_arrival',
    ])
    .concat(selectMultipleHeaders_(
      'based_practices_triage_001',
      MATERNITY_TRIAGE_ASSESSMENT_CHOICES
    ))
    .concat(['based_practices_guide'])
    .concat(selectMultipleHeaders_(
      'based_practices_charts',
      MATERNITY_CHARTS_CHOICES
    ))
    .concat([
      'based_practices_companion_001', 'based_practices_encourage',
      'based_practices_delivery_001', 'based_practices/information',
    ])
    .concat(selectMultipleHeaders_(
      'based_practices_counselling',
      MATERNITY_LABOUR_COUNSELLING_CHOICES
    ))
    .concat([
      'based_practices/svd', 'based_practices_roaming',
      'based_practices_support_001', 'based_practices_vital_signs',
      'based_practices_pnc_001',
    ])
    .concat(selectMultipleHeaders_(
      'based_practices_discharge',
      MATERNITY_DISCHARGE_COUNSELLING_CHOICES
    ))
    .concat([
      'based_practices_grief',
      'based_practices_pain_drugs', 'based_practices_examination',
      'based_practices_clinical', 'based_practices_latching',
      'based_practices_passage', 'based_practices_register',
      'based_practices_maternal', 'based_practices_feeding',
      'based_practices_system', 'operation_001',
    ])
    .concat(selectMultipleHeaders_(
      'services_offered_immunization',
      MATERNITY_IMMUNIZATION_CHOICES
    ));
}

