import { ILoginPassword } from 'models/interfaces/ILoginPassword';
import { IUsersData } from '../../data/users/IUsersData';
import { IAuthService } from './IAuthService';
import bcrypt from 'bcryptjs';
import { IFieldsWithPassword } from '../../models/interfaces/IFieldsWithPassword';
import { createToken } from '../../common/utils/token';
import { IUser } from 'models/interfaces/IUser';
import { checkPayload } from '../../common/joi';
import { authPasswordScheme } from '../../common/joi/auth/auth-password.scheme';
import { stringJoi } from '../../common/joi/base/string.scheme';

export class AuthService implements IAuthService {
  private _data: IUsersData;

  constructor(data: IUsersData) {
    this._data = data;
  }

  public async getUserByToken(userId: string): Promise<IUser> {
    await checkPayload(userId, stringJoi);
    const user = await this._data.getUserById(userId);
    return this._data.formatUser(user);
  }

  public async signupPassword(data: ILoginPassword): Promise<string> {
    await checkPayload(data, authPasswordScheme);
    const result = await this._data.getUserByName(data.name);

    if (result) {
      throw `name ${result.name} exists`;
    }

    const password = await bcrypt.hash(data.password, 10);
    return password;
  }

  public async loginPassword(data: ILoginPassword): Promise<[string, IUser]> {
    await checkPayload(data, authPasswordScheme);
    const user = await this._data.getUserByName(data.name);
    const result = await bcrypt.compare(data.password, (user.fields as IFieldsWithPassword).password);

    if (!result) {
      throw 'Invalid data';
    }

    const formatUser = this._data.formatUser(user);
    const token = createToken(user);
    return [token, formatUser];
  }
}
