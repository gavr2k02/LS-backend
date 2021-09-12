import { IGroup } from 'models/interfaces/IGroup';
import { Collection, ObjectId } from 'mongodb';
import { GROUP_FULL_DATA_PROJECT } from '../../common/utils/mongo/project.constans';
import { CollectionName, formatData } from '../../common/utils/mongo';
import { IBFaculity } from '../../models/interfaces/IBFaculity';
import { IBGroup } from '../../models/interfaces/IBGroup';
import { IGroupsData } from './IGroupsData';

export class GroupsData implements IGroupsData {
  private readonly _collectionGroup: Collection<IBGroup>;
  private readonly _collectionFaculty: Collection<IBFaculity>;

  constructor(collectionGroup: Collection<IBGroup>, collectionFaculty: Collection<IBFaculity>) {
    this._collectionGroup = collectionGroup;
    this._collectionFaculty = collectionFaculty;
  }

  public async createGroup(group: IBGroup): Promise<IGroup> {
    await this._collectionGroup.insertOne(group);
    await this._collectionFaculty.updateOne(
      { _id: new ObjectId(group.facultyId), deleted: { $exists: false } },
      {
        $push: {
          groupIds: group._id.toHexString(),
        },
      },
    );
    return formatData(group);
  }

  public async updateGroup(group: IBGroup): Promise<IGroup> {
    const result = await this._collectionGroup.findOneAndUpdate(
      { _id: new ObjectId(group.id), deleted: { $exists: false } },
      { $set: group },
      { returnDocument: 'after' },
    );

    return formatData(result.value);
  }

  public async deleteGroup(groupId: string): Promise<IGroup> {
    const result = await this._collectionGroup.findOneAndUpdate(
      { _id: new ObjectId(groupId), deleted: { $exists: false } },
      { $set: { deleted: true } },
      { returnDocument: 'after' },
    );
    return formatData(result.value);
  }

  public async getGroups(facultyId: string): Promise<IGroup[]> {
    const result = await this._collectionGroup.find({ facultyId, deleted: { $exists: false } }).toArray();
    return result.map((item) => formatData(item));
  }

  public async getGroupByName(value: IBGroup): Promise<IGroup> {
    const result = await this._collectionGroup.findOne({
      name: value.name,
      facultyId: value.facultyId,
      deleted: { $exists: false },
    });
    return formatData(result);
  }

  public async getGroupById(groupId: string): Promise<IGroup> {
    const result = await this._collectionGroup.findOne({ _id: new ObjectId(groupId), deleted: { $exists: false } });
    return formatData(result);
  }

  public async getGroupByIdFullData(groupId: string): Promise<IGroup> {
    const result = await this._collectionGroup
      .aggregate([
        {
          $match: { _id: new ObjectId(groupId), deleted: { $exists: false } },
        },
        {
          $addFields: {
            mongoIdFaculty: {
              $toObjectId: '$facultyId',
            },
          },
        },
        {
          $lookup: {
            from: CollectionName.FACULTIES,
            localField: 'mongoIdFaculty',
            foreignField: '_id',
            as: 'faculty',
          },
        },
        {
          $unwind: '$faculty',
        },
        {
          $addFields: {
            'faculty.id': {
              $toString: '$faculty._id',
            },
          },
        },
        {
          $project: GROUP_FULL_DATA_PROJECT,
        },
      ])
      .toArray();

    return formatData(result[0]);
  }
}
