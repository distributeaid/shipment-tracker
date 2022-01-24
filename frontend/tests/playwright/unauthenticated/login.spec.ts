import { expect, test } from '@playwright/test'
import Chance from 'chance'
import { v4 } from 'uuid'
import { baseUrl } from '../baseUrl'

const chance = new Chance()

test('Login form should show error', async ({ page }) => {
  await page.goto(`${baseUrl}/`)

  const password = `U${v4()}!`
  const email = chance.email({ domain: 'example.com' })
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)

  await page.click('button:has-text("Log in")')

  await expect(page.locator('[role=alert]')).toContainText(
    `Sorry, could not log you in: User with email ${email} not found!`,
  )
  await page.screenshot({ path: `./test-session/login-error.png` })
})
