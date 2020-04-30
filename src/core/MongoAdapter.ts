import {MongoClient} from "mongodb";

export interface MongoAdapter {
    connect(): Promise<MongoClient>
}