import { expect, test } from '@playwright/test'
import Chance from 'chance'
import { promises as fs } from 'fs'
import * as path from 'path'
import { v4 } from 'uuid'
import { baseUrl } from '../baseUrl'

const chance = new Chance()

test('Register a new account', async ({ page }) => {
  const password = `U${v4()}!`
  const name = chance.name({ middle: true })
  const email = chance.email({ domain: 'example.com' })

  // Open start page and find registration link
  await page.goto(`${baseUrl}/`)
  await expect(page.locator('main')).toContainText(
    "Welcome to Distribute Aid's shipment tracker! Please log in to continue.",
  )
  await page.screenshot({ path: `./test-session/login.png` })

  // Navigate to registration page
  await page.click('text=register here')
  expect(page.url()).toEqual(`${baseUrl}/register`)
  await page.screenshot({ path: `./test-session/register.png` })

  // input user information
  await page.fill('input[name="name"]', name)
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button:has-text("Register")')
  await expect(page.locator('main')).toContainText('Registration successful.')
  expect(page.url()).toEqual(`${baseUrl}/register/confirm`)
  await page.screenshot({ path: `./test-session/register-confirm.png` })

  // input verification token
  expect(await page.inputValue('input[name="email"]')).toEqual(email)
  await page.fill('input[name="token"]', '123456')
  await page.click('button:has-text("Verify")')
  await expect(page.locator('main')).toContainText(
    'Email confirmation successful.',
  )

  // log in
  expect(page.url()).toEqual(`${baseUrl}/`)
  expect(await page.inputValue('input[name="email"]')).toEqual(email)
  await page.fill('input[name="password"]', password)
  await page.click('button:has-text("Log in")')
  await expect(page.locator('main')).toContainText(
    'Welcome to the Shipment Tracker!',
  )
  await page.screenshot({ path: `./test-session/dashboard.png` })

  // Store state to be re-used in authenticated tests
  await page.context().storageState({
    path: path.join(process.cwd(), 'test-session', 'authenticated.json'),
  })
  await fs.writeFile(
    path.join(process.cwd(), 'test-session', 'user.json'),
    JSON.stringify({ name, email }),
    'utf-8',
  )

  // log out
  await page.click('[data-test-id=nav-dropdown]')
  await page.click('text=Log out')
  await expect(page.locator('main')).toContainText(
    "Welcome to Distribute Aid's shipment tracker! Please log in to continue.",
  )
})
