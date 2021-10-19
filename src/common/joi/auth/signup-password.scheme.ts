import Joi from 'joi';

export const signupPasswordScheme = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
  cid: Joi.string().required(),
});
