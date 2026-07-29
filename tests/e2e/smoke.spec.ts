import { expect, test } from '@playwright/test'

test('dashboard loads with shell and footer legal links', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'UnterrichtsDashboard' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible()

  const footer = page.getByRole('contentinfo')
  for (const label of ['Hilfe', 'Über', 'Datenschutz', 'Impressum']) {
    await expect(footer.getByRole('link', { name: label })).toBeVisible()
  }
})

test('direct navigation to a content route works (SPA fallback)', async ({ page }) => {
  await page.goto('/datenschutz')
  await expect(page.getByRole('heading', { level: 1, name: 'Datenschutz' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Zurück zum Dashboard/ })).toBeVisible()
})

test('language switch updates the interface and document language', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox').selectOption('en')
  await expect(page.getByText('All data stays local in this browser.')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})
