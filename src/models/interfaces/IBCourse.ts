import { ICourse } from 'models/interfaces/ICourse';
import { ObjectId } from 'mongodb';

export interface IBCourse extends ICourse {
  _id?: ObjectId;
  clientId: string;
}
