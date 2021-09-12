import express from 'express';
import { Role } from 'models/enums/Role';
import { ICourse } from 'models/interfaces/ICourse';
import { ITeacher } from 'models/interfaces/ITeacher';
import { CommonRoutesConfig } from '../../common/CommonRoutes';
import { ErrorCode } from '../../common/enums/ErrorCode';
import { errorHandler } from '../../common/utils';
import { ITokenData, verifyToken } from '../../common/utils/token';
import { publish } from '../../pub/pubnub';
import { ICoursesService } from '../../services/courses/ICoursesService';

export class CoursesRoutes extends CommonRoutesConfig {
  private readonly _service: ICoursesService;

  constructor(app: express.Application, service: ICoursesService) {
    super(app, 'CoursesRoutes');
    this._service = service;
  }

  public configureRoutes(): express.Application {
    this.app.route('/api/courses').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization as string);

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getCourses(token.cid);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/course/:courseId').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { courseId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getCourseById(courseId);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/courses').post(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const course: ICourse = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.createCourse(course, token.cid);
        await publish(`${token.cid}-courses`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/courses/:courseId').delete(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { courseId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.deleteCourse(courseId);
        await publish(`${token.cid}-courses`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/courses').patch(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const course: ICourse = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.updateCourse(course, token.cid);
        await publish(`${token.cid}-courses`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    return this.app;
  }
}
