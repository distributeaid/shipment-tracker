import { test } from '@playwright/test'
import { promises as fs } from 'fs'
import { users } from '../../../users'
import { createGroupForUser } from './createGroupForUser'

test.use({
  storageState: users.userA.stateFile,
})

test('Onboarding: userA can create a group', async ({ page }) => {
  const user = JSON.parse(await fs.readFile(users.userA.infoFile, 'utf-8'))
  await createGroupForUser({ page })(user)
})
