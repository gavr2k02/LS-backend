import express from 'express';
import { Role } from 'models/enums/Role';
import { IFaculty } from 'models/interfaces/IFaculty';
import { CommonRoutesConfig } from '../../common/CommonRoutes';
import { ErrorCode } from '../../common/enums/ErrorCode';
import { errorHandler } from '../../common/utils';
import { ITokenData, verifyToken } from '../../common/utils/token';
import { publish } from '../../pub/pubnub';
import { IFacultiesService } from '../../services/faculties/IFacultiesService';

export class FacultiesRoutes extends CommonRoutesConfig {
  private readonly _service: IFacultiesService;

  constructor(app: express.Application, service: IFacultiesService) {
    super(app, 'FacultiesRoutes');
    this._service = service;
  }

  public configureRoutes(): express.Application {
    this.app.route('/api/faculties').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization as string);

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const faculties = await this._service.getFaculities(token.cid);
        res.status(200).send(faculties);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/faculty/:facultyId').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { facultyId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getFaculityById(facultyId);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/faculties').post(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const faculty = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.createFaculity(faculty as IFaculty, token.cid);
        await publish(`${token.cid}-faculties`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/faculties/:facultyId').delete(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { facultyId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.deleteFaculity(facultyId);
        await publish(`${token.cid}-faculties`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/faculties').patch(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const faculty = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.updateFaculity(faculty, token.cid);
        await publish(`${token.cid}-faculties`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    return this.app;
  }
}
