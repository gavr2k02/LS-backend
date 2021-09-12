import express from 'express';
import { ErrorCode } from '../enums/ErrorCode';

export function errorHandler(responce: express.Response, statusCode: ErrorCode, message: string): express.Response {
  return responce.status(statusCode).send(message);
}

export function toDateString(value: Date): string {
  if (typeof value !== 'string') {
    return `${value.getUTCFullYear()}-${value.getUTCMonth()}-${value.getDate()}`;
  } else {
    const date = new Date(value);
    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getDate()}`;
  }
}

export function dateStringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-');
  return new Date(Number.parseInt(year), Number.parseInt(month), Number.parseInt(day));
}
