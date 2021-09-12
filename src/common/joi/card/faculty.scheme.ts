import Joi from 'joi';
import { baseScheme } from './base.scheme';

export const facultyScheme = baseScheme.keys({
  groupIds: Joi.array().items(Joi.string()).allow(),
});
