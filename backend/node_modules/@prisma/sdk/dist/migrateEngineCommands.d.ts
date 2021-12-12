import execa from 'execa';
export declare type DatabaseErrorCodes = 'P1000' | 'P1001' | 'P1002' | 'P1003' | 'P1009' | 'P1010';
export declare type ConnectionResult = true | ConnectionError;
export interface ConnectionError {
    message: string;
    code: DatabaseErrorCodes;
    meta?: any;
}
export declare function canConnectToDatabase(connectionString: string, cwd?: string, migrationEnginePath?: string): Promise<ConnectionResult>;
export declare function createDatabase(connectionString: string, cwd?: string, migrationEnginePath?: string): Promise<execa.ExecaReturnValue | false>;
export declare function dropDatabase(connectionString: string, cwd?: string, migrationEnginePath?: string): Promise<execa.ExecaReturnValue>;
