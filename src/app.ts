import * as http from 'http';
import { CommonRoutesConfig } from './common/CommonRoutes';
import { FacultiesRoutes } from './controllers/faculties/FacultiesRoutes';
import debug from 'debug';
import express from 'express';
import cors from 'cors';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { FacultiesService } from './services/faculties/FacultiesService';
import { FacultiesData } from './data/faculties/FacultiesData';
import { CollectionName, getCollection } from './common/utils/mongo';
import { IBFaculity } from './models/interfaces/IBFaculity';
import { AuthRoutes } from './controllers/auth/AuthRoutes';
import { AuthService } from './services/auth/AuthService';
import { UsersData } from './data/users/UsersData';
import { IUser } from 'models/interfaces/IUser';
import { GroupsRoutes } from './controllers/groups/GroupsRoutes';
import { GroupsData } from './data/groups/GroupsData';
import { GroupsService } from './services/groups/GroupsService';
import { IBGroup } from './models/interfaces/IBGroup';
import { IBStudent } from './models/interfaces/IBStudent';
import { StudentsRoutes } from './controllers/students/StudentsRoutes';
import { StudentsService } from './services/students/StudentsService';
import { StudentsData } from './data/students/StudentsData';
import { TeachersRoutes } from './controllers/teachers/TeachersRoutes';
import { TeachersService } from './services/teachers/TeachersService';
import { TeachersData } from './data/teachers/TeachersData';
import { IBTeacher } from './models/interfaces/IBTeacher';
import { IBCourse } from './models/interfaces/IBCourse';
import { CoursesRoutes } from './controllers/courses/CoursesRoutes';
import { CoursesService } from './services/courses/CoursesService';
import { CoursesData } from './data/couses/CoursesData';
import { IBDayLesson } from './models/interfaces/IBDayLesson';
import { DayLessonsRoutes } from './controllers/day-lessons/DayLessonsRoutes';
import { DayLessonsService } from './services/day-lessons/DayLessonsService';
import { DayLessonsData } from './data/day-lessons/DayLessonsData';

class App {
  private _app: express.Application = express();
  private _server: http.Server = http.createServer(this._app);
  private _port = 8080;
  private _routes: Array<CommonRoutesConfig> = [];
  private _debugLog: debug.IDebugger = debug('app');

  public async start(): Promise<any> {
    this._app.use(express.json());
    this._app.use(cors());

    const loggerOptions: expressWinston.LoggerOptions = {
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true }),
      ),
    };

    if (!process.env.DEBUG) {
      loggerOptions.meta = false;
    }

    this._app.use(expressWinston.logger(loggerOptions));

    const collectionGroups = await getCollection<IBGroup>(CollectionName.GROUPS);
    const collectionFaculties = await getCollection<IBFaculity>(CollectionName.FACULTIES);
    const collectionUsers = await getCollection<IUser>(CollectionName.USERS);
    const collectionStudents = await getCollection<IBStudent>(CollectionName.USERS);
    const collectionTeachers = await getCollection<IBTeacher>(CollectionName.USERS);
    const collectionCourses = await getCollection<IBCourse>(CollectionName.COURSES);
    const collectionTimetableDay = await getCollection<IBDayLesson>(CollectionName.TIMETABLE);

    this._routes.push(new AuthRoutes(this._app, new AuthService(new UsersData(collectionUsers))));
    this._routes.push(new FacultiesRoutes(this._app, new FacultiesService(new FacultiesData(collectionFaculties))));
    this._routes.push(
      new GroupsRoutes(this._app, new GroupsService(new GroupsData(collectionGroups, collectionFaculties))),
    );
    this._routes.push(
      new StudentsRoutes(this._app, new StudentsService(new StudentsData(collectionStudents, collectionGroups))),
    );
    this._routes.push(new TeachersRoutes(this._app, new TeachersService(new TeachersData(collectionTeachers))));
    this._routes.push(new CoursesRoutes(this._app, new CoursesService(new CoursesData(collectionCourses))));
    this._routes.push(
      new DayLessonsRoutes(this._app, new DayLessonsService(new DayLessonsData(collectionTimetableDay))),
    );

    const runningMessage = `Server running at http://localhost:${this._port}`;

    this._server.listen(this._port, () => {
      this._routes.forEach((route: CommonRoutesConfig) => {
        this._debugLog(`Routes configured for ${route.name}`);
      });

      console.log(runningMessage);
    });
  }
}

new App().start();
