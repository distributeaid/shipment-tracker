import { expect, test } from '@playwright/test'
import { readFile } from 'fs/promises'
import path from 'path'
import { users } from '../../../../users'
import { userGroupName } from '../../onboarding/createGroupForUser'
import { createOffer } from './createOffer'

test.use({
  storageState: users.userC.stateFile,
})

test('Users can create an offer with a pallet that is contained multiple times', async ({
  page,
}) => {
  const { sendingHub } = JSON.parse(
    await readFile(
      path.join(process.cwd(), 'test-session', 'shipment.json'),
      'utf-8',
    ),
  )
  const user = JSON.parse(await readFile(users.userC.infoFile, 'utf-8'))

  await createOffer({
    page,
    sendingHub,
    onPalletCreated: async () => {
      await page.locator('input[name="palletCount"]').fill('3')
      await page.locator('text=Save pallet').click()
    },
  })

  // Verify
  // Find shipment
  await page.locator('header a:has-text("Shipments")').nth(1).click()
  await page
    .locator(`main table tbody td:has-text("${sendingHub}")`)
    .locator(`xpath=ancestor::tr`)
    .locator('a')
    .click()
  // Find offer and verify pallet count
  await page.locator('text=Offers').first().click()
  await expect(
    page
      .locator(`main table tbody td:has-text("${userGroupName(user)}")`)
      .locator(`xpath=ancestor::tr`)
      .locator(`td:nth-child(4)`),
  ).toContainText('3')
})
