import { expect, Page, test } from '@playwright/test'
import Chance from 'chance'
import { v4 } from 'uuid'

const chance = new Chance()

const registerUserAndLogIn = async ({ page }: { page: Page }) => {
  const name = chance.name({ middle: true })
  const email = chance.email({ domain: 'example.com' })
  const password = `U${v4()}!`
  // Open start page and find registration link
  await page.goto('http://localhost:3000/')
  await page.click('text=register here')
  await page.fill('input[name="name"]', name)
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button:has-text("Register")')
  await expect(page.locator('main')).toContainText('Registration successful.')
  // verify
  expect(page.url()).toEqual('http://localhost:3000/register/confirm')
  await page.fill('input[name="token"]', '123456')
  await page.click('button:has-text("Verify")')
  await expect(page.locator('main')).toContainText(
    'Email confirmation successful.',
  )
  // log in
  expect(page.url()).toEqual('http://localhost:3000/')
  await page.fill('input[name="password"]', password)
  await page.click('button:has-text("Log in")')
  await expect(page.locator('main')).toContainText(
    'Welcome to the Shipment Tracker!',
  )
  return { name, email }
}

test('Onboarding: users can create their group', async ({ page }) => {
  const { name, email } = await registerUserAndLogIn({ page })

  await page.click('text=Create group')
  expect(page.url()).toEqual('http://localhost:3000/group/new')
  await page.screenshot({ path: `./test-results/create-group.png` })
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
    url: /http:\/\/localhost:3000\/group\/[0-9]+/,
  }),
    await expect(page.locator('h1')).toContainText(`${name}'s group`)
  await expect(page.locator('main')).toContainText(
    `Description for ${name}'s group`,
  )
  await expect(page.locator('main')).toContainText(`Trondheim, Norway`)
  await page.screenshot({ path: `./test-results/group-created.png` })
})
