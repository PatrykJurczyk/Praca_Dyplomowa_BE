const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const schema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().required(),
  MONGODB_URL: Joi.string().required(),
});

const { value: envVars, error } = schema.validate(process.env, { stripUnknown: true, convert: true });

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const env = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  MONGODB_URL: envVars.MONGODB_URL,
};

module.exports = env;
