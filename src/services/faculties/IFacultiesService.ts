import { IFaculty } from 'models/interfaces/IFaculty';

export interface IFacultiesService {
  createFaculity(faculty: IFaculty, clientId: string): Promise<IFaculty>;
  updateFaculity(faculty: IFaculty, clientId: string): Promise<IFaculty>;
  deleteFaculity(faculityId: string): Promise<IFaculty>;
  getFaculities(clientId: string): Promise<IFaculty[]>;
  getFaculityById(faculityId: string): Promise<IFaculty>;
}
