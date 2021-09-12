import express from 'express';
import { Role } from 'models/enums/Role';
import { IGroup } from 'models/interfaces/IGroup';
import { CommonRoutesConfig } from '../../common/CommonRoutes';
import { ErrorCode } from '../../common/enums/ErrorCode';
import { errorHandler } from '../../common/utils';
import { ITokenData, verifyToken } from '../../common/utils/token';
import { publish } from '../../pub/pubnub';
import { IGroupsService } from '../../services/groups/IGroupsService';

export class GroupsRoutes extends CommonRoutesConfig {
  private readonly _service: IGroupsService;

  constructor(app: express.Application, service: IGroupsService) {
    super(app, 'GroupsRoutes');
    this._service = service;
  }

  public configureRoutes(): express.Application {
    this.app.route('/api/groups/:facultyId').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization as string);
        const { facultyId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getGroups(facultyId);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/group/:groupId').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { groupId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getGroupById(groupId);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/group/full/:groupId').get(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { groupId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.getGroupByIdFullData(groupId);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/groups').post(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const group: IGroup = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.createGroup(group, token.cid);
        await publish(`${token.cid}-groups-${result.facultyId}`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/groups/:groupId').delete(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const { groupId } = req.params;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.deleteGroup(groupId);
        await publish(`${token.cid}-groups-${result.facultyId}`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    this.app.route('/api/groups').patch(async (req: express.Request, res: express.Response) => {
      try {
        const { authorization } = req.headers;
        const token: ITokenData = verifyToken(authorization);
        const group: IGroup = req.body;

        if (token.role !== Role.SUPER_ADMIN) {
          throw errorHandler(res, ErrorCode.ACCESS_DENIED, 'access denied');
        }

        const result = await this._service.updateGroup(group, token.cid);
        await publish(`${token.cid}-groups-${result.facultyId}`, result);
        res.status(200).send(result);
      } catch (err) {
        errorHandler(res, ErrorCode.ERROR, err.message);
      }
    });

    return this.app;
  }
}
