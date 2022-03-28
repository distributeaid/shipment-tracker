import { expect, test } from '@playwright/test'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 } from 'uuid'
import { baseUrl } from '../../baseUrl'
import { users } from '../../users'

test.use({
  storageState: users.admin.stateFile,
})

test('Admins can create a shipment', async ({ page }) => {
  await page.goto(`${baseUrl}/`)

  const hubs = [
    {
      city: 'Coventry',
      country: 'GB',
      countryName: 'UK',
      name: `Sending Hub ${v4()}`,
    },
    {
      city: 'Calais',
      country: 'FR',
      countryName: 'France',
      name: `Receiving Hub ${v4()}`,
    },
  ]

  // Create the sending and the receiving hub
  for (const { name, city, country, countryName } of hubs) {
    await page.locator('header a:has-text("Admin")').nth(1).click()
    await page.locator('text=Manage groups').click()
    await page.locator('text=Create group').click()
    await page.locator('input[name="name"]').fill(name)
    await page.locator('select[name="groupType"]').selectOption(`DA_HUB`)
    await page.locator('input[name="locality"]').fill(city)
    await page.locator('select[name="country"]').selectOption(country)
    await page
      .locator('input[name="primaryContact\\.name"]')
      .fill('Distribute Aid')
    await page
      .locator('input[name="primaryContact\\.email"]')
      .fill('hello@distributeaid.org')
    await page.locator('text=Create group').click()
    // Verify
    await page.locator('header a:has-text("Admin")').nth(1).click()
    await page.locator('text=Manage groups').click()
    await expect(page.locator('main table tbody')).toContainText(name)
    await expect(page.locator('main table tbody')).toContainText(
      `${city} (${countryName})`,
    )
  }

  // Create the shipment
  await page.locator('header a:has-text("Shipments")').nth(1).click()
  await page.locator('text=Create shipment').click()
  await page.locator('select[name="shipmentRoute"]').selectOption('UkToFr')
  // Click on the chevron
  await page.locator('#new-shipment-receivingHubs svg').click()
  // Select the sending hub
  await page
    .locator('#new-shipment-receivingHubs input[role="combobox"]')
    .fill(hubs[0].name)
  await page
    .locator('#new-shipment-receivingHubs input[role="combobox"]')
    .press(`Enter`)

  // Select the receiving hub
  await page
    .locator(`#new-shipment-sendingHubs  input[role="combobox"]`)
    .fill(hubs[1].name)
  await page
    .locator('#new-shipment-sendingHubs input[role="combobox"]')
    .press(`Enter`)
  await page.screenshot({ path: `./test-session/create-shipment-form.png` })
  await page.locator('text=Create shipment').click()
  await page.screenshot({ path: `./test-session/shipment-created.png` })

  // Mark as OPEN
  await page.locator('text=Edit').click()
  await page.locator('select[name="status"]').selectOption('OPEN')
  await page.locator('text=Save changes').click()

  // Verify
  await page.locator('header a:has-text("Shipments")').nth(1).click()
  await page.reload() // FIXME: new shipment should be visible immediately
  await expect(page.locator('main table tbody')).toContainText(
    `${hubs[0].countryName} → ${hubs[1].countryName}`,
  )
  await expect(page.locator('main table tbody')).toContainText(
    `${hubs[0].name}`,
  )
  await expect(page.locator('main table tbody')).toContainText(
    `${hubs[1].name}`,
  )
  await page.screenshot({ path: `./test-session/shipments.png` })

  await fs.writeFile(
    path.join(process.cwd(), 'test-session', 'shipment.json'),
    JSON.stringify({
      sendingHub: hubs[0].name,
      receivingHub: hubs[1].name,
    }),
    'utf-8',
  )
})
