const { firefox } = require('playwright')
const { test, expect } = require('@playwright/test')

test('show login screen', async ({ page }) => {
  await page.goto('http://localhost:8080/')
  await page.screenshot({ path: `login.png` })
  const content = await page.textContent('main')
  expect(content).toContain(
    "Welcome to Distribute Aid's shipment tracker! Please log in to continue.",
  )
})
