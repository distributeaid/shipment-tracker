import { test } from '@playwright/test'
import { promises as fs } from 'fs'
import path from 'path'
import { users } from '../../../../users'
import { createOffer } from './createOffer'

test.use({
  storageState: users.userA.stateFile,
})

test('Users can create an offer with a receiving group', async ({ page }) => {
  const { name: userBName } = JSON.parse(
    await fs.readFile(users.userB.infoFile, 'utf-8'),
  )

  const receivingGroup = `${userBName}'s group`

  const { sendingHub } = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), 'test-session', 'shipment.json'),
      'utf-8',
    ),
  )

  await createOffer({ page, receivingGroup, sendingHub })
})
