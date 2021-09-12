import express from 'express';
import { Role } from 'models/enums/Role';
import { toDateString, dateStringToDate } from '../../common/utils';
import { IDayLesson } from 'models/interfaces/IDayLesson';
import { CommonRoutesConfig } from '../../common/CommonRoutes';
import { ErrorCode } from '../../common/enums/ErrorCode';
import { errorHandler } from '../../common/utils';
import { ITokenData, verifyToken } from '../../common/utils/token';
import { publish } from '../../pub/pubnub';
import { IDayLessonsService } from '../../services/day-lessons/IDayLessonsService';

export class DayLessonsRoutes extends CommonRoutesConfig {
  private readonly _service: IDayLessonsService;

  constructor(app: express.Application, service: IDayLessonsService) {
    super(app, 'DayLessonsRoutes');
    this._service = service;
  }

  public configureRoutes(): express.Application {
    this.app
      .route('/api/timetable/:facultyId/day/:dateString')
      .get(async (req: express.Request, res: express.Response) => {
        try {
          const { authorization } = req.headers;
          const token: ITokenData = verifyToken(authorization as string);
          const { facultyId, dateString } = req.params;

          if (token.role !== Role.SUPER_ADMIN) {
            throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
          }

          const result = await this._service.getTimetablesDayByDay(token.cid, facultyId, dateString);
          res.status(200).send(result);
        } catch (err) {
          errorHandler(res, ErrorCode.ERROR, err.message);
        }
      });

    this.app.route('/api/timetable/day/:timetableId').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { timetableId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getTimetableDayById(timetableId);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/timetable/day').post(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const dayLessons: IDayLesson = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.saveTimetableDay(dayLessons, token.cid);
        await publish(`${token.cid}-${result.day}-lessons-${result.facultyId}`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/timetable/day/:timetableId').delete(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { timetableId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.deleteTimetableDay(timetableId);
        await publish(`${token.cid}-${result.day}-lessons-${result.facultyId}`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    return this.app;
  }
}
