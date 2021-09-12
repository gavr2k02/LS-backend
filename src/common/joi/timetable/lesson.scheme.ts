import Joi from 'joi';

export const lessonScheme = Joi.object({
  startTime: Joi.string().allow(),
  courseId: Joi.string().allow(),
  teacherId: Joi.string().allow(),
});
