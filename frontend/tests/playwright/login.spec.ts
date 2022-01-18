import { expect, test } from '@playwright/test'
import Chance from 'chance'
import { v4 } from 'uuid'

const chance = new Chance()

test('Login form should show error', async ({ page }) => {
  const password = `U${v4()}!`
  const email = chance.email({ domain: 'example.com' })

  await page.goto('http://localhost:3000/')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button:has-text("Log in")')
  await expect(page.locator('main')).toContainText(
    `Sorry, could not log you in: User with email ${email} not found!`,
  )
  await page.screenshot({ path: `./test-results/login-error.png` })
})
