import { gql, useQuery } from '@apollo/client'
import cx from 'classnames'
import { FunctionComponent, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSortBy, useTable } from 'react-table'
import ButtonLink from '../../components/ButtonLink'
import TableHeader from '../../components/table/TableHeader'
import LayoutWithNav from '../../layouts/LayoutWithNav'
import { Group } from '../../types/api-types'
import { formatGroupType } from '../../utils/format'
import ROUTES, { groupEditRoute } from '../../utils/routes'

const GROUPS_QUERY = gql`
  query GetAllGroups {
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

const COLUMNS = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Location',
    accessor: (group: Group) =>
      `${group.primaryLocation.townCity} (${group.primaryLocation.countryCode})`,
  },
  {
    Header: 'Type',
    accessor: (group: Group) => formatGroupType(group.groupType),
  },
  {
    Header: 'Contact',
    accessor: 'primaryContact.name',
    disableSortBy: true,
  },
]

/**
 * Display a list of all the groups in the database
 */
const GroupList: FunctionComponent = () => {
  const { data } = useQuery<{ listGroups: Group[] }>(GROUPS_QUERY)

  // We must memoize the data for react-table to function properly
  const groups = useMemo(() => data?.listGroups || [], [data])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: COLUMNS as any, data: groups }, useSortBy)

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-navy-800 text-3xl">Groups</h1>
          <ButtonLink to={ROUTES.GROUP_CREATE}>Create a group</ButtonLink>
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
                          <Link to={groupEditRoute(row.original.id)}>
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

export default GroupList
