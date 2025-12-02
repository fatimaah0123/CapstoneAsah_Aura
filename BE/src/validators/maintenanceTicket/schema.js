import Joi from 'joi';

const msg = {
  // STRING
  'string.base': '{#label} harus berupa teks',
  'string.empty': '{#label} tidak boleh kosong',
  'string.min': '{#label} minimal {#limit} karakter',
  'string.max': '{#label} maksimal {#limit} karakter',

  // NUMBER
  'number.base': '{#label} harus berupa angka',
  'number.min': '{#label} minimal {#limit}',
  'number.max': '{#label} maksimal {#limit}',
  'number.integer': '{#label} harus berupa bilangan bulat',

  // ARRAY
  'array.base': '{#label} harus berupa array',
  'array.min': '{#label} minimal berisi {#limit} item',
  'array.max': '{#label} maksimal berisi {#limit} item',

  // OBJECT
  'object.base': '{#label} harus berupa object',
  'object.unknown': '{#label} memiliki field yang tidak dikenal',
  'object.missing': '{#label} harus mengandung field yang diperlukan',

  // COMMON
  'any.required': '{#label} wajib diisi',
  'any.only': '{#label} berisi nilai yang tidak valid',
};

export const maintenanceTicketSchema = Joi.object({
  name_pic: Joi.string().max(255).required().messages(msg),
  contact: Joi.string().max(255).required().messages(msg),
  member: Joi.array().items(Joi.string()).required().messages(msg),
  date: Joi.date().required().messages(msg),
  estimated_duration: Joi.string().max(255).required().messages(msg),
  maintenance_type: Joi.string()
    .valid('preventive', 'corrective', 'predictive', 'inspective')
    .required()
    .messages(msg),
  status: Joi.string().valid('open', 'in_progress', 'closed').default('open'),
  part: Joi.string().max(255).required().messages(msg),
  additional_notes: Joi.string().allow(null, ''),
  image: Joi.string().max(255).allow(null, ''),
  machine_id: Joi.number().integer().required().messages(msg),
});
