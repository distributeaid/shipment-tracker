import { expect, test } from '@playwright/test'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 } from 'uuid'
import { baseUrl } from '../../baseUrl'
import { users } from '../../users'
import { userGroupName } from '../user/onboarding/createGroupForUser'

test.use({
  storageState: users.admin.stateFile,
})

test('Admins can create a shipment', async ({ page }) => {
  await page.goto(`${baseUrl}/`)

  const hubs = [
    {
      locality: 'Coventry',
      country: 'GB',
      countryName: 'UK',
      name: `Sending Hub ${v4()}`,
    },
    {
      locality: 'Calais',
      country: 'FR',
      countryName: 'France',
      name: `Receiving Hub ${v4()}`,
    },
  ]

  // Create the sending and the receiving hub
  for (const { name, locality, country, countryName } of hubs) {
    await page.locator('header a:has-text("Admin")').nth(1).click()
    await page.locator('text=Manage groups').click()
    await page.locator('text=Create group').click()
    await page.locator('input[name="name"]').fill(name)
    await page.locator('select[name="groupType"]').selectOption(`DA_HUB`)
    await page.locator('input[name="locality"]').fill(locality)
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
      `${locality}, ${countryName}`,
    )
  }

  // Create the shipment
  await page.locator('header a:has-text("Shipments")').nth(1).click()
  await page.locator('text=Create shipment').click()
  await page.locator('select[name="origin"]').selectOption('uk')
  await page.locator('select[name="destination"]').selectOption('calais')

  // Select the receiving hub
  await page
    .locator('#new-shipment-receivingHubs input[role="combobox"]')
    .fill(hubs[0].name)
  await page
    .locator('#new-shipment-receivingHubs input[role="combobox"]')
    .press(`Enter`)

  // Select the sending hub
  await page
    .locator(`#new-shipment-sendingHubs input[role="combobox"]`)
    .fill(hubs[1].name)
  await page
    .locator('#new-shipment-sendingHubs input[role="combobox"]')
    .press(`Enter`)

  // Select the receiving groups
  const userA = JSON.parse(await fs.readFile(users.userA.infoFile, 'utf-8'))
  const userB = JSON.parse(await fs.readFile(users.userB.infoFile, 'utf-8'))
  const userC = JSON.parse(await fs.readFile(users.userC.infoFile, 'utf-8'))
  const userAGroupName = userGroupName({ name: userA.name })
  const userBGroupName = userGroupName({ name: userB.name })
  const userCGroupName = userGroupName({ name: userC.name })
  for (const groupName of [userAGroupName, userBGroupName, userCGroupName]) {
    await page
      .locator(`#new-shipment-receivingGroups input[role="combobox"]`)
      .fill(groupName)
    await page
      .locator('#new-shipment-receivingGroups input[role="combobox"]')
      .press(`Enter`)
  }
  // Dismiss input
  await page.locator('main').click()

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

  // Check info on list page
  await expect(page.locator('main table tbody')).toContainText(`uk-calais`)
  await expect(page.locator('main table tbody')).toContainText(
    `${hubs[0].name}`,
  )
  await expect(page.locator('main table tbody')).toContainText(
    `${hubs[1].name}`,
  )
  await page.screenshot({ path: `./test-session/shipments.png` })

  // Check info on detail page

  // Receiving groups should have been saved
  await page
    .locator(`main table tbody tr:has-text("${hubs[0].name}") a`)
    .click()
  for (const groupName of [userAGroupName, userBGroupName, userCGroupName]) {
    await expect(page.locator('main')).toContainText(groupName)
  }

  await fs.writeFile(
    path.join(process.cwd(), 'test-session', 'shipment.json'),
    JSON.stringify({
      sendingHub: hubs[0].name,
      receivingHub: hubs[1].name,
    }),
    'utf-8',
  )
})
