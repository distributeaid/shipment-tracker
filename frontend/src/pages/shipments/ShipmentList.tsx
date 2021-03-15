import cx from 'classnames'
import { FunctionComponent, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Column, useSortBy, useTable } from 'react-table'
import Badge from '../../components/Badge'
import TableHeader from '../../components/table/TableHeader'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { AllShipmentsQuery, useAllShipmentsQuery } from '../../types/api-types'
import {
  formatLabelMonth,
  formatShipmentName,
  getShipmentStatusBadgeColor,
} from '../../utils/format'
import { shipmentEditRoute } from '../../utils/routes'

const COLUMNS: Column<AllShipmentsQuery['listShipments'][0]>[] = [
  {
    Header: 'Name',
    accessor: (row) => formatShipmentName(row),
  },
  {
    Header: 'Route',
    accessor: 'shippingRoute',
  },
  {
    Header: 'Sending hub',
    accessor: (row) => row.sendingHub.name,
  },
  {
    Header: 'Receiving hub',
    accessor: (row) => row.receivingHub.name,
  },
  {
    Header: 'Date',
    accessor: (row) => `${formatLabelMonth(row.labelMonth)} ${row.labelYear}`,
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
  const { data } = useAllShipmentsQuery()

  // We must memoize the data for react-table to function properly
  const shipments = useMemo(() => data?.listShipments || [], [data])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: COLUMNS, data: shipments }, useSortBy)

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-navy-800 text-3xl">Shipments</h1>
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
                          'font-semibold text-navy-700 hover:underline':
                            cell.column.Header === 'Name',
                          'bg-gray-50': cell.column.isSorted,
                        })}
                      >
                        {cell.column.Header === 'Name' ? (
                          <Link to={shipmentEditRoute(row.original.id)}>
                            {cell.render('Cell')}
                          </Link>
                        ) : (
                          cell.render('Cell')
                        )}
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
