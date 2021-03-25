import cx from 'classnames'
import { FunctionComponent, useMemo } from 'react'
import { Column, useSortBy, useTable } from 'react-table'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import TableHeader from '../../components/table/TableHeader'
import { OfferQuery } from '../../types/api-types'

interface Props {
  pallets: OfferQuery['offer']['pallets']
  initiateDeletePallet: (palletId: number) => void
}

const PalletsTable: FunctionComponent<Props> = ({
  pallets,
  initiateDeletePallet,
}) => {
  const COLUMNS: Column<OfferQuery['offer']['pallets'][0]>[] = useMemo(
    () => [
      {
        Header: 'Pallet ID',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value }) => <span className="font-mono">{value}</span>,
      },
      {
        Header: 'Type',
        accessor: 'palletType',
        Cell: ({ value }) => <Badge>{value}</Badge>,
      },
      {
        Header: 'Payment status',
        accessor: 'paymentStatus',
        Cell: ({ value }) => <Badge>{value}</Badge>,
      },
      {
        id: 'pallet_actions',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value }) => (
          <Button slim onClick={() => initiateDeletePallet(value)}>
            Delete
          </Button>
        ),
      },
    ],
    [initiateDeletePallet],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: COLUMNS, data: pallets }, useSortBy)

  return (
    <table className="w-full border border-gray-200" {...getTableProps()}>
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
                    'w-0': cell.column.id === 'pallet_actions',
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
  )
}

export default PalletsTable
