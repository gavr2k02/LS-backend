import { IStudent } from 'models/interfaces/IStudent';

export interface IStudentsService {
  createStudent(value: IStudent, clientId: string): Promise<IStudent>;
  updateStudent(value: IStudent, clientId: string): Promise<IStudent>;
  deleteStudent(studentId: string): Promise<IStudent>;
  getStudents(groupId: string): Promise<IStudent[]>;
  getStudnetById(studentId: string): Promise<IStudent>;
  getStudentByIdFullData(studentId: string): Promise<IStudent>;
}
