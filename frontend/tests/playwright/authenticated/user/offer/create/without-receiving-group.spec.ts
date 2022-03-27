import { test } from '@playwright/test'
import { readFile } from 'fs/promises'
import path from 'path'
import { users } from '../../../../users'
import { createOffer } from './createOffer'

test.use({
  storageState: users.userB.stateFile,
})

test('Users can create an offer without a receiving group', async ({
  page,
}) => {
  const { sendingHub } = JSON.parse(
    await readFile(
      path.join(process.cwd(), 'test-session', 'shipment.json'),
      'utf-8',
    ),
  )
  await createOffer({ page, sendingHub })
})
