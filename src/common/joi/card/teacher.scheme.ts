import Joi from 'joi';
import { baseScheme } from './base.scheme';

export const teacherScheme = baseScheme.keys({
  firstName: Joi.string().allow(),
  lastName: Joi.string().allow(),
  avatar: Joi.string().allow(),
  role: Joi.string().allow(),
  facultyIds: Joi.array().items(Joi.string()).allow(),
  courseIds: Joi.array().items(Joi.string()).allow(),
});
