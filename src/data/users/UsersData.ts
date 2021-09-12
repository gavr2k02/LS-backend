import { IFaculty } from 'models/interfaces/IFaculty';
import { IUser } from 'models/interfaces/IUser';
import { Collection, ObjectId } from 'mongodb';
import { IBFaculity } from '../../models/interfaces/IBFaculity';
import { IUsersData } from './IUsersData';

export class UsersData implements IUsersData {
  private readonly _collection: Collection<IUser>;

  constructor(collection: Collection<IUser>) {
    this._collection = collection;
  }
  public async createUser(user: IUser): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  public async updateUser(user: IUser): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  public async getUserById(userId: string): Promise<IUser> {
    return this._collection.findOne({ _id: new ObjectId(userId), deleted: { $exists: false } });
  }

  public async getUserByName(name: string): Promise<IUser> {
    return this._collection.findOne({ name, deleted: { $exists: false } });
  }

  public async getUsers(clientId: string): Promise<IUser[]> {
    throw new Error('Method not implemented.');
  }

  public formatUser(user: IUser): IUser {
    const formatUser = user;
    formatUser.id = user['_id'].toHexString();
    delete formatUser['_id'];
    delete formatUser['fields.password'];
    return formatUser;
  }
}
