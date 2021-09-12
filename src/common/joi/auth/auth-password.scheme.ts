import Joi from 'joi';

export const authPasswordScheme = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
});
