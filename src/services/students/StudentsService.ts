import { ILoginPassword } from 'models/interfaces/ILoginPassword';
import { IStudent } from 'models/interfaces/IStudent';
import { checkPayload } from '../../common/joi';
import { stringJoi } from '../../common/joi/base/string.scheme';
import { studentScheme } from '../../common/joi/card/student.scheme';
import { IStudentsData } from '../../data/students/IStudentsData';
import { IStudentsService } from './IStudentsService';
import bcrypt from 'bcryptjs';
export class StudentsService implements IStudentsService {
  private readonly _data: IStudentsData;

  constructor(data: IStudentsData) {
    this._data = data;
  }

  public async createStudent(value: IStudent, clientId: string): Promise<IStudent> {
    await checkPayload(value, studentScheme);
    const result = await this._data.getStudentByName({ ...value, clientId });

    if (result) {
      throw new Error('This name exists');
    }

    return this._data.createStudent({ ...value, clientId });
  }

  public async updateStudent(value: IStudent, clientId: string): Promise<IStudent> {
    await checkPayload(value, studentScheme);
    const result = await this._data.getStudentByName({ ...value, clientId });

    if (result && result?.id !== value.id) {
      throw new Error('This name exists');
    }

    return this._data.updateStudent({ ...value, clientId });
  }

  public async updateStudentPassword(value: IStudent, clientId: string): Promise<IStudent> {
    await checkPayload(value, studentScheme);
    const result = await this._data.getStudentByName({ ...value, clientId });

    if (result && result?.id !== value.id) {
      throw new Error('This name exists');
    }

    (value.fields as ILoginPassword).password = await bcrypt.hash((value.fields as ILoginPassword).password, 10);
    return this._data.updateStudent({ ...value, clientId });
  }

  public async deleteStudent(studentId: string): Promise<IStudent> {
    await checkPayload(studentId, stringJoi);
    return this._data.deleteStudent(studentId);
  }

  public async getStudents(groupId: string): Promise<IStudent[]> {
    await checkPayload(groupId, stringJoi);
    return this._data.getStudents(groupId);
  }

  public async getStudnetById(studentId: string): Promise<IStudent> {
    await checkPayload(studentId, stringJoi);
    return this._data.getStudentById(studentId);
  }

  public async getStudentByIdFullData(studentId: string): Promise<IStudent> {
    await checkPayload(studentId, stringJoi);
    return this._data.getStudentByIdFullData(studentId);
  }
}
