import { IDayLesson } from 'models/interfaces/IDayLesson';

export interface IDayLessonsService {
  getTimetablesDayByDay(clientId: string, facultyId: string, day: string): Promise<IDayLesson[]>;
  getTimetableDayById(timetableDayId: string): Promise<IDayLesson>;
  deleteTimetableDay(timetableDayId: string): Promise<IDayLesson>;
  saveTimetableDay(value: IDayLesson, clientId: string): Promise<IDayLesson>;
}
