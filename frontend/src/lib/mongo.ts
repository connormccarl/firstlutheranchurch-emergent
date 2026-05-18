import { MongoClient, Db } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "first_lutheran_miami";

// Re-use MongoClient across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;
if (!global._mongoClient) {
  global._mongoClient = new MongoClient(MONGO_URL);
}
client = global._mongoClient;

let connected = false;
async function ensureConnected() {
  if (!connected) {
    await client.connect();
    connected = true;
  }
}

export async function getDb(): Promise<Db> {
  await ensureConnected();
  return client.db(DB_NAME);
}
