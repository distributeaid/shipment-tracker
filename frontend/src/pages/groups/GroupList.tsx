import { FunctionComponent, useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import cx from 'classnames'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import groupsFixture from '../../fixtures/groups'
import { formatGroupType } from '../../utils/format'

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Location',
    accessor: 'location',
  },
  {
    Header: 'Type',
    accessor: 'groupType',
  },
  {
    Header: 'Contact',
    accessor: 'contact',
    disableSortBy: true,
  },
]

const GroupList: FunctionComponent = () => {
  const tableData = useMemo(
    () =>
      groupsFixture.map((group) => ({
        name: group.name,
        location: `${group.primaryLocation.townCity} (${group.primaryLocation.countryCode})`,
        groupType: formatGroupType(group.groupType),
        contact: group.primaryContactName,
      })),
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: COLUMNS as any, data: tableData }, useSortBy)

  return (
    <LayoutWithNav headerTitle="Groups">
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-screen">
        <header className="p-6 border-b border-gray-200">
          <h1 className="text-da-blue-900 text-3xl">Groups</h1>
        </header>
        <main>
          <table className="w-full" {...getTableProps()}>
            <thead className="border-b border-gray-200">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={cx(
                        'p-2 first:pl-6 last:pr-6 bg-gray-50 text-gray-700 text-left font-semibold',
                        {
                          'hover:bg-gray-100': column.canSort,
                          'bg-gray-100': column.isSorted,
                        },
                      )}
                      title={column.canSort ? 'Sort rows' : ''}
                    >
                      {column.render('Header')}
                      <span className="ml-2 text-gray-500">
                        {column.isSorted
                          ? column.isSortedDesc
                            ? '↓'
                            : '↑'
                          : ''}
                      </span>
                    </th>
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
                          'font-semibold': cell.column.Header === 'Name',
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

export default GroupList
