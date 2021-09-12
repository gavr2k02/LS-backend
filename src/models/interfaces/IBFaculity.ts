import { IFaculty } from 'models/interfaces/IFaculty';
import { ObjectId } from 'mongodb';

export interface IBFaculity extends IFaculty {
  _id?: ObjectId;
  clientId: string;
}
