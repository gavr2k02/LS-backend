import { IFaculty } from 'models/interfaces/IFaculty';
import { checkPayload } from '../../common/joi';
import { stringJoi } from '../../common/joi/base/string.scheme';
import { facultyScheme } from '../../common/joi/card/faculty.scheme';
import { IFacultiesData } from '../../data/faculties/IFacultiesData';
import { IFacultiesService } from './IFacultiesService';

export class FacultiesService implements IFacultiesService {
  private readonly _data: IFacultiesData;

  constructor(data: IFacultiesData) {
    this._data = data;
  }

  public async createFaculity(value: IFaculty, clientId: string): Promise<IFaculty> {
    await checkPayload(value, facultyScheme);
    const result = await this._data.getFaculityByName({ ...value, clientId });

    if (result) {
      throw new Error('This name exists');
    }

    return this._data.createFaculity({ ...value, clientId });
  }

  public async updateFaculity(value: IFaculty, clientId: string): Promise<IFaculty> {
    await checkPayload(value, facultyScheme);
    const result = await this._data.getFaculityByName({ ...value, clientId });

    if (result && result?.id !== value.id) {
      throw new Error('This name exists');
    }

    return this._data.updateFaculity({ ...value, clientId });
  }

  public async deleteFaculity(faculityId: string): Promise<IFaculty> {
    await checkPayload(faculityId, stringJoi);
    return this._data.deleteFaculity(faculityId);
  }

  public async getFaculities(clientId: string): Promise<IFaculty[]> {
    await checkPayload(clientId, stringJoi);
    return this._data.getFaculities(clientId);
  }

  public async getFaculityById(faculityId: string): Promise<IFaculty> {
    await checkPayload(faculityId, stringJoi);
    return this._data.getFaculityById(faculityId);
  }
}
