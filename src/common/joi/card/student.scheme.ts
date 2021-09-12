import Joi from 'joi';
import { baseScheme } from './base.scheme';

export const studentScheme = baseScheme.keys({
  groupId: Joi.string().required(),
  firstName: Joi.string().allow(),
  lastName: Joi.string().allow(),
  role: Joi.string().allow(),
});
