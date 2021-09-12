import { IGroup } from 'models/interfaces/IGroup';
import { ObjectId } from 'mongodb';

export interface IBGroup extends IGroup {
  _id?: ObjectId;
  clientId: string;
}
