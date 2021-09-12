import { IDayLesson } from 'models/interfaces/IDayLesson';
import { IBDayLesson } from '../../models/interfaces/IBDayLesson';

export interface IDayLessonsData {
  getTimetablesDayByDay(clientId: string, facultyId: string, day: string): Promise<IDayLesson[]>;
  getTimetableDayById(timetableDayId: string): Promise<IDayLesson>;
  deleteTimetableDay(timetableDayId: string): Promise<IDayLesson>;
  saveTimetableDay(value: IBDayLesson): Promise<IDayLesson>;
}
