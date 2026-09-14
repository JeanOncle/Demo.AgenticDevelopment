import { expect, test } from '@playwright/test'

test('a manager can create a valid starting lineup in the hosted application', async ({ page }) => {
  await page.goto('/')

  for (let index = 0; index < 11; index += 1) {
    await page.getByRole('button', { name: 'Basis' }).first().click()
  }

  await expect(page.getByText('11/11')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Bevestig opstelling' })).toBeEnabled()
})
