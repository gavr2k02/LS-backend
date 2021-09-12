import Joi from 'joi';
import { baseScheme } from './base.scheme';

export const courseScheme = baseScheme.keys({
  facultyIds: Joi.array().items(Joi.string()).allow(),
});
