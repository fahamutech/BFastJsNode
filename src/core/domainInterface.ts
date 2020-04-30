import {QueryController} from "../controllers/QueryController";

export interface DomainI<T> {
    domainName: string;

    save<T>(model: T): Promise<T>;

    getAll<T>(): Promise<T[]>;

    get<T>(objectId: string): Promise<T>;

    query<T>(): QueryController<T>;

    update<T>(objectId: string, model: T): Promise<T>;

    delete<T>(objectId: string): Promise<any>;
}

export interface DomainModel {
    [name: string]: any
}
