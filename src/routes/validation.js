const Joi = require('@hapi/joi');

const validateField = {
  name: Joi.string().messages({
    'string.empty': `Name must contain value`,
    'any.required': `Name is a required field`,
  }),
  email: Joi.string().email().messages({
    'string.email': `Please enter a valid email address.`,
    'string.empty': `Email must contain value`,
    'any.required': `Email is a required field`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `Password length must be at least 6 characters long`,
    'string.empty': `Password must contain value`,
    'any.required': `Password is a required field`,
  }),
};

const registerValidation = (data) => {
  const schemaUser = Joi.object({
    name: validateField.name.required(),
    photo: Joi.string(),
    email: validateField.email.required(),
    password: validateField.password,
    role: Joi.string(),
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
    photo: Joi.string(),
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
