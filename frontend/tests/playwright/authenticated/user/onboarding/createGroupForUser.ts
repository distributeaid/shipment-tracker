import { expect, Page } from '@playwright/test'
import { baseUrl } from '../../../baseUrl'

export const createGroupForUser =
  ({ page }: { page: Page }) =>
  async ({ name, email }: { name: string; email: string }) => {
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
    await page.selectOption('select[name="primaryLocation.country"]', 'NO')
    await page.fill('input[name="primaryContact.name"]', name)
    await page.fill('input[name="primaryContact.email"]', email)
    await page.click('text=Create group')

    await page.waitForNavigation({
      url: new RegExp(`${baseUrl}/group/[0-9]+`),
    })
    await expect(page.locator('h1')).toContainText(`${name}'s group`)
    await expect(page.locator('main')).toContainText(
      `Description for ${name}'s group`,
    )
    await expect(page.locator('main')).toContainText(`Trondheim, Norway`)
    await page.screenshot({ path: `./test-session/group-created.png` })
  }
