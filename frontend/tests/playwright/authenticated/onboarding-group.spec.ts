import { expect, test } from '@playwright/test'
import { promises as fs } from 'fs'
import * as path from 'path'
import { baseUrl } from '../baseUrl'

test.use({
  storageState: path.join(process.cwd(), 'test-session', 'authenticated.json'),
})

let email: string
let name: string

test.beforeAll(async () => {
  const user = JSON.parse(
    await fs.readFile(
      path.join(process.cwd(), 'test-session', 'user.json'),
      'utf-8',
    ),
  )
  email = user.email
  name = user.name
})

test('Onboarding: users can create a group', async ({ page }) => {
  await page.goto(`${baseUrl}/`)
  await page.click('text=Create group')
  expect(page.url()).toEqual(`${baseUrl}/group/new`)
  await page.screenshot({ path: `./test-session/create-group.png` })
  await page.fill('input[name="name"]', `${name}'s group`)
  await page.fill(
    'textarea[name="description"]',
    `Description for ${name}'s group`,
  )
  await page.fill('input[name="primaryLocation.townCity"]', 'Trondheim')
  await page.selectOption('select[name="primaryLocation.countryCode"]', 'NO')
  await page.fill('input[name="primaryContact.name"]', name)
  await page.fill('input[name="primaryContact.email"]', email)
  await page.click('text=Create group')

  // Click text=Create group
  await page.waitForNavigation({
    url: new RegExp(`${baseUrl}/group/[0-9]+`),
  })
  await expect(page.locator('h1')).toContainText(`${name}'s group`)
  await expect(page.locator('main')).toContainText(
    `Description for ${name}'s group`,
  )
  await expect(page.locator('main')).toContainText(`Trondheim, Norway`)
  await page.screenshot({ path: `./test-session/group-created.png` })
})
