import express from 'express';
import { Role } from 'models/enums/Role';
import { ITeacher } from 'models/interfaces/ITeacher';
import { CommonRoutesConfig } from '../../common/CommonRoutes';
import { ErrorCode } from '../../common/enums/ErrorCode';
import { errorHandler } from '../../common/utils';
import { ITokenData, verifyToken } from '../../common/utils/token';
import { publish } from '../../pub/pubnub';
import { ITeachersService } from '../../services/teachers/ITeachersService';

export class TeachersRoutes extends CommonRoutesConfig {
  private readonly _service: ITeachersService;

  constructor(app: express.Application, service: ITeachersService) {
    super(app, 'TeachersRoutes');
    this._service = service;
  }

  public configureRoutes(): express.Application {
    this.app.route('/api/teachers').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization as string);

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getTeachers(token.cid);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/teacher/:teacherId').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { teacherId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getTeacherById(teacherId);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/teachers').post(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const teacher: ITeacher = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.createTeacher(teacher, token.cid);
        await publish(`${token.cid}-teachers`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/teachers/:teacherId').delete(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { teacherId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.deleteTeacher(teacherId);
        await publish(`${token.cid}-teachers`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/teachers').patch(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const teacher: ITeacher = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.updateTeacher(teacher, token.cid);
        await publish(`${token.cid}-teachers`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    return this.app;
  }
}
