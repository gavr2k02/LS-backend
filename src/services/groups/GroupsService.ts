import { IGroup } from 'models/interfaces/IGroup';
import { checkPayload } from '../../common/joi';
import { stringJoi } from '../../common/joi/base/string.scheme';
import { groupScheme } from '../../common/joi/card/group.scheme';
import { IGroupsData } from '../../data/groups/IGroupsData';
import { IGroupsService } from './IGroupsService';

export class GroupsService implements IGroupsService {
  private readonly _data: IGroupsData;

  constructor(data: IGroupsData) {
    this._data = data;
  }

  public async createGroup(value: IGroup, clientId: string): Promise<IGroup> {
    await checkPayload(value, groupScheme);
    const result = await this._data.getGroupByName({ ...value, clientId });

    if (result) {
      throw new Error('This name exists');
    }

    return this._data.createGroup({ ...value, clientId });
  }

  public async updateGroup(value: IGroup, clientId: string): Promise<IGroup> {
    await checkPayload(value, groupScheme);
    const result = await this._data.getGroupByName({ ...value, clientId });

    if (result && result?.id !== value.id) {
      throw new Error('This name exists');
    }

    return this._data.updateGroup({ ...value, clientId });
  }

  public async deleteGroup(groupId: string): Promise<IGroup> {
    await checkPayload(groupId, stringJoi);
    return this._data.deleteGroup(groupId);
  }

  public async getGroups(faculityId: string): Promise<IGroup[]> {
    await checkPayload(faculityId, stringJoi);
    return this._data.getGroups(faculityId);
  }

  public async getGroupById(groupId: string): Promise<IGroup> {
    await checkPayload(groupId, stringJoi);
    return this._data.getGroupById(groupId);
  }

  public async getGroupByIdFullData(groupId: string): Promise<IGroup> {
    await checkPayload(groupId, stringJoi);
    return this._data.getGroupByIdFullData(groupId);
  }
}
