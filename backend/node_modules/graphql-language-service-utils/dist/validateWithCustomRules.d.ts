import { ValidationRule, DocumentNode, GraphQLError, GraphQLSchema } from 'graphql';
export declare function validateWithCustomRules(schema: GraphQLSchema, ast: DocumentNode, customRules?: Array<ValidationRule> | null, isRelayCompatMode?: boolean): Array<GraphQLError>;
//# sourceMappingURL=validateWithCustomRules.d.ts.map