import { IUser } from 'models/interfaces/IUser';

export interface IUsersData {
  createUser(user: IUser): Promise<IUser>;
  updateUser(user: IUser): Promise<IUser>;
  getUserById(userId: string): Promise<IUser>;
  getUserByName(name: string): Promise<IUser>;
  getUsers(clientId: string): Promise<IUser[]>;
  formatUser(user: IUser): IUser;
}
