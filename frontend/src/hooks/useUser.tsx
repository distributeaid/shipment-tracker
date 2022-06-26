import { headers, SERVER_URL, throwOnProblem } from './useAuth'

const updateTermsAndConditions = ({
  id,
  termsAndConditionsAcceptedAt,
}: {
  id: number
  termsAndConditionsAcceptedAt: Date
}) =>
  fetch(`${SERVER_URL}/user/termsandcond/${id}`, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      ...headers,
    },
    body: JSON.stringify(termsAndConditionsAcceptedAt),
  }).then(throwOnProblem(`Updating terms and conditions failed!`))

export const useUser = () => {
  return {
    updateTermsAndConditions,
  }
}
