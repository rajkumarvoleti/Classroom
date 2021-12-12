import { DMMF, DataSource, GeneratorConfig } from '@prisma/generator-helper';
import { EngineType } from './resolveBinary';
export interface ConfigMetaFormat {
    datasources: DataSource[];
    generators: GeneratorConfig[];
    warnings: string[];
}
export declare type GetDMMFOptions = {
    datamodel?: string;
    cwd?: string;
    prismaPath?: string;
    datamodelPath?: string;
    retry?: number;
    enableExperimental?: string[];
};
export declare function getDMMF({ datamodel, cwd, prismaPath: queryEnginePath, datamodelPath, retry, enableExperimental, }: GetDMMFOptions): Promise<DMMF.Document>;
export declare type GetConfigOptions = {
    datamodel?: string;
    cwd?: string;
    prismaPath?: string;
    datamodelPath?: string;
    retry?: number;
    ignoreEnvVarErrors?: boolean;
};
export declare function getConfig({ datamodel, cwd, prismaPath: queryEnginePath, datamodelPath, ignoreEnvVarErrors, }: GetConfigOptions): Promise<ConfigMetaFormat>;
export declare function formatSchema({ schema }: {
    schema: string;
}): any;
export declare function formatSchema({ schemaPath }: {
    schemaPath: string;
}): any;
export declare function getVersion(enginePath?: string, binaryName?: EngineType): Promise<string>;
