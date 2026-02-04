// Initialize MongoDB connection

import { Db, MongoClient } from "mongodb";

export async function connectToMongoDB(client: MongoClient, MONGO_DB?: string): Promise<Db> {
    try {
        await client.connect();
        const db = client.db(MONGO_DB);
        console.error(`Connected to MongoDB: ${MONGO_DB}`);
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}