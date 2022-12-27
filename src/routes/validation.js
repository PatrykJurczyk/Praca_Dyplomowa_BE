const Joi = require('@hapi/joi');

const validateField = {
  name: Joi.string().messages({
    'string.empty': `Imie nie może być puste.`,
    'any.required': `Imie jest wymaganym polem.`,
  }),
  email: Joi.string().email().messages({
    'string.empty': `Email nie może być puste.`,
    'string.email': `Wprowadź poprawny adress email.`,
    'any.required': `Email jest wymaganym polem.`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `Hasło musi mieć długość minimum 6 znaków.`,
    'string.empty': `Hasło nie może być puste.`,
    'any.required': `Hasło jest wymaganym polem.`,
  }),
  phone: Joi.string().pattern(new RegExp('^[0-9]+$')).length(9).messages({
    'string.pattern.base': `Number telefonu musi być poprawny.`,
    'string.length': `Number telefonu musi mieć 9 cyfr.`,
    'string.empty': `Number telefonu nie może być puste.`,
  }),
};

const registerValidation = (data) => {
  const schemaUser = Joi.object({
    name: Joi.string(),
    email: validateField.email.required(),
    password: validateField.password,
    passwordRepeat: validateField.password,
  });

  return schemaUser.validate(data);
};

const loginValidation = (data) => {
  const schemaUser = Joi.object({
    email: validateField.email.required(),
    password: Joi.required(),
  });

  return schemaUser.validate(data);
};

const editValidation = (data) => {
  const schemaUser = Joi.object({
    name: validateField.name,
    avatar: Joi.string(),
    phone: validateField.phone,
    role: Joi.string(),
  });

  return schemaUser.validate(data);
};

const passwdEditValidation = (data) => {
  const schemaUser = Joi.object({
    password: Joi.required(),
    newPassword: validateField.password,
    newPasswordRepeat: Joi.required(),
  });

  return schemaUser.validate(data);
};

module.exports = { registerValidation, loginValidation, editValidation, passwdEditValidation };
