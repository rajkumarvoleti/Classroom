import type { GraphQLError } from "graphql";
export declare class InvalidSchemaError extends Error {
    constructor(validationErrors: readonly GraphQLError[]);
}
