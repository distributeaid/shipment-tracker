import { test } from '@playwright/test'
import { promises as fs } from 'fs'
import { baseUrl } from '../../../../baseUrl'
import { users } from '../../../../users'
import { createOffer } from './createOffer'

test.use({
  storageState: users.userA.stateFile,
})

test('Users can create an offer with a receiving group', async ({ page }) => {
  await page.goto(`${baseUrl}/`)

  const { name: userBName } = JSON.parse(
    await fs.readFile(users.userB.infoFile, 'utf-8'),
  )

  const receivingGroup = `${userBName}'s group`

  await createOffer({ page, receivingGroup })
})
