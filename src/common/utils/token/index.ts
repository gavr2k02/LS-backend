import * as jwt from 'jsonwebtoken';
import { Role } from 'models/enums/Role';
import { IUser } from 'models/interfaces/IUser';

interface ITokenClaims {
  id: string;
  role: Role;
  cid: string;
}

export interface ITokenData {
  id: string;
  role: Role;
  cid: string;
}

const SECRET = 'ewq`$!wgLLeng,swrka613e4';

export function createToken(user: IUser): string {
  const data: ITokenClaims = {
    id: user.id,
    role: user.role,
    cid: user.cid,
  };

  return jwt.sign(data, SECRET, {
    expiresIn: '30d',
  });
}

export function verifyToken(token: string): ITokenData {
  return jwt.verify(token, SECRET) as ITokenData;
}
