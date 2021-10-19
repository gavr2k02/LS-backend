import { IFaculty } from 'models/interfaces/IFaculty';
import { IUser } from 'models/interfaces/IUser';
import { Collection, ObjectId } from 'mongodb';
import { formatData } from '../../common/utils/mongo';
import { IUsersData } from './IUsersData';

export class UsersData implements IUsersData {
  private readonly _collection: Collection<IUser>;

  constructor(collection: Collection<IUser>) {
    this._collection = collection;
  }

  public async createUser(user: IUser): Promise<IUser> {
    await this._collection.insertOne(user);
    return formatData(user);
  }

  public async updateUser(value: IUser): Promise<IUser> {
    const result = await this._collection.findOneAndUpdate(
      { _id: new ObjectId(value.id), deleted: { $exists: false } },
      { $set: value },
      { returnDocument: 'after' },
    );

    return formatData(result.value);
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
    delete formatUser['cid'];
    delete formatUser['fields.password'];
    return formatUser;
  }
}
