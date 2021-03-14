/**
 * ⚠️ These type definitions are generated automatically by graphql-codegen.
 * The generation is configurated in codegen.yaml. Visit the docs for more information:
 * https://graphql-code-generator.com/docs/getting-started/index
 */

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
import { AuthenticatedContext } from './apolloServer'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

export type Location = {
  __typename?: 'Location'
  countryCode?: Maybe<Scalars['String']>
  townCity: Scalars['String']
  openLocationCode?: Maybe<Scalars['String']>
}

export type ContactInfo = {
  __typename?: 'ContactInfo'
  name: Scalars['String']
  email?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  signal?: Maybe<Scalars['String']>
  whatsApp?: Maybe<Scalars['String']>
}

export type LocationInput = {
  countryCode?: Maybe<Scalars['String']>
  townCity: Scalars['String']
  openLocationCode?: Maybe<Scalars['String']>
}

export type ContactInfoInput = {
  name: Scalars['String']
  email?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  signal?: Maybe<Scalars['String']>
  whatsApp?: Maybe<Scalars['String']>
}

export type Group = {
  __typename?: 'Group'
  id: Scalars['Int']
  name: Scalars['String']
  groupType: GroupType
  primaryLocation: Location
  primaryContact: ContactInfo
  website?: Maybe<Scalars['String']>
  captainId: Scalars['Int']
  createdAt: Scalars['Date']
  updatedAt: Scalars['Date']
}

export type GroupCreateInput = {
  name: Scalars['String']
  groupType: GroupType
  primaryLocation: LocationInput
  primaryContact: ContactInfoInput
  website?: Maybe<Scalars['String']>
}

export type GroupUpdateInput = {
  name?: Maybe<Scalars['String']>
  groupType?: Maybe<GroupType>
  primaryLocation?: Maybe<LocationInput>
  primaryContact?: Maybe<ContactInfoInput>
  website?: Maybe<Scalars['String']>
  captainId?: Maybe<Scalars['Int']>
}

export type ShipmentUpdateInput = {
  shippingRoute?: Maybe<ShippingRoute>
  labelYear?: Maybe<Scalars['Int']>
  labelMonth?: Maybe<Scalars['Int']>
  sendingHubId?: Maybe<Scalars['Int']>
  receivingHubId?: Maybe<Scalars['Int']>
  status?: Maybe<ShipmentStatus>
}

export type Query = {
  __typename?: 'Query'
  group: Group
  listGroups: Array<Group>
  shipment: Shipment
  listShipments: Array<Shipment>
  offer: Offer
  listOffers: Array<Offer>
}

export type QueryGroupArgs = {
  id: Scalars['Int']
}

export type QueryShipmentArgs = {
  id: Scalars['Int']
}

export type QueryOfferArgs = {
  id: Scalars['Int']
}

export type QueryListOffersArgs = {
  shipmentId: Scalars['Int']
}

export type Mutation = {
  __typename?: 'Mutation'
  addGroup: Group
  updateGroup: Group
  addShipment: Shipment
  updateShipment: Shipment
  addOffer: Offer
  updateOffer: Offer
}

export type MutationAddGroupArgs = {
  input: GroupCreateInput
}

export type MutationUpdateGroupArgs = {
  id: Scalars['Int']
  input: GroupUpdateInput
}

export type MutationAddShipmentArgs = {
  input: ShipmentCreateInput
}

export type MutationUpdateShipmentArgs = {
  id: Scalars['Int']
  input: ShipmentUpdateInput
}

export type MutationAddOfferArgs = {
  input: OfferCreateInput
}

export type MutationUpdateOfferArgs = {
  input: OfferUpdateInput
}

export type ShipmentCreateInput = {
  shippingRoute: ShippingRoute
  labelYear: Scalars['Int']
  labelMonth: Scalars['Int']
  sendingHubId: Scalars['Int']
  receivingHubId: Scalars['Int']
  status: ShipmentStatus
}

export enum ShippingRoute {
  Uk = 'UK',
}

export enum ShipmentStatus {
  Announced = 'ANNOUNCED',
  Open = 'OPEN',
  Staging = 'STAGING',
  InProgress = 'IN_PROGRESS',
  Complete = 'COMPLETE',
  Abandoned = 'ABANDONED',
}

