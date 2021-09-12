import { checkPayload } from '../../common/joi';
import { IDayLessonsService } from './IDayLessonsService';
import { stringJoi } from '../../common/joi/base/string.scheme';
import { IDayLessonsData } from '../../data/day-lessons/IDayLessonsData';
import { IDayLesson } from 'models/interfaces/IDayLesson';
import { dayLessonScheme } from '../../common/joi/timetable/day-lesson.scheme';

export class DayLessonsService implements IDayLessonsService {
  private readonly _data: IDayLessonsData;

  constructor(data: IDayLessonsData) {
    this._data = data;
  }

  public async getTimetablesDayByDay(clientId: string, facultyId: string, day: string): Promise<IDayLesson[]> {
    await checkPayload(clientId, stringJoi);
    await checkPayload(facultyId, stringJoi);
    await checkPayload(day, stringJoi);
    return this._data.getTimetablesDayByDay(clientId, facultyId, day);
  }

  public async getTimetableDayById(timetableDayId: string): Promise<IDayLesson> {
    await checkPayload(timetableDayId, stringJoi);
    return this._data.getTimetableDayById(timetableDayId);
  }

  public async deleteTimetableDay(timetableDayId: string): Promise<IDayLesson> {
    await checkPayload(timetableDayId, stringJoi);
    return this._data.deleteTimetableDay(timetableDayId);
  }

  public async saveTimetableDay(value: IDayLesson, clientId: string): Promise<IDayLesson> {
    await checkPayload(value, dayLessonScheme);
    return this._data.saveTimetableDay({ ...value, clientId });
  }
}
