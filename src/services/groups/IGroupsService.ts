import { IGroup } from 'models/interfaces/IGroup';

export interface IGroupsService {
  createGroup(value: IGroup, clientId: string): Promise<IGroup>;
  updateGroup(value: IGroup, clientId: string): Promise<IGroup>;
  deleteGroup(groupId: string): Promise<IGroup>;
  getGroups(faculityId: string): Promise<IGroup[]>;
  getGroupById(groupId: string): Promise<IGroup>;
  getGroupByIdFullData(groupId: string): Promise<IGroup>;
}
