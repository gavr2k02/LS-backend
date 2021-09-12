import Joi from 'joi';

export const baseScheme = Joi.object({
  id: Joi.string().allow(),
  name: Joi.string().required(),
  color: Joi.string().required(),
});
