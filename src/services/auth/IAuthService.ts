import { ILoginPassword } from 'models/interfaces/ILoginPassword';
import { ISignUpPaasword } from 'models/interfaces/ISignUpPaasword';
import { IUser } from 'models/interfaces/IUser';

export interface IAuthService {
  getUserByToken(userId: string): Promise<IUser>;
  loginPassword(data: ILoginPassword): Promise<[string, IUser]>;
  signupPassword(data: ISignUpPaasword): Promise<[string, IUser]>;
}
