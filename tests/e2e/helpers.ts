import type { Page } from '@playwright/test'

/** Open the app palette and add the app with the given (localized) label. */
export async function addApp(page: Page, name: string) {
  await page.getByRole('button', { name: 'App hinzufügen' }).click()
  await page.getByRole('button', { name: `${name} hinzufügen` }).click()
}
