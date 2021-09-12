import { ITeacher } from 'models/interfaces/ITeacher';
import { checkPayload } from '../../common/joi';
import { stringJoi } from '../../common/joi/base/string.scheme';
import { teacherScheme } from '../../common/joi/card/teacher.scheme';
import { ITeachersData } from '../../data/teachers/ITeachersData';
import { ITeachersService } from './ITeachersService';

export class TeachersService implements ITeachersService {
  private readonly _data: ITeachersData;

  constructor(data: ITeachersData) {
    this._data = data;
  }

  public async createTeacher(value: ITeacher, clientId: string): Promise<ITeacher> {
    await checkPayload(value, teacherScheme);
    const result = await this._data.getTeacherByName({ ...value, clientId });

    if (result) {
      throw new Error('This name exists');
    }

    return this._data.createTeacher({ ...value, clientId });
  }

  public async updateTeacher(value: ITeacher, clientId: string): Promise<ITeacher> {
    await checkPayload(value, teacherScheme);
    const result = await this._data.getTeacherByName({ ...value, clientId });

    if (result && result?.id !== value.id) {
      throw new Error('This name exists');
    }

    return this._data.updateTeacher({ ...value, clientId });
  }

  public async deleteTeacher(teacherId: string): Promise<ITeacher> {
    await checkPayload(teacherId, stringJoi);
    return this._data.deleteTeacher(teacherId);
  }

  public async getTeachers(clientId: string): Promise<ITeacher[]> {
    await checkPayload(clientId, stringJoi);
    return this._data.getTeachers(clientId);
  }

  public async getTeacherById(teacherId: string): Promise<ITeacher> {
    await checkPayload(teacherId, stringJoi);
    return this._data.getTeacherById(teacherId);
  }
}
