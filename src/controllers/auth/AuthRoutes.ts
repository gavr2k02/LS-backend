import express from 'express';
import { Role } from 'models/enums/Role';
import { ILoginPassword } from 'models/interfaces/ILoginPassword';
import { CommonRoutesConfig } from '../../common/CommonRoutes';
import { ErrorCode } from '../../common/enums/ErrorCode';
import { errorHandler } from '../../common/utils';
import { ITokenData, verifyToken } from '../../common/utils/token';
import { IAuthService } from '../../services/auth/IAuthService';

export class AuthRoutes extends CommonRoutesConfig {
  private readonly _service: IAuthService;

  constructor(app: express.Application, service: IAuthService) {
    super(app, 'AuthRoutes');
    this._service = service;
  }

  public configureRoutes(): express.Application {
    this.app.route('/api/auth/login/password').post(async (req: express.Request, res: express.Response) => {
      try {
        const data: ILoginPassword = req.body;
        const [token, user] = await this._service.loginPassword(data);
        res.status(200).send({ token, user });
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/auth/signup/password').post(async (req: express.Request, res: express.Response) => {
      try {
        const data: ILoginPassword = req.body;
        const token = await this._service.signupPassword(data);

        res.status(200).send({ token });
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/auth/login/token').post(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        console.log(authorization);
        const token: ITokenData = verifyToken(authorization as string);
        console.log(token);

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const user = await this._service.getUserByToken(token.id);
        res.status(200).send({ user });
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    return this.app;
  }
}
