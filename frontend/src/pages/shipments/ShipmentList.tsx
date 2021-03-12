import { gql, useQuery } from '@apollo/client'
import cx from 'classnames'
import React, { FunctionComponent, useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import Badge from '../../components/Badge'
import TableHeader from '../../components/table/TableHeader'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { Shipment } from '../../types/api-types'
import {
  formatLabelMonth,
  getShipmentStatusBadgeColor,
} from '../../utils/format'

const SHIPMENTS_QUERY = gql`
  query GetAllShipments {
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

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Route',
    accessor: 'shippingRoute',
  },
  {
    Header: 'Sending hub',
    accessor: 'sendingHub.name',
  },
  {
    Header: 'Receiving hub',
    accessor: 'receivingHub.name',
  },
  {
    Header: 'Date',
    accessor: (row: Shipment) =>
      `${formatLabelMonth(row.labelMonth)} ${row.labelYear}`,
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }: any) => (
      <Badge color={getShipmentStatusBadgeColor(value)}>{value}</Badge>
    ),
  },
]

const ShipmentList: FunctionComponent = () => {
  const { data } = useQuery<{ listShipments: Shipment[] }>(SHIPMENTS_QUERY)

  // We must memoize the data for react-table to function properly
  const shipments = useMemo(() => data?.listShipments || [], [data])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: COLUMNS as any, data: shipments }, useSortBy)

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-da-navy-100 text-3xl">Shipments</h1>
        </header>
        <main>
          <table className="w-full" {...getTableProps()}>
            <thead className="border-b border-gray-200">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <TableHeader
                      canSort={column.canSort}
                      isSorted={column.isSorted}
                      isSortedDesc={column.isSortedDesc}
                      title={column.canSort ? 'Sort rows' : ''}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                    </TableHeader>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <tr
                    {...row.getRowProps()}
                    className="border-b border-gray-200 px-4"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className={cx('p-2 first:pl-6 last:pr-6', {
                          'bg-gray-50': cell.column.isSorted,
                        })}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentList
