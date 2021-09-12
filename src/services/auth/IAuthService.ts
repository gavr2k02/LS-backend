import { ILoginPassword } from 'models/interfaces/ILoginPassword';
import { IUser } from 'models/interfaces/IUser';

export interface IAuthService {
  getUserByToken(userId: string): Promise<IUser>;
  loginPassword(data: ILoginPassword): Promise<[string, IUser]>;
  signupPassword(data: ILoginPassword): Promise<string>;
}