export type Shipment = {
  __typename?: 'Shipment'
  id: Scalars['Int']
  shippingRoute: ShippingRoute
  labelYear: Scalars['Int']
  labelMonth: Scalars['Int']
  offerSubmissionDeadline?: Maybe<Scalars['Date']>
  status: ShipmentStatus
  sendingHubId: Scalars['Int']
  sendingHub: Group
  receivingHubId: Scalars['Int']
  receivingHub: Group
  statusChangeTime: Scalars['Date']
  createdAt: Scalars['Date']
  updatedAt: Scalars['Date']
}

export enum GroupType {
  DaHub = 'DA_HUB',
  ReceivingGroup = 'RECEIVING_GROUP',
  SendingGroup = 'SENDING_GROUP',
}

export type UserProfile = {
  __typename?: 'UserProfile'
  id: Scalars['Int']
  isAdmin: Scalars['Boolean']
}

export enum OfferStatus {
  Draft = 'DRAFT',
  Proposed = 'PROPOSED',
  BeingReviewed = 'BEING_REVIEWED',
  Rejected = 'REJECTED',
  Accepted = 'ACCEPTED',
}

export type Offer = {
  __typename?: 'Offer'
  id: Scalars['Int']
  status: OfferStatus
  shipmentId: Scalars['Int']
  sendingGroupId: Scalars['Int']
  contact?: Maybe<ContactInfo>
  photoUris: Array<Scalars['String']>
  statusChangeTime: Scalars['Date']
  updatedAt: Scalars['Date']
  createdAt: Scalars['Date']
}

export type OfferCreateInput = {
  sendingGroupId: Scalars['Int']
  shipmentId: Scalars['Int']
  contact?: Maybe<ContactInfoInput>
  photoUris?: Maybe<Array<Scalars['String']>>
}

export type OfferUpdateInput = {
  id: Scalars['Int']
  status?: Maybe<OfferStatus>
  contact?: Maybe<ContactInfoInput>
  photoUris?: Maybe<Array<Scalars['String']>>
}

export enum PalletType {
  Standard = 'STANDARD',
  Euro = 'EURO',
  Custom = 'CUSTOM',
}

export enum PaymentStatus {
  WontPay = 'WONT_PAY',
  Uninitiated = 'UNINITIATED',
  Invoiced = 'INVOICED',
  Paid = 'PAID',
}

export type Pallet = {
  __typename?: 'Pallet'
  id: Scalars['Int']
  offerId: Scalars['Int']
  palletType: PalletType
  paymentStatus: PaymentStatus
  createdAt: Scalars['Date']
  updatedAt: Scalars['Date']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Date: ResolverTypeWrapper<Scalars['Date']>
  Location: ResolverTypeWrapper<Location>
  String: ResolverTypeWrapper<Scalars['String']>
  ContactInfo: ResolverTypeWrapper<ContactInfo>
  LocationInput: LocationInput
  ContactInfoInput: ContactInfoInput
  Group: ResolverTypeWrapper<Group>
  Int: ResolverTypeWrapper<Scalars['Int']>
  GroupCreateInput: GroupCreateInput
  GroupUpdateInput: GroupUpdateInput
  ShipmentUpdateInput: ShipmentUpdateInput
  Query: ResolverTypeWrapper<{}>
  Mutation: ResolverTypeWrapper<{}>
  ShipmentCreateInput: ShipmentCreateInput
  ShippingRoute: ShippingRoute
  ShipmentStatus: ShipmentStatus
  Shipment: ResolverTypeWrapper<Shipment>
  GroupType: GroupType
  UserProfile: ResolverTypeWrapper<UserProfile>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  OfferStatus: OfferStatus
  Offer: ResolverTypeWrapper<Offer>
  OfferCreateInput: OfferCreateInput
  OfferUpdateInput: OfferUpdateInput
  PalletType: PalletType
  PaymentStatus: PaymentStatus
  Pallet: ResolverTypeWrapper<Pallet>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Date: Scalars['Date']
  Location: Location
  String: Scalars['String']
  ContactInfo: ContactInfo
  LocationInput: LocationInput
  ContactInfoInput: ContactInfoInput
  Group: Group
  Int: Scalars['Int']
  GroupCreateInput: GroupCreateInput
  GroupUpdateInput: GroupUpdateInput
  ShipmentUpdateInput: ShipmentUpdateInput
  Query: {}
  Mutation: {}
  ShipmentCreateInput: ShipmentCreateInput
  Shipment: Shipment
  UserProfile: UserProfile
  Boolean: Scalars['Boolean']
  Offer: Offer
  OfferCreateInput: OfferCreateInput
  OfferUpdateInput: OfferUpdateInput
  Pallet: Pallet
}>

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type LocationResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']
> = ResolversObject<{
  countryCode?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  townCity?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  openLocationCode?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ContactInfoResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['ContactInfo'] = ResolversParentTypes['ContactInfo']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  signal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  whatsApp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type GroupResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  groupType?: Resolver<ResolversTypes['GroupType'], ParentType, ContextType>
  primaryLocation?: Resolver<
    ResolversTypes['Location'],
    ParentType,
    ContextType
  >
  primaryContact?: Resolver<
    ResolversTypes['ContactInfo'],
    ParentType,
    ContextType
  >
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  captainId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  group?: Resolver<
    ResolversTypes['Group'],
    ParentType,
    ContextType,
    RequireFields<QueryGroupArgs, 'id'>
  >
  listGroups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType>
  shipment?: Resolver<
    ResolversTypes['Shipment'],
    ParentType,
    ContextType,
    RequireFields<QueryShipmentArgs, 'id'>
  >
  listShipments?: Resolver<
    Array<ResolversTypes['Shipment']>,
    ParentType,
    ContextType
  >
  offer?: Resolver<
    ResolversTypes['Offer'],
    ParentType,
    ContextType,
    RequireFields<QueryOfferArgs, 'id'>
  >
  listOffers?: Resolver<
    Array<ResolversTypes['Offer']>,
    ParentType,
    ContextType,
    RequireFields<QueryListOffersArgs, 'shipmentId'>
  >
}>

