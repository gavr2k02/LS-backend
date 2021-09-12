import { checkPayload } from '../../common/joi';
import { ICoursesService } from './ICoursesService';
import { ICoursesData } from '../../data/couses/ICoursesData';
import { ICourse } from 'models/interfaces/ICourse';
import { courseScheme } from '../../common/joi/card/course.scheme copy';
import { stringJoi } from '../../common/joi/base/string.scheme';

export class CoursesService implements ICoursesService {
  private readonly _data: ICoursesData;

  constructor(data: ICoursesData) {
    this._data = data;
  }

  public async createCourse(value: ICourse, clientId: string): Promise<ICourse> {
    await checkPayload(value, courseScheme);
    const result = await this._data.getCourseByName({ ...value, clientId });

    if (result) {
      throw new Error('This name exists');
    }

    return this._data.createCourse({ ...value, clientId });
  }

  public async updateCourse(value: ICourse, clientId: string): Promise<ICourse> {
    await checkPayload(value, courseScheme);
    const result = await this._data.getCourseByName({ ...value, clientId });

    if (result && result?.id !== value.id) {
      throw new Error('This name exists');
    }

    return this._data.updateCourse({ ...value, clientId });
  }

  public async deleteCourse(courseId: string): Promise<ICourse> {
    await checkPayload(courseId, stringJoi);
    return this._data.deleteCourse(courseId);
  }

  public async getCourses(clientId: string): Promise<ICourse[]> {
    await checkPayload(clientId, stringJoi);
    return this._data.getCourses(clientId);
  }

  public async getCourseById(courseId: string): Promise<ICourse> {
    await checkPayload(courseId, stringJoi);
    return this._data.getCourseById(courseId);
  }
}
