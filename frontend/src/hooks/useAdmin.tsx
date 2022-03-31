import { headers, SERVER_URL, throwOnProblem } from './useAuth'

export type User = {
  id: number
  email: string
  name: string
  isAdmin: boolean
  isConfirmed: boolean
}

const listUsers = (): Promise<User[]> =>
  fetch(`${SERVER_URL}/users`, {
    credentials: 'include',
  })
    .then(throwOnProblem(`Fetching users failed!`))
    .then((response) => response.json() as Promise<User[]>)

const updateUser = ({
  id,
  ...update
}: {
  id: number
  email?: string
  isConfirmed?: boolean
  isAdmin?: boolean
  name?: boolean
}) =>
  fetch(`${SERVER_URL}/user/${id}`, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      ...headers,
    },
    body: JSON.stringify(update),
  }).then(throwOnProblem(`Updating user failed!`))

export const useAdmin = () => {
  return {
    listUsers,
    updateUser,
  }
}
