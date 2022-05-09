import cx from 'classnames'
import { FunctionComponent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Column, useSortBy, useTable } from 'react-table'
import Badge from '../../components/Badge'
import ButtonLink from '../../components/ButtonLink'
import DropdownMenu from '../../components/DropdownMenu'
import CheckboxField from '../../components/forms/CheckboxField'
import Spinner from '../../components/Spinner'
import TableHeader from '../../components/table/TableHeader'
import { SHIPMENT_STATUS_OPTIONS } from '../../data/constants'
import { useAuth } from '../../hooks/useAuth'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import {
  AllShipmentsQuery,
  ShipmentStatus,
  useAllShipmentsQuery,
} from '../../types/api-types'
import {
  formatLabelMonth,
  formatListOfHubs,
  formatRegion,
  formatShipmentName,
  formatShipmentStatus,
  getShipmentStatusBadgeColor,
} from '../../utils/format'
import ROUTES, { shipmentViewRoute } from '../../utils/routes'

const COLUMNS: Column<AllShipmentsQuery['listShipments'][0]>[] = [
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }: any) => (
      <Badge color={getShipmentStatusBadgeColor(value)}>
        {formatShipmentStatus(value)}
      </Badge>
    ),
  },
  {
    Header: 'Name',
    accessor: (row) => formatShipmentName(row),
  },
  {
    Header: 'Origin',
    accessor: (row) => formatRegion(row.origin),
  },
  {
    Header: 'Destination',
    accessor: (row) => formatRegion(row.destination),
  },
  {
    Header: 'Sending hubs',
    accessor: (row) => formatListOfHubs(row.sendingHubs),
  },
  {
    Header: 'Receiving hubs',
    accessor: (row) => formatListOfHubs(row.receivingHubs),
  },
  {
    Header: 'Date',
    // TODO this accessor won't sort properly
    accessor: (row) => `${formatLabelMonth(row.labelMonth)} ${row.labelYear}`,
  },
]

// Group captains can only see a subset of shipment statuses
const NON_ADMIN_STATUSES = [
  ShipmentStatus.Open,
  ShipmentStatus.Staging,
  ShipmentStatus.Announced,
]

const getShipmentStatusOptions = (isAdmin = false) => {
  if (isAdmin) {
    return [...SHIPMENT_STATUS_OPTIONS]
  } else {
    return SHIPMENT_STATUS_OPTIONS.filter((status) =>
      NON_ADMIN_STATUSES.includes(status.value),
    )
  }
}

const ShipmentList: FunctionComponent = () => {
  const { me: profile } = useAuth()

  const [shipmentStatuses, setShipmentStatuses] = useState(
    profile?.isAdmin
      ? [
          ShipmentStatus.Draft,
          ShipmentStatus.Open,
          ShipmentStatus.Staging,
          ShipmentStatus.AidMatching,
          ShipmentStatus.Announced,
          ShipmentStatus.InProgress,
        ]
      : [...NON_ADMIN_STATUSES],
  )

  // This query runs every time the shipment status list is updated
  const { data, error, loading } = useAllShipmentsQuery({
    variables: { status: shipmentStatuses },
  })

  const toggleShipmentStatus = (shipmentStatus: ShipmentStatus) => {
    if (shipmentStatuses.includes(shipmentStatus)) {
      setShipmentStatuses(shipmentStatuses.filter((s) => s !== shipmentStatus))
    } else {
      setShipmentStatuses([...shipmentStatuses, shipmentStatus])
    }
  }

  // We must memoize the data for react-table to function properly
  const shipments = useMemo(() => data?.listShipments || [], [data])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: COLUMNS, data: shipments }, useSortBy)

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto bg-white border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200">
          <div className="md:flex items-center justify-between">
            <h1 className="text-navy-800 text-3xl mb-4 md:mb-0">Shipments</h1>
            {profile?.isAdmin && (
              <ButtonLink to={ROUTES.SHIPMENT_CREATE}>
                Create shipment
              </ButtonLink>
            )}
          </div>
          <div className="mt-4">
            <DropdownMenu label="Shipment status" position="right">
              {getShipmentStatusOptions(profile?.isAdmin).map((status) => (
                <DropdownMenu.Text key={status.value}>
                  <CheckboxField
                    label={status.label}
                    checked={shipmentStatuses.includes(status.value)}
                    onChange={() => toggleShipmentStatus(status.value)}
                  />
                </DropdownMenu.Text>
              ))}
            </DropdownMenu>
          </div>
        </header>
        <main className="pb-20 overflow-x-auto min-h-half-screen">
          {error && (
            <div className="p-4 rounded bg-red-50 mb-6 text-red-800">
              <p className="font-semibold">Error:</p>
              <p>{error.message}</p>
            </div>
          )}
          <table className="w-full whitespace-nowrap" {...getTableProps()}>
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
                          <Link to={shipmentViewRoute(row.original.id)}>
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
          {loading && (
            <div className="h-36 flex items-center justify-center">
              <Spinner />
            </div>
          )}
          {!loading && shipments.length === 0 && (
            <div className="bg-gray-50 text-gray-600 py-8 px-4 text-center">
              There are no shipments to display
            </div>
          )}
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default ShipmentList
