import { Role } from 'models/enums/Role';
import { IStudent } from 'models/interfaces/IStudent';
import { Collection, ObjectId } from 'mongodb';
import { STUDENT_FULL_DATA_PROJECT } from '../../common/utils/mongo/project.constans';
import { CollectionName, formatData } from '../../common/utils/mongo';
import { IBGroup } from '../../models/interfaces/IBGroup';
import { IBStudent } from '../../models/interfaces/IBStudent';
import { IStudentsData } from './IStudentsData';

export class StudentsData implements IStudentsData {
  private readonly _collectionStudents: Collection<IBStudent>;
  private readonly _collectionGroup: Collection<IBGroup>;

  constructor(collectionStudents: Collection<IBStudent>, collectionGroup: Collection<IBGroup>) {
    this._collectionStudents = collectionStudents;
    this._collectionGroup = collectionGroup;
  }

  public async createStudent(value: IBStudent): Promise<IStudent> {
    value.role = Role.STUDENT;
    await this._collectionStudents.insertOne(value);
    await this._collectionGroup.updateOne(
      { _id: new ObjectId(value.groupId), deleted: { $exists: false } },
      {
        $push: {
          studentIds: value._id.toHexString(),
        },
      },
    );
    return formatData(value);
  }

  public async updateStudent(value: IBStudent): Promise<IStudent> {
    const result = await this._collectionStudents.findOneAndUpdate(
      { _id: new ObjectId(value.id), deleted: { $exists: false } },
      { $set: value },
      { returnDocument: 'after' },
    );

    return formatData(result.value);
  }

  public async deleteStudent(studentId: string): Promise<IStudent> {
    const result = await this._collectionStudents.findOneAndUpdate(
      { _id: new ObjectId(studentId), deleted: { $exists: false } },
      { $set: { deleted: true } },
      { returnDocument: 'after' },
    );
    return formatData(result.value);
  }

  public async getStudents(groupId: string): Promise<IStudent[]> {
    const result = await this._collectionStudents
      .find({ groupId, deleted: { $exists: false }, role: Role.STUDENT })
      .toArray();
    return result.map((item) => formatData(item));
  }

  public async getStudentByName(value: IBStudent): Promise<IStudent> {
    const result = await this._collectionStudents.findOne({
      name: value.name,
      groupId: value.groupId,
      role: Role.STUDENT,
      deleted: { $exists: false },
    });
    return formatData(result);
  }

  public async getStudentById(studentId: string): Promise<IStudent> {
    const result = await this._collectionStudents.findOne({
      _id: new ObjectId(studentId),
      deleted: { $exists: false },
    });
    return formatData(result);
  }

  public async getStudentByIdFullData(studentId: string): Promise<IStudent> {
    const result = await this._collectionStudents
      .aggregate([
        {
          $match: { _id: new ObjectId(studentId), deleted: { $exists: false } },
        },
        {
          $addFields: {
            mongoIdGroup: {
              $toObjectId: '$groupId',
            },
          },
        },
        {
          $lookup: {
            from: CollectionName.GROUPS,
            localField: 'mongoIdGroup',
            foreignField: '_id',
            as: 'group',
          },
        },
        {
          $unwind: '$group',
        },
        {
          $addFields: {
            'group.id': {
              $toString: '$group._id',
            },
            'group.mongoIdFaculty': {
              $toObjectId: '$group.facultyId',
            },
          },
        },
        {
          $lookup: {
            from: CollectionName.FACULTIES,
            localField: 'group.mongoIdFaculty',
            foreignField: '_id',
            as: 'group.faculty',
          },
        },
        {
          $unwind: '$group.faculty',
        },
        {
          $addFields: {
            'group.faculty.id': {
              $toString: '$group.faculty._id',
            },
          },
        },
        {
          $project: STUDENT_FULL_DATA_PROJECT,
        },
      ])
      .toArray();

    return formatData(result[0]);
  }
}
