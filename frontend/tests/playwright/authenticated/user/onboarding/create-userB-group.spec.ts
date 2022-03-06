import { test } from '@playwright/test'
import { promises as fs } from 'fs'
import { users } from '../../../users'
import { createGroupForUser } from './createGroupForUser'

test.use({
  storageState: users.userB.stateFile,
})

test('Onboarding: userB can create a group', async ({ page }) => {
  const user = JSON.parse(await fs.readFile(users.userB.infoFile, 'utf-8'))
  await createGroupForUser({ page })(user)
})
