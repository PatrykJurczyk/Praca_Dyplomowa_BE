const Joi = require('@hapi/joi');

const validateField = {
  name: Joi.string().messages({
    'string.empty': `Name must contain value`,
    'any.required': `Name is a required field`,
  }),
  email: Joi.string().messages({
    'string.empty': `Email must contain value`,
    'any.required': `Email is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `Password length must be at least 6 characters long`,
    'string.empty': `Password must contain value`,
    'any.required': `Password is a required field`,
  }),
  phone: Joi.string().pattern(new RegExp('^[0-9]+$')).length(9).messages({
    'string.pattern.base': `Phone number must be valid`,
    'string.length': `Phone number length must be 9 characters long`,
    'string.empty': `Phone number must contain value`,
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
