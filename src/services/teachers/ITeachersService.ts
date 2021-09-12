import { ITeacher } from 'models/interfaces/ITeacher';

export interface ITeachersService {
  createTeacher(value: ITeacher, clientId: string): Promise<ITeacher>;
  updateTeacher(value: ITeacher, clientId: string): Promise<ITeacher>;
  deleteTeacher(teacherId: string): Promise<ITeacher>;
  getTeachers(clientId: string): Promise<ITeacher[]>;
  getTeacherById(teacherId: string): Promise<ITeacher>;
}
