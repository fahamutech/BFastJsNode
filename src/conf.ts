export class BFastConfig {
    applicationId: any;
    cloudFunctionsUrl: any;
    projectId: any;
    cloudDatabaseUrl: any;
    token: any;
    appPassword: string | null | undefined;
    autoDevMode: boolean | undefined;
    private static devEnv: boolean = false;

    private constructor() {
    }

    private static instance: BFastConfig;

    static getInstance(): BFastConfig {
        this.devEnv = (process.env.IS_LOCAL_BFAST === 'true');
        if (!BFastConfig.instance) {
            BFastConfig.instance = new BFastConfig();
        }

        return BFastConfig.instance;
    }

    getHeaders(): { [key: string]: any } {
        return {
            'Content-Type': 'application/json',
            'X-Parse-Application-Id': (this.autoDevMode && BFastConfig.devEnv) ?
                process.env.APPLICATION_ID : this.applicationId ? this.applicationId : process.env.APPLICATION_ID
        };
    };

    getApplicationId(): string {
        if (this.autoDevMode && BFastConfig.devEnv) {
            return process.env.APPLICATION_ID ? process.env.APPLICATION_ID : '';
        }
        return this.applicationId ? this.applicationId : process.env.APPLICATION_ID;
    }

    getAppPassword() {
        if (this.autoDevMode && BFastConfig.devEnv) {
            return process.env.MASTER_KEY ? process.env.MASTER_KEY : undefined;
        }
        return this.appPassword;
    }

    getCloudFunctionsUrl(path: string) {
        if (path.startsWith('http')) {
            return path;
        }
        if (this.autoDevMode && BFastConfig.devEnv) {
            return `http://localhost:${process.env.DEV_PORT}${path}`;
        }
        if (this.cloudFunctionsUrl && this.cloudFunctionsUrl.startsWith('http')) {
            return `${this.cloudFunctionsUrl}${path}`;
        }
        return `https://${this.projectId ? this.projectId : process.env.PROJECT_ID}-faas.bfast.fahamutech.com${path}`;
    };

    getCloudDatabaseUrl() {
        if (this.autoDevMode && BFastConfig.devEnv) {
            return `http://localhost:${process.env.DEV_PORT}/_api`;
        }
        if (this.cloudDatabaseUrl && this.cloudDatabaseUrl.startsWith('http')) {
            return this.cloudDatabaseUrl;
        }
        return `https://${this.projectId ? this.projectId : process.env.PROJECT_ID}-daas.bfast.fahamutech.com`;
    };
}
