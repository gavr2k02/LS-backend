import { IFaculty } from 'models/interfaces/IFaculty';
import { IBFaculity } from '../../models/interfaces/IBFaculity';

export interface IFacultiesData {
  createFaculity(faculty: IBFaculity): Promise<IFaculty>;
  updateFaculity(faculty: IBFaculity): Promise<IFaculty>;
  deleteFaculity(faculityId: string): Promise<IFaculty>;
  getFaculities(clientId: string): Promise<IFaculty[]>;
  getFaculityByName(value: IBFaculity): Promise<IFaculty>;
  getFaculityById(faculityId: string): Promise<IFaculty>;
}
