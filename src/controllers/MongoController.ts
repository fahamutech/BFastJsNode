import {MongoAdapter} from "../core/MongoAdapter";
import {MongoClient} from "mongodb";

export class MongoController implements MongoAdapter {
    private _mongo: MongoClient | undefined;

    private constructor(private readonly options?: { mongoUrl: string }) {
    }

    private static instance: MongoController;

    static getInstance(): MongoController {
        if (!MongoController.instance) {
            MongoController.instance = new MongoController();
        }

        return MongoController.instance;
    }

    async connect(): Promise<MongoClient> {
        try {
            if (this._mongo && this._mongo.isConnected()) {
                return this._mongo;
            } else {
                const dbUrl = (this.options?.mongoUrl != null) ? this.options?.mongoUrl : (process.env.MONGO_URL as string)
                this._mongo = await new MongoClient(dbUrl, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }).connect();
                return this._mongo;
            }
        } catch (e) {
            throw e;
        }
    }
}
