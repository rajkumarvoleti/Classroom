export declare type EngineType = 'query-engine' | 'migration-engine' | 'introspection-engine' | 'prisma-fmt';
export declare const engineEnvVarMap: {
    'query-engine': string;
    'migration-engine': string;
    'introspection-engine': string;
    'prisma-fmt': string;
};
export declare function resolveBinary(name: EngineType, proposedPath?: string): Promise<string>;
export declare function maybeCopyToTmp(file: string): Promise<string>;
