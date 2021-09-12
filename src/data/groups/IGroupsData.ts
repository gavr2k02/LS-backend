import { IGroup } from 'models/interfaces/IGroup';
import { IBGroup } from '../../models/interfaces/IBGroup';

export interface IGroupsData {
  createGroup(group: IBGroup): Promise<IGroup>;
  updateGroup(group: IBGroup): Promise<IGroup>;
  deleteGroup(groupId: string): Promise<IGroup>;
  getGroups(faculityId: string): Promise<IGroup[]>;
  getGroupByName(value: IBGroup): Promise<IGroup>;
  getGroupById(groupId: string): Promise<IGroup>;
  getGroupByIdFullData(groupId: string): Promise<IGroup>;
}
