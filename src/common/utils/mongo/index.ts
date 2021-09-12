import { Collection, Db, MongoClient } from 'mongodb';
import { env } from 'process';

let client: MongoClient;

const DB_NAME: string = 'develop';

async function getMongoClient(): Promise<MongoClient> {
  if (client) {
    return client;
  }

  console.log('connect to mongo');
  client = await new MongoClient(
    env.MONGODB_URL ||
      `mongodb+srv://user:admin@cluster0.wa8sr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  ).connect();
  console.log('connect sucefly');

  return client;
}

export async function getDB(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

export async function getCollection<T>(name: string): Promise<Collection<T>> {
  const db = await getDB();
  return db.collection(name);
}

export enum CollectionName {
  FACULTIES = 'faculties',
  GROUPS = 'groups',
  USERS = 'users',
  COURSES = 'courses',
  TIMETABLE = 'timetable',
}

export function formatData<BT, T>(bValue: BT): T {
  const value: T = bValue as any;

  if (!value) {
    return value;
  }

  value['id'] = bValue['_id'].toHexString();
  delete value['_id'];
  delete value['clientId'];

  return value;
}
