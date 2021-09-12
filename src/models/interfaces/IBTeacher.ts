import { ITeacher } from 'models/interfaces/ITeacher';
import { ObjectId } from 'mongodb';

export interface IBTeacher extends ITeacher {
  _id?: ObjectId;
  clientId: string;
}
