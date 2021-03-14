/**
 * ⚠️ These type definitions are generated automatically by graphql-codegen.
 * The generation is configurated in codegen.yaml. Visit the docs for more information:
 * https://graphql-code-generator.com/docs/getting-started/index
 */

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
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
  listGroups: Array<Group>
  listShipments: Array<Shipment>
  group: Group
  shipment: Shipment
}

export type QueryGroupArgs = {
  id: Scalars['Int']
}

export type QueryShipmentArgs = {
  id: Scalars['Int']
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
