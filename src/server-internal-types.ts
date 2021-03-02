import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};


export type Group = {
  __typename?: 'Group';
  id: Scalars['Int'];
  name: Scalars['String'];
  groupType: GroupType;
};

export type GroupInput = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  listGroups: Array<Group>;
  listShipments: Array<Shipment>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addGroup: Group;
  addShipment: Shipment;
};


export type MutationAddGroupArgs = {
  input: GroupInput;
};


export type MutationAddShipmentArgs = {
  input: ShipmentInput;
};

export type ShipmentInput = {
  shippingRoute: ShippingRoute;
  labelYear: Scalars['Int'];
  labelMonth: Scalars['Int'];
  sendingHubId: Scalars['Int'];
  receivingHubId: Scalars['Int'];
  status: ShipmentStatus;
};

export enum ShippingRoute {
  Uk = 'UK'
}

export enum ShipmentStatus {
  Announced = 'ANNOUNCED',
  Open = 'OPEN',
  Staging = 'STAGING',
  InProgress = 'IN_PROGRESS',
  Complete = 'COMPLETE',
  Abandoned = 'ABANDONED'
}

export type Shipment = {
  __typename?: 'Shipment';
  id: Scalars['Int'];
  shippingRoute: ShippingRoute;
  labelYear: Scalars['Int'];
  labelMonth: Scalars['Int'];
  offerSubmissionDeadline?: Maybe<Scalars['Date']>;
  status: ShipmentStatus;
  sendingHubId: Scalars['Int'];
  sendingHub: Group;
  receivingHubId: Scalars['Int'];
  receivingHub: Group;
  statusChangeTime: Scalars['Date'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export enum GroupType {
  DaHub = 'DA_HUB',
  ReceivingGroup = 'RECEIVING_GROUP',
  SendingGroup = 'SENDING_GROUP'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Group: ResolverTypeWrapper<Group>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  GroupInput: GroupInput;
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  ShipmentInput: ShipmentInput;
  ShippingRoute: ShippingRoute;
  ShipmentStatus: ShipmentStatus;
  Shipment: ResolverTypeWrapper<Shipment>;
  GroupType: GroupType;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Date: Scalars['Date'];
  Group: Group;
  Int: Scalars['Int'];
  String: Scalars['String'];
  GroupInput: GroupInput;
  Query: {};
  Mutation: {};
  ShipmentInput: ShipmentInput;
  Shipment: Shipment;
  Boolean: Scalars['Boolean'];
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groupType?: Resolver<ResolversTypes['GroupType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  listGroups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>;
  listShipments?: Resolver<Array<ResolversTypes['Shipment']>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationAddGroupArgs, 'input'>>;
  addShipment?: Resolver<ResolversTypes['Shipment'], ParentType, ContextType, RequireFields<MutationAddShipmentArgs, 'input'>>;
}>;

export type ShipmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Shipment'] = ResolversParentTypes['Shipment']> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shippingRoute?: Resolver<ResolversTypes['ShippingRoute'], ParentType, ContextType>;
  labelYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  labelMonth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  offerSubmissionDeadline?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ShipmentStatus'], ParentType, ContextType>;
  sendingHubId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sendingHub?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  receivingHubId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  receivingHub?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  statusChangeTime?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Date?: GraphQLScalarType;
  Group?: GroupResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Shipment?: ShipmentResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
