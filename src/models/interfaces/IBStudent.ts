import { IStudent } from 'models/interfaces/IStudent';
import { ObjectId } from 'mongodb';

export interface IBStudent extends IStudent {
  _id?: ObjectId;
  clientId: string;
}