export type MutationResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  addGroup?: Resolver<
    ResolversTypes['Group'],
    ParentType,
    ContextType,
    RequireFields<MutationAddGroupArgs, 'input'>
  >
  updateGroup?: Resolver<
    ResolversTypes['Group'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGroupArgs, 'id' | 'input'>
  >
  addShipment?: Resolver<
    ResolversTypes['Shipment'],
    ParentType,
    ContextType,
    RequireFields<MutationAddShipmentArgs, 'input'>
  >
  updateShipment?: Resolver<
    ResolversTypes['Shipment'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateShipmentArgs, 'id' | 'input'>
  >
  addOffer?: Resolver<
    ResolversTypes['Offer'],
    ParentType,
    ContextType,
    RequireFields<MutationAddOfferArgs, 'input'>
  >
  updateOffer?: Resolver<
    ResolversTypes['Offer'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOfferArgs, 'input'>
  >
}>

export type ShipmentResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['Shipment'] = ResolversParentTypes['Shipment']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  shippingRoute?: Resolver<
    ResolversTypes['ShippingRoute'],
    ParentType,
    ContextType
  >
  labelYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  labelMonth?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  offerSubmissionDeadline?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >
  status?: Resolver<ResolversTypes['ShipmentStatus'], ParentType, ContextType>
  sendingHubId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  sendingHub?: Resolver<ResolversTypes['Group'], ParentType, ContextType>
  receivingHubId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  receivingHub?: Resolver<ResolversTypes['Group'], ParentType, ContextType>
  statusChangeTime?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UserProfileResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type OfferResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['Offer'] = ResolversParentTypes['Offer']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  status?: Resolver<ResolversTypes['OfferStatus'], ParentType, ContextType>
  shipmentId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  sendingGroupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  contact?: Resolver<
    Maybe<ResolversTypes['ContactInfo']>,
    ParentType,
    ContextType
  >
  photoUris?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  statusChangeTime?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PalletResolvers<
  ContextType = AuthenticatedContext,
  ParentType extends ResolversParentTypes['Pallet'] = ResolversParentTypes['Pallet']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  offerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  palletType?: Resolver<ResolversTypes['PalletType'], ParentType, ContextType>
  paymentStatus?: Resolver<
    ResolversTypes['PaymentStatus'],
    ParentType,
    ContextType
  >
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = AuthenticatedContext> = ResolversObject<{
  Date?: GraphQLScalarType
  Location?: LocationResolvers<ContextType>
  ContactInfo?: ContactInfoResolvers<ContextType>
  Group?: GroupResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Shipment?: ShipmentResolvers<ContextType>
  UserProfile?: UserProfileResolvers<ContextType>
  Offer?: OfferResolvers<ContextType>
  Pallet?: PalletResolvers<ContextType>
}>

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<
  ContextType = AuthenticatedContext
> = Resolvers<ContextType>
