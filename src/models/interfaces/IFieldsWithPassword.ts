import { IFIelds } from 'models/interfaces/IUser';

export interface IFieldsWithPassword extends IFIelds {
  password: string;
}
