import { ICourse } from 'models/interfaces/ICourse';

export interface ICoursesService {
  createCourse(value: ICourse, clientId: string): Promise<ICourse>;
  updateCourse(value: ICourse, clientId: string): Promise<ICourse>;
  deleteCourse(courseId: string): Promise<ICourse>;
  getCourses(clientId: string): Promise<ICourse[]>;
  getCourseById(courseId: string): Promise<ICourse>;
}
