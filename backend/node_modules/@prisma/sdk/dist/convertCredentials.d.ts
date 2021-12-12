import { DatabaseCredentials } from './types';
import { ConnectorType } from '@prisma/generator-helper';
export declare function credentialsToUri(credentials: DatabaseCredentials): string;
export declare function uriToCredentials(connectionString: string): DatabaseCredentials;
export declare function databaseTypeToConnectorType(databaseType: ConnectorType): ConnectorType;
