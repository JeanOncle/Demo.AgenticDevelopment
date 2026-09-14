import { expect, test } from '@playwright/test'

test('a manager can create a valid starting lineup in the hosted application', async ({ page }) => {
  await page.goto('/')

  for (let index = 0; index < 11; index += 1) {
    await page.getByRole('button', { name: 'Basis' }).first().click()
  }

  await expect(page.getByText('11/11')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Bevestig opstelling' })).toBeEnabled()
})

test('a manager can place starters on a selected formation', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Basis' }).first().click()
  await page.getByRole('button', { name: /Milan de Boer/ }).dragTo(
    page.getByRole('button', { name: /Doelman: vrij/ }),
  )

  await expect(page.getByRole('button', { name: /Doelman: Milan de Boer/ })).toBeVisible()
  await page.getByRole('button', { name: '4-3-3' }).click()
  await expect(page.getByText('1 nog niet geplaatst')).toBeVisible()
})
