import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import Button from '../../components/Button'
import StarIcon from '../../components/icons/StarIcon'
import { useAdmin, User } from '../../hooks/useAdmin'
import LayoutWithNav from '../../layouts/LayoutWithNav'

const AdminUsers: FunctionComponent = () => {
  const { listUsers, updateUser } = useAdmin()
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = useCallback(() => {
    listUsers()
      .then((users) => {
        setUsers(users)
      })
      .catch(console.error)
  }, [listUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <LayoutWithNav>
      <div className="max-w-5xl mx-auto bg-white border-l border-r border-gray-200 min-h-content">
        <header className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-navy-800 text-3xl">Users</h1>
        </header>
        <main className="overflow-x-auto pb-8">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users
                .sort(({ id: a }, { id: b }) => a - b)
                .sort(
                  ({ isAdmin: a }, { isAdmin: b }) => (a ? 0 : 1) - (b ? 0 : 1),
                )
                .map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.isAdmin ? (
                        <abbr title="Admin">
                          <StarIcon />
                        </abbr>
                      ) : (
                        ''
                      )}
                    </td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <th>
                      {user.isConfirmed ? (
                        <Button
                          type="button"
                          onClick={() => {
                            updateUser({
                              id: user.id,
                              isConfirmed: false,
                            }).then(() => fetchUsers())
                          }}
                          variant={'danger'}
                        >
                          deactivate
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => {
                            updateUser({ id: user.id, isConfirmed: true }).then(
                              () => fetchUsers(),
                            )
                          }}
                          variant={'primary'}
                        >
                          activate
                        </Button>
                      )}
                      {user.isAdmin ? (
                        <Button
                          type="button"
                          onClick={() => {
                            updateUser({
                              id: user.id,
                              isAdmin: false,
                            }).then(() => fetchUsers())
                          }}
                          variant={'danger'}
                        >
                          revoke admin privileges
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => {
                            updateUser({ id: user.id, isAdmin: true }).then(
                              () => fetchUsers(),
                            )
                          }}
                          variant={'danger'}
                        >
                          make admin
                        </Button>
                      )}
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
        </main>
      </div>
    </LayoutWithNav>
  )
}

export default AdminUsers
