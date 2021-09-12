import { ICourse } from 'models/interfaces/ICourse';
import { IDayLesson } from 'models/interfaces/IDayLesson';
import { Collection, ObjectId } from 'mongodb';
import { formatData } from '../../common/utils/mongo';
import { IBDayLesson } from '../../models/interfaces/IBDayLesson';
import { IDayLessonsData } from './IDayLessonsData';

export class DayLessonsData implements IDayLessonsData {
  private readonly _collectionLessons: Collection<IBDayLesson>;

  constructor(collectionLessons: Collection<IBDayLesson>) {
    this._collectionLessons = collectionLessons;
  }

  public async getTimetablesDayByDay(clientId: string, facultyId: string, day: string): Promise<IDayLesson[]> {
    const result = await this._collectionLessons
      .find({ clientId, facultyId, day, deleted: { $exists: false } })
      .toArray();
    return result.map((item) => formatData(item));
  }

  public async getTimetableDayById(timetableDayId: string): Promise<IDayLesson> {
    const result = await this._collectionLessons.findOne({
      _id: new ObjectId(timetableDayId),
      deleted: { $exists: false },
    });
    return formatData(result);
  }

  public async deleteTimetableDay(timetableDayId: string): Promise<IDayLesson> {
    const result = await this._collectionLessons.findOneAndUpdate(
      { _id: new ObjectId(timetableDayId), deleted: { $exists: false } },
      { $set: { deleted: true } },
      { returnDocument: 'after' },
    );
    return formatData(result.value);
  }

  public async saveTimetableDay(value: IBDayLesson): Promise<IDayLesson> {
    const result = await this._collectionLessons.findOneAndUpdate(
      { _id: new ObjectId(value.id), deleted: { $exists: false } },
      { $set: value },
      { returnDocument: 'after', upsert: true },
    );

    return formatData(result.value);
  }
}
