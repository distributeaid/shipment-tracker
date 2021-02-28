import { FunctionComponent, useMemo } from 'react'
import { useSortBy, useTable } from 'react-table'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import groupsFixture from '../../fixtures/groups'

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
]

const GroupList: FunctionComponent = () => {
  const tableData = useMemo(
    () =>
      groupsFixture.map((group) => ({
        name: group.name,
        location: `${group.primaryLocation.townCity} (${group.primaryLocation.countryCode})`,
        groupType: group.groupType,
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
                      {...column.getHeaderProps(
                        (column as any).getSortByToggleProps(),
                      )}
                      className="p-2 bg-gray-50 text-left font-semibold"
                      title="Sort rows"
                    >
                      {column.render('Header')}
                      <span className="ml-2 text-gray-700">
                        {(column as any).isSorted
                          ? (column as any).isSortedDesc
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
                      <td {...cell.getCellProps()} className="p-2">
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
