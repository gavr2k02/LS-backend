import { ITeacher } from 'models/interfaces/ITeacher';
import { IBTeacher } from '../../models/interfaces/IBTeacher';

export interface ITeachersData {
  createTeacher(value: IBTeacher): Promise<ITeacher>;
  updateTeacher(value: IBTeacher): Promise<ITeacher>;
  deleteTeacher(teacherId: string): Promise<ITeacher>;
  getTeachers(clientId: string): Promise<ITeacher[]>;
  getTeacherByName(value: IBTeacher): Promise<ITeacher>;
  getTeacherById(teacherId: string): Promise<ITeacher>;
}
