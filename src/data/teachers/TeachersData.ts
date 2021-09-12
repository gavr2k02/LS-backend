import { Role } from 'models/enums/Role';
import { IStudent } from 'models/interfaces/IStudent';
import { ITeacher } from 'models/interfaces/ITeacher';
import { Collection, ObjectId } from 'mongodb';
import { formatData } from '../../common/utils/mongo';
import { IBStudent } from '../../models/interfaces/IBStudent';
import { IBTeacher } from '../../models/interfaces/IBTeacher';
import { ITeachersData } from './ITeachersData';

export class TeachersData implements ITeachersData {
  private readonly _collectionTeachers: Collection<IBTeacher>;

  constructor(collectionTeachers: Collection<IBTeacher>) {
    this._collectionTeachers = collectionTeachers;
  }

  public async createTeacher(value: IBTeacher): Promise<ITeacher> {
    value.role = Role.TEACHER;
    await this._collectionTeachers.insertOne(value);
    return formatData(value);
  }

  public async updateTeacher(value: IBTeacher): Promise<ITeacher> {
    const result = await this._collectionTeachers.findOneAndUpdate(
      { _id: new ObjectId(value.id), deleted: { $exists: false } },
      { $set: value },
      { returnDocument: 'after' },
    );

    return formatData(result.value);
  }

  public async deleteTeacher(teacherId: string): Promise<ITeacher> {
    const result = await this._collectionTeachers.findOneAndUpdate(
      { _id: new ObjectId(teacherId), deleted: { $exists: false } },
      { $set: { deleted: true } },
      { returnDocument: 'after' },
    );
    return formatData(result.value);
  }

  public async getTeachers(clientId: string): Promise<ITeacher[]> {
    const result = await this._collectionTeachers
      .find({ clientId, deleted: { $exists: false }, role: Role.TEACHER })
      .toArray();
    return result.map((item) => formatData(item));
  }

  public async getTeacherByName(value: IBStudent): Promise<IStudent> {
    const result = await this._collectionTeachers.findOne({
      name: value.name,
      role: Role.TEACHER,
      groupId: value.groupId,
      deleted: { $exists: false },
    });
    return formatData(result);
  }

  public async getTeacherById(teacherId: string): Promise<IStudent> {
    const result = await this._collectionTeachers.findOne({
      _id: new ObjectId(teacherId),
      deleted: { $exists: false },
    });
    return formatData(result);
  }
}
