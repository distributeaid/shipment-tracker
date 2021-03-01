/**
 * ⚠️ These type definitions are generated automatically by graphql-codegen.
 * The generation is configurated in codegen.yaml. Visit the docs for more information:
 * https://graphql-code-generator.com/docs/getting-started/index
 */

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Group = {
  __typename?: 'Group';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  listGroups: Array<Maybe<Group>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addGroup?: Maybe<Group>;
};


export type MutationAddGroupArgs = {
  name?: Maybe<Scalars['String']>;
};
