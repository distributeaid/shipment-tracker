import { expect, test } from '@playwright/test'
import { promises as fs } from 'fs'
import path from 'path'
import { baseUrl } from '../../../baseUrl'
import { users } from '../../../users'

test.use({
  storageState: users.userA.stateFile,
})

test('Users can create an offer', async ({ page }) => {
  await page.goto(`${baseUrl}/`)

  const { sendingHub, receivingHub } = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), 'test-session', 'shipment.json'),
      'utf-8',
    ),
  )
  const { name: userBName } = JSON.parse(
    await fs.readFile(users.userB.infoFile, 'utf-8'),
  )

  // Create the offer
  await page.locator('header a:has-text("Shipments")').nth(1).click()
  await page
    .locator(`main table tbody td:has-text("${sendingHub}")`)
    .locator(`xpath=ancestor::tr`)
    .locator('a')
    .click()

  await page.locator('text=Offers').first().click()
  await page.locator('text=Create offer').click()
  await page.locator('text=Create offer').click()
  await page.locator('text=Add a pallet').click()
  await page.locator('text=Create pallet').click()
  await page.locator('text=Add items').click()
  await page
    .locator('select[name="proposedReceivingGroupId"]')
    .selectOption({ label: `${userBName}'s group` })
  await page.locator('select[name="category"]').selectOption('OTHER')
  await page.locator('input[name="description"]').fill('Washing machine')
  await page.locator('input[name="itemCount"]').fill('1')
  await page.locator('input[value="FULL_PALLET"]').check()
  await page.locator('input[name="containerWidthCm"]').fill('60')
  await page.locator('input[name="containerLengthCm"]').fill('60')
  await page.locator('input[name="containerHeightCm"]').fill('80')
  await page.locator('input[name="containerWeightGrams"]').fill('120')
  await page.locator('text=No dangerous goods').click()
  await page.locator('text=Save line item').click()

  // submit offer
  await page.locator('text=Submit offer').click()
  await page.locator('aside[role="dialog"] >> text=Submit offer').click()

  // Click text=This offer is awaiting review
  await expect(page.locator('body')).toContainText(
    'This offer is awaiting review',
  )
})
