import Joi from 'joi';
import { baseScheme } from './base.scheme';

export const groupScheme = baseScheme.keys({
  facultyId: Joi.string().required(),
  studentIds: Joi.array().items(Joi.string()).allow(),
});
