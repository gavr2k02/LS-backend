import Joi, { BinarySchema, ObjectSchema } from 'joi';

export async function checkPayload<T>(
  data: T,
  schema: ObjectSchema<T> | BinarySchema | Joi.StringSchema,
): Promise<void> {
  try {
    await schema.validateAsync(data);
  } catch (err) {
    throw {
      message: err.details[0].message as string,
    };
  }
}
