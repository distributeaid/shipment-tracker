import { test } from '@playwright/test'
import { baseUrl } from '../../../../baseUrl'
import { users } from '../../../../users'
import { createOffer } from './createOffer'

test.use({
  storageState: users.userB.stateFile,
})

test('Users can create an offer without a receiving group', async ({
  page,
}) => {
  await page.goto(`${baseUrl}/`)
  await createOffer({ page })
})
