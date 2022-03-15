import { expect, test } from '@playwright/test'
import { promises as fs } from 'fs'
import { baseUrl } from '../baseUrl'
import { users } from '../users'

for (const [
  role,
  { email, password, name, stateFile, infoFile },
] of Object.entries(users)) {
  test(`Register a new ${role} account`, async ({ page }) => {
    // Open start page and find registration link
    await page.goto(`${baseUrl}/`)
    await expect(page.locator('main')).toContainText(
      "Welcome to Distribute Aid's shipment tracker! Please log in to continue.",
    )
    await page.screenshot({ path: `./test-session/login-${role}.png` })

    // Navigate to registration page
    await page.click('text=register here')
    expect(page.url()).toEqual(`${baseUrl}/register`)
    await page.screenshot({ path: `./test-session/register-${role}.png` })

    // input user information
    await page.fill('input[name="name"]', name)
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', password)
    await page.click('button:has-text("Register")')
    await expect(page.locator('main')).toContainText('Registration successful.')
    expect(page.url()).toEqual(`${baseUrl}/register/confirm`)
    await page.screenshot({
      path: `./test-session/register-confirm-${role}.png`,
    })

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
    await page.screenshot({ path: `./test-session/dashboard-${role}.png` })

    // Store state to be re-used in authenticated tests
    await page.context().storageState({
      path: stateFile,
    })
    await fs.writeFile(infoFile, JSON.stringify({ name, email }), 'utf-8')

    // log out
    await page.click('[data-test-id=nav-dropdown]')
    await page.click('text=Log out')
    await expect(page.locator('main')).toContainText(
      "Welcome to Distribute Aid's shipment tracker! Please log in to continue.",
    )
  })
}
