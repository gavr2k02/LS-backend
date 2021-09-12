import { IStudent } from 'models/interfaces/IStudent';
import { IBStudent } from '../../models/interfaces/IBStudent';

export interface IStudentsData {
  createStudent(value: IBStudent): Promise<IStudent>;
  updateStudent(value: IBStudent): Promise<IStudent>;
  deleteStudent(groupId: string): Promise<IStudent>;
  getStudents(groupId: string): Promise<IStudent[]>;
  getStudentByName(value: IBStudent): Promise<IStudent>;
  getStudentById(studentId: string): Promise<IStudent>;
  getStudentByIdFullData(studentId: string): Promise<IStudent>;
}
