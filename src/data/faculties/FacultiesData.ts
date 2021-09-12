import { IFaculty } from 'models/interfaces/IFaculty';
import { Collection, ObjectId } from 'mongodb';
import { formatData, getCollection } from '../../common/utils/mongo';
import { IBFaculity } from '../../models/interfaces/IBFaculity';
import { IFacultiesData } from './IFacultiesData';

export class FacultiesData implements IFacultiesData {
  private readonly _collection: Collection<IBFaculity>;

  constructor(collection: Collection<IBFaculity>) {
    this._collection = collection;
  }

  public async getFaculityByName(value: IBFaculity): Promise<IFaculty> {
    const result = await this._collection.findOne({
      name: value.name,
      clientId: value.clientId,
      deleted: { $exists: false },
    });
    return formatData(result);
  }

  public async createFaculity(faculty: IBFaculity): Promise<IFaculty> {
    await this._collection.insertOne(faculty);
    return formatData(faculty);
  }

  public async updateFaculity(faculty: IBFaculity): Promise<IFaculty> {
    const result = await this._collection.findOneAndUpdate(
      { _id: new ObjectId(faculty.id) },
      { $set: faculty },
      { returnDocument: 'after' },
    );

    return formatData(result.value);
  }

  public async deleteFaculity(faculityId: string): Promise<IFaculty> {
    const result = await this._collection.findOneAndUpdate(
      { _id: new ObjectId(faculityId) },
      { $set: { deleted: true } },
      { returnDocument: 'after' },
    );

    return formatData(result.value);
  }

  public async getFaculities(clientId: string): Promise<IFaculty[]> {
    const faculties = await this._collection.find({ clientId, deleted: { $exists: false } }).toArray();
    return faculties.map((faculty) => formatData(faculty));
  }

  public async getFaculityById(faculityId: string): Promise<IFaculty> {
    const faculty = await this._collection.findOne({ _id: new ObjectId(faculityId), deleted: { $exists: false } });
    return formatData(faculty);
  }
}
