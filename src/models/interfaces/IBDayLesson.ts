import { IDayLesson } from 'models/interfaces/IDayLesson';
import { ObjectId } from 'mongodb';

export interface IBDayLesson extends IDayLesson {
  _id?: ObjectId;
  clientId: string;
}
