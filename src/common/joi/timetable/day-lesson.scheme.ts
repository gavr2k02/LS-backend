import Joi from 'joi';
import { lessonScheme } from './lesson.scheme';

export const dayLessonScheme = Joi.object({
  id: Joi.string().allow(),
  groupId: Joi.string().required(),
  facultyId: Joi.string().required(),
  day: Joi.string().required(),
  lessons: Joi.array().items(lessonScheme).required(),
});
