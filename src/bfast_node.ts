import {BFastConfig} from './conf';
import {DomainController} from './controllers/domainController';
import {FunctionController} from './controllers/functionController';
import {StorageController} from './controllers/StorageController';
import {DomainI} from './core/domainInterface';
import {FunctionAdapter} from './core/FunctionAdapter';
import {StorageAdapter} from './core/storageAdapter';
import * as _parse from 'parse/node';
import {AuthController} from './controllers/AuthController';
import {SocketController} from "./controllers/SocketController";
import {TransactionController} from "./controllers/TransactionController";
import {TransactionAdapter} from "./core/TransactionAdapter";
import {RealTimeAdapter} from "./core/RealTimeAdapter";

/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Fahamu Tech ( fahamutechdevelopers@gmail.com )
 */

export const BFast = {

    /**
     *
     * @param options
     */
    init: function (options: {
        cloudDatabaseUrl?: string,
        cloudFunctionsUrl?: string,
        applicationId: string,
        projectId: string,
        autoDevMode?: boolean,
        appPassword?: string,
        token?: string,
    }) {
        BFastConfig.getInstance().cloudDatabaseUrl = options.cloudDatabaseUrl ? options.cloudDatabaseUrl : '';
        BFastConfig.getInstance().token = options.token ? options.token : '';
        BFastConfig.getInstance().cloudFunctionsUrl = options.cloudFunctionsUrl ? options.cloudFunctionsUrl : '';
        BFastConfig.getInstance().applicationId = options.applicationId;
        BFastConfig.getInstance().projectId = options.projectId;
        BFastConfig.getInstance().autoDevMode = options.autoDevMode === undefined ? true : options.autoDevMode;
        BFastConfig.getInstance().appPassword = options.appPassword ? options.appPassword : undefined;

        _parse.initialize(BFastConfig.getInstance().getApplicationId(), undefined, BFastConfig.getInstance().getAppPassword());
        // @ts-ignore
        _parse.serverURL = BFastConfig.getInstance().getCloudDatabaseUrl();
        _parse.CoreManager.set('REQUEST_BATCH_SIZE', 1000000);
    },

    database: {
        /**
         * it export api for domain
         * @param name {string} domain name
         */
        domain<T>(name: string): DomainI<T> {
            return new DomainController<T>(name, _parse);
        },

        /**
         * same as #domain
         */
        collection<T>(collectionName: string): DomainI<T> {
            return this.domain<T>(collectionName);
        },
        /**
         * same as #domain
         */
        table<T>(tableName: string): DomainI<T> {
            return this.domain<T>(tableName);
        },

        transaction(): TransactionAdapter {
            return new TransactionController();
        }
    },

    functions: {
        /**
         * exec a cloud function
         * @param path {string} function name
         */
        request(path: string): FunctionAdapter {
            return new FunctionController(path);
        },
        onHttpRequest(path: string,
                      handler: ((request: any, response: any, next?: any) => any)[]
                          | ((request: any, response: any, next?: any) => any)) {
            return {
                path: path,
                onRequest: handler
            };
        },
        onEvent(eventName: string,
                handler: (data: { auth: any, payload: any, socket: any }) => any) {
            return {
                name: eventName,
                onEvent: handler
            };
        },
        event(eventName: string, onConnect?: Function, onDisconnect?: Function): RealTimeAdapter {
            return new SocketController(eventName, onConnect, onDisconnect);
        }

    },

    auth: AuthController,

    /**
     * direct access to mongodb and parse_server
     */
    directAccess: {
        parseSdk: _parse,
    },

    storage: {
        getInstance(options: {
            fileName: string,
            data: number[] | { base64: string } | { size: number; type: string; } | { uri: string },
            fileType?: string
        }): StorageAdapter {
            return new StorageController(new _parse.File(options.fileName, options.data, options.fileType));
        }
    }

};
