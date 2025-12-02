import Joi from 'joi';

export const createPredictSchema = Joi.array().items({
  datetime: Joi.date().required(),
  Type: Joi.string().valid('L', 'M', 'H').required(),
  Rotational_speed: Joi.number().required(),
  Process_temperature: Joi.number().required(),
  Air_temperature: Joi.number().required(),
  Torque: Joi.number().required(),
  Tool_wear: Joi.number().required(),
  machine_age_hours: Joi.number().required(),
  hours_since_last: Joi.number().required(),
  Temp_Rate_of_Change: Joi.number().required(),
  RPM_Variance: Joi.number().required(),
  machineID: Joi.number().required(),
});

export const maintenanceTicketSchema = Joi.object({
  name_pic: Joi.string().max(255).required(),
  contact: Joi.string().max(255).required(),
  member: Joi.array().items(Joi.string()).required(),
  date: Joi.date().required(),
  estimated_duration: Joi.string().max(255).required(),
  maintenance_type: Joi.string()
    .valid('preventive', 'corrective', 'predictive', 'inspective')
    .required(),
  status: Joi.string().valid('open', 'in_progress', 'closed').default('open'),
  part: Joi.string().max(255).required(),
  additional_notes: Joi.string().allow(null, ''),
  image: Joi.string().max(255).allow(null, ''),
  machine_id: Joi.number().integer().required(),
});
