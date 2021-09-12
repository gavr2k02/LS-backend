import { ICourse } from 'models/interfaces/ICourse';
import { Collection, ObjectId } from 'mongodb';
import { formatData } from '../../common/utils/mongo';
import { IBCourse } from '../../models/interfaces/IBCourse';
import { ICoursesData } from './ICoursesData';

export class CoursesData implements ICoursesData {
  private readonly _collectionCourses: Collection<IBCourse>;

  constructor(collectionCourses: Collection<IBCourse>) {
    this._collectionCourses = collectionCourses;
  }

  public async createCourse(value: IBCourse): Promise<ICourse> {
    await this._collectionCourses.insertOne(value);
    return formatData(value);
  }

  public async updateCourse(value: IBCourse): Promise<ICourse> {
    const result = await this._collectionCourses.findOneAndUpdate(
      { _id: new ObjectId(value.id), deleted: { $exists: false } },
      { $set: value },
      { returnDocument: 'after' },
    );

    return formatData(result.value);
  }

  public async deleteCourse(courseId: string): Promise<ICourse> {
    const result = await this._collectionCourses.findOneAndUpdate(
      { _id: new ObjectId(courseId), deleted: { $exists: false } },
      { $set: { deleted: true } },
      { returnDocument: 'after' },
    );
    return formatData(result.value);
  }

  public async getCourses(clientId: string): Promise<ICourse[]> {
    const result = await this._collectionCourses.find({ clientId, deleted: { $exists: false } }).toArray();
    return result.map((item) => formatData(item));
  }

  public async getCourseByName(value: IBCourse): Promise<ICourse> {
    const result = await this._collectionCourses.findOne({
      name: value.name,
      deleted: { $exists: false },
    });
    return formatData(result);
  }

  public async getCourseById(courseId: string): Promise<ICourse> {
    const result = await this._collectionCourses.findOne({
      _id: new ObjectId(courseId),
      deleted: { $exists: false },
    });
    return formatData(result);
  }
}
