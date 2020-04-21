import {BFastConfig} from "./conf";
import {DomainController} from "./controllers/domainController";
import {FunctionController} from "./controllers/functionController";
import {StorageController} from "./controllers/StorageController";
import {DomainI} from "./core/domainInterface";
import {FunctionAdapter} from "./core/functionInterface";
import {StorageAdapter} from "./core/storageAdapter";
import * as _parse from 'parse/node';
import {AuthController} from "./controllers/AuthController";

/**
 * Created and maintained by Fahamu Tech Ltd Company
 * @maintained Joshua Mshana ( mama27j@gmail.com )
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

        _parse.initialize(BFastConfig.getInstance().getApplicationId());
        // @ts-ignore
        _parse.masterKey = BFastConfig.getInstance().getAppPassword();
        // @ts-ignore
        _parse.serverURL = BFastConfig.getInstance().getCloudDatabaseUrl();
    },

    database: {
        /**
         * it export api for domain
         * @param name {string} domain name
         */
        domain: function (name: string): DomainI {
            return new DomainController(name, _parse);
        },

        /**
         * same as #domain
         */
        collection: function (collectionName: string): DomainI {
            return this.domain(collectionName);
        },
        /**
         * same as #domain
         */
        table: function (tableName: string): DomainI {
            return this.domain(tableName);
        },
    },

    functions: {
        /**
         * exec a cloud function
         * @param path {string} function name
         */
        request: function (path: string): FunctionAdapter {
            return new FunctionController(path);
        },
        onHttpRequest: function (path: string,
                                 handler: ((request: any, response: any, next?: any) => any)[]
                                     | ((request: any, response: any, next?: any) => any)) {
            return {
                path: path,
                onRequest: handler
            }
        },
        onEvent: function (eventName: string,
                           handler: (data: { auth: any, payload: any, socket: any }) => any) {
            return {
                name: eventName,
                onEvent: handler
            }
        }

    },

    auth: AuthController,

    storage: {
        getInstance: function (options: {
            fileName: string,
            data: number[] | { base64: string } | { size: number; type: string; } | { uri: string },
            fileType?: string
        }): StorageAdapter {
            return new StorageController(new _parse.File(options.fileName, options.data, options.fileType));
        }
    }

};
