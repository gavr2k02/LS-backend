import { ICourse } from 'models/interfaces/ICourse';
import { IBCourse } from '../../models/interfaces/IBCourse';

export interface ICoursesData {
  createCourse(value: IBCourse): Promise<ICourse>;
  updateCourse(value: IBCourse): Promise<ICourse>;
  deleteCourse(courseId: string): Promise<ICourse>;
  getCourses(clientId: string): Promise<ICourse[]>;
  getCourseByName(value: IBCourse): Promise<ICourse>;
  getCourseById(courseId: string): Promise<ICourse>;
}
