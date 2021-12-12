import { GraphQLField, GraphQLSchema, GraphQLType } from 'graphql';
import { CompletionItemBase, AllTypeInfo } from 'graphql-language-service-types';
import { ContextTokenUnion, State } from 'graphql-language-service-parser';
export declare function getDefinitionState(tokenState: State): State | null | undefined;
export declare function getFieldDef(schema: GraphQLSchema, type: GraphQLType, fieldName: string): GraphQLField<any, any> | null | undefined;
export declare function forEachState(stack: State, fn: (state: State) => AllTypeInfo | null | void): void;
export declare function objectValues<T>(object: Record<string, T>): Array<T>;
export declare function hintList<T extends CompletionItemBase>(token: ContextTokenUnion, list: Array<T>): Array<T>;
//# sourceMappingURL=autocompleteUtils.d.ts.map