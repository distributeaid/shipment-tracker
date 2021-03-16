/**
 * ⚠️ These type definitions are generated automatically by graphql-codegen.
 * The generation is configurated in codegen.yaml. Visit the docs for more information:
 * https://graphql-code-generator.com/docs/getting-started/index
 */

import * as Apollo from '@apollo/client'
import { gql } from '@apollo/client'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {}
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
  addPallet: Pallet
  updatePallet: Pallet
  destroyPallet: Offer
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

export type MutationAddPalletArgs = {
  input: PalletCreateInput
}

export type MutationUpdatePalletArgs = {
  id: Scalars['Int']
  input: PalletUpdateInput
}

export type MutationDestroyPalletArgs = {
  id: Scalars['Int']
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
  pallets: Array<Pallet>
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
  paymentStatusChangeTime: Scalars['Date']
  createdAt: Scalars['Date']
  updatedAt: Scalars['Date']
}

export type PalletCreateInput = {
  offerId: Scalars['Int']
  palletType: PalletType
}

export type PalletUpdateInput = {
  paymentStatus?: Maybe<PaymentStatus>
  palletType?: Maybe<PalletType>
}

export enum LineItemStatus {
  Proposed = 'PROPOSED',
  AwaitingApproval = 'AWAITING_APPROVAL',
  Accepted = 'ACCEPTED',
  NotAccepted = 'NOT_ACCEPTED',
}

export enum LineItemCategory {
  Unset = 'UNSET',
}

export enum DangerousGoods {
  Flammable = 'FLAMMABLE',
  Explosive = 'EXPLOSIVE',
  Medicine = 'MEDICINE',
  Batteries = 'BATTERIES',
  Liquids = 'LIQUIDS',
  Other = 'OTHER',
}

export enum LineItemContainerType {
  Unset = 'UNSET',
  BulkBag = 'BULK_BAG',
  Box = 'BOX',
  FullPallet = 'FULL_PALLET',
}

export type LineItem = {
  __typename?: 'LineItem'
  id: Scalars['Int']
  offerPalletId: Scalars['Int']
  status: LineItemStatus
  proposedReceivingGroupId?: Maybe<Scalars['Int']>
  proposedReceivingGroup?: Maybe<Group>
  acceptedReceivingGroupId?: Maybe<Scalars['Int']>
  acceptedReceivingGroup?: Maybe<Group>
  containerType: LineItemContainerType
  category: LineItemCategory
  description: Scalars['String']
  itemCount: Scalars['Int']
  boxCount?: Maybe<Scalars['Int']>
  boxWeightKg?: Maybe<Scalars['Float']>
  lengthCm?: Maybe<Scalars['Float']>
  widthCm?: Maybe<Scalars['Float']>
  heightCm?: Maybe<Scalars['Float']>
  affirmLiability: Scalars['Boolean']
  tosAccepted: Scalars['Boolean']
  dangerousGoods: Array<DangerousGoods>
  photoUris: Array<Scalars['String']>
  sendingHubDeliveryDate: Scalars['Date']
  statusChangeTime: Scalars['Date']
  createdAt: Scalars['Date']
  updatedAt: Scalars['Date']
}

export type CreateGroupMutationVariables = Exact<{
  input: GroupCreateInput
}>

export type CreateGroupMutation = { __typename?: 'Mutation' } & {
  addGroup: { __typename?: 'Group' } & Pick<Group, 'id'>
}

export type AllGroupFieldsFragment = { __typename?: 'Group' } & Pick<
  Group,
  'id' | 'name' | 'groupType'
> & {
    primaryLocation: { __typename?: 'Location' } & Pick<
      Location,
      'townCity' | 'countryCode' | 'openLocationCode'
    >
    primaryContact: { __typename?: 'ContactInfo' } & Pick<
      ContactInfo,
      'name' | 'email' | 'whatsApp' | 'phone' | 'signal'
    >
  }

export type AllGroupsQueryVariables = Exact<{ [key: string]: never }>

export type AllGroupsQuery = { __typename?: 'Query' } & {
  listGroups: Array<
    { __typename?: 'Group' } & Pick<Group, 'id' | 'name' | 'groupType'> & {
        primaryContact: { __typename?: 'ContactInfo' } & Pick<
          ContactInfo,
          'name'
        >
        primaryLocation: { __typename?: 'Location' } & Pick<
          Location,
          'countryCode' | 'townCity'
        >
      }
  >
}

export type AllGroupsMinimalQueryVariables = Exact<{ [key: string]: never }>

export type AllGroupsMinimalQuery = { __typename?: 'Query' } & {
  listGroups: Array<
    { __typename?: 'Group' } & Pick<Group, 'id' | 'name' | 'groupType'>
  >
}

export type GroupQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type GroupQuery = { __typename?: 'Query' } & {
  group: { __typename?: 'Group' } & AllGroupFieldsFragment
}

export type AllShipmentFieldsFragment = { __typename?: 'Shipment' } & Pick<
  Shipment,
  | 'id'
  | 'shippingRoute'
  | 'labelYear'
  | 'labelMonth'
  | 'offerSubmissionDeadline'
  | 'status'
>

export type AllShipmentsQueryVariables = Exact<{ [key: string]: never }>

export type AllShipmentsQuery = { __typename?: 'Query' } & {
  listShipments: Array<
    { __typename?: 'Shipment' } & Pick<
      Shipment,
      | 'id'
      | 'shippingRoute'
      | 'labelYear'
      | 'labelMonth'
      | 'offerSubmissionDeadline'
      | 'status'
      | 'statusChangeTime'
    > & {
        sendingHub: { __typename?: 'Group' } & Pick<Group, 'id' | 'name'>
        receivingHub: { __typename?: 'Group' } & Pick<Group, 'id' | 'name'>
      }
  >
}

export type ShipmentQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type ShipmentQuery = { __typename?: 'Query' } & {
  shipment: { __typename?: 'Shipment' } & AllShipmentFieldsFragment
}

export type UpdateShipmentMutationVariables = Exact<{
  id: Scalars['Int']
  input: ShipmentUpdateInput
}>

export type UpdateShipmentMutation = { __typename?: 'Mutation' } & {
  updateShipment: { __typename?: 'Shipment' } & AllShipmentFieldsFragment
}

export const AllGroupFieldsFragmentDoc = gql`
  fragment AllGroupFields on Group {
    id
    name
    groupType
    primaryLocation {
      townCity
      countryCode
      openLocationCode
    }
    primaryContact {
      name
      email
      whatsApp
      phone
      signal
    }
  }
`
export const AllShipmentFieldsFragmentDoc = gql`
  fragment AllShipmentFields on Shipment {
    id
    shippingRoute
    labelYear
    labelMonth
    offerSubmissionDeadline
    status
  }
`
export const CreateGroupDocument = gql`
  mutation CreateGroup($input: GroupCreateInput!) {
    addGroup(input: $input) {
      id
    }
  }
`
export type CreateGroupMutationFn = Apollo.MutationFunction<
  CreateGroupMutation,
  CreateGroupMutationVariables
>

/**
 * __useCreateGroupMutation__
 *
 * To run a mutation, you first call `useCreateGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGroupMutation, { data, loading, error }] = useCreateGroupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGroupMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateGroupMutation,
    CreateGroupMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(
    CreateGroupDocument,
    options,
  )
}
export type CreateGroupMutationHookResult = ReturnType<
  typeof useCreateGroupMutation
>
export type CreateGroupMutationResult = Apollo.MutationResult<CreateGroupMutation>
export type CreateGroupMutationOptions = Apollo.BaseMutationOptions<
  CreateGroupMutation,
  CreateGroupMutationVariables
>
export const AllGroupsDocument = gql`
  query AllGroups {
    listGroups {
      id
      name
      groupType
      primaryContact {
        name
      }
      primaryLocation {
        countryCode
        townCity
      }
    }
  }
`

/**
 * __useAllGroupsQuery__
 *
 * To run a query within a React component, call `useAllGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllGroupsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AllGroupsQuery,
    AllGroupsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AllGroupsQuery, AllGroupsQueryVariables>(
    AllGroupsDocument,
    options,
  )
}
export function useAllGroupsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AllGroupsQuery,
    AllGroupsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AllGroupsQuery, AllGroupsQueryVariables>(
    AllGroupsDocument,
    options,
  )
}
export type AllGroupsQueryHookResult = ReturnType<typeof useAllGroupsQuery>
export type AllGroupsLazyQueryHookResult = ReturnType<
  typeof useAllGroupsLazyQuery
>
export type AllGroupsQueryResult = Apollo.QueryResult<
  AllGroupsQuery,
  AllGroupsQueryVariables
>
export const AllGroupsMinimalDocument = gql`
  query AllGroupsMinimal {
    listGroups {
      id
      name
      groupType
    }
  }
`

/**
 * __useAllGroupsMinimalQuery__
 *
 * To run a query within a React component, call `useAllGroupsMinimalQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllGroupsMinimalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllGroupsMinimalQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllGroupsMinimalQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AllGroupsMinimalQuery,
    AllGroupsMinimalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AllGroupsMinimalQuery, AllGroupsMinimalQueryVariables>(
    AllGroupsMinimalDocument,
    options,
  )
}
export function useAllGroupsMinimalLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AllGroupsMinimalQuery,
    AllGroupsMinimalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<
    AllGroupsMinimalQuery,
    AllGroupsMinimalQueryVariables
  >(AllGroupsMinimalDocument, options)
}
export type AllGroupsMinimalQueryHookResult = ReturnType<
  typeof useAllGroupsMinimalQuery
>
export type AllGroupsMinimalLazyQueryHookResult = ReturnType<
  typeof useAllGroupsMinimalLazyQuery
>
export type AllGroupsMinimalQueryResult = Apollo.QueryResult<
  AllGroupsMinimalQuery,
  AllGroupsMinimalQueryVariables
>
export const GroupDocument = gql`
  query Group($id: Int!) {
    group(id: $id) {
      ...AllGroupFields
    }
  }
  ${AllGroupFieldsFragmentDoc}
`

/**
 * __useGroupQuery__
 *
 * To run a query within a React component, call `useGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGroupQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGroupQuery(
  baseOptions: Apollo.QueryHookOptions<GroupQuery, GroupQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GroupQuery, GroupQueryVariables>(
    GroupDocument,
    options,
  )
}
export function useGroupLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GroupQuery, GroupQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GroupQuery, GroupQueryVariables>(
    GroupDocument,
    options,
  )
}
export type GroupQueryHookResult = ReturnType<typeof useGroupQuery>
export type GroupLazyQueryHookResult = ReturnType<typeof useGroupLazyQuery>
export type GroupQueryResult = Apollo.QueryResult<
  GroupQuery,
  GroupQueryVariables
>
export const AllShipmentsDocument = gql`
  query AllShipments {
    listShipments {
      id
      shippingRoute
      labelYear
      labelMonth
      offerSubmissionDeadline
      status
      sendingHub {
        id
        name
      }
      receivingHub {
        id
        name
      }
      statusChangeTime
    }
  }
`

/**
 * __useAllShipmentsQuery__
 *
 * To run a query within a React component, call `useAllShipmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllShipmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllShipmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllShipmentsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    AllShipmentsQuery,
    AllShipmentsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<AllShipmentsQuery, AllShipmentsQueryVariables>(
    AllShipmentsDocument,
    options,
  )
}
export function useAllShipmentsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    AllShipmentsQuery,
    AllShipmentsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<AllShipmentsQuery, AllShipmentsQueryVariables>(
    AllShipmentsDocument,
    options,
  )
}
export type AllShipmentsQueryHookResult = ReturnType<
  typeof useAllShipmentsQuery
>
export type AllShipmentsLazyQueryHookResult = ReturnType<
  typeof useAllShipmentsLazyQuery
>
export type AllShipmentsQueryResult = Apollo.QueryResult<
  AllShipmentsQuery,
  AllShipmentsQueryVariables
>
export const ShipmentDocument = gql`
  query Shipment($id: Int!) {
    shipment(id: $id) {
      ...AllShipmentFields
    }
  }
  ${AllShipmentFieldsFragmentDoc}
`

/**
 * __useShipmentQuery__
 *
 * To run a query within a React component, call `useShipmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useShipmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShipmentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useShipmentQuery(
  baseOptions: Apollo.QueryHookOptions<ShipmentQuery, ShipmentQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ShipmentQuery, ShipmentQueryVariables>(
    ShipmentDocument,
    options,
  )
}
export function useShipmentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ShipmentQuery,
    ShipmentQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ShipmentQuery, ShipmentQueryVariables>(
    ShipmentDocument,
    options,
  )
}
export type ShipmentQueryHookResult = ReturnType<typeof useShipmentQuery>
export type ShipmentLazyQueryHookResult = ReturnType<
  typeof useShipmentLazyQuery
>
export type ShipmentQueryResult = Apollo.QueryResult<
  ShipmentQuery,
  ShipmentQueryVariables
>
export const UpdateShipmentDocument = gql`
  mutation UpdateShipment($id: Int!, $input: ShipmentUpdateInput!) {
    updateShipment(id: $id, input: $input) {
      ...AllShipmentFields
    }
  }
  ${AllShipmentFieldsFragmentDoc}
`
export type UpdateShipmentMutationFn = Apollo.MutationFunction<
  UpdateShipmentMutation,
  UpdateShipmentMutationVariables
>

/**
 * __useUpdateShipmentMutation__
 *
 * To run a mutation, you first call `useUpdateShipmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShipmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShipmentMutation, { data, loading, error }] = useUpdateShipmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateShipmentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateShipmentMutation,
    UpdateShipmentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    UpdateShipmentMutation,
    UpdateShipmentMutationVariables
  >(UpdateShipmentDocument, options)
}
export type UpdateShipmentMutationHookResult = ReturnType<
  typeof useUpdateShipmentMutation
>
export type UpdateShipmentMutationResult = Apollo.MutationResult<UpdateShipmentMutation>
export type UpdateShipmentMutationOptions = Apollo.BaseMutationOptions<
  UpdateShipmentMutation,
  UpdateShipmentMutationVariables
>
