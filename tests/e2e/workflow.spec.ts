import { expect, test } from '@playwright/test'

// Fresh storage per test (Playwright isolates context), so IndexedDB starts empty.

test('adds a widget and persists it and its content across reload', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Noch keine Widgets hinzugefügt.')).toBeVisible()

  await page.getByRole('button', { name: 'Textfeld hinzufügen' }).click()
  const area = page.getByLabel('Textinhalt')
  await expect(area).toBeVisible()
  await area.fill('Aufgabe 3, Seite 42')

  // Allow the debounced autosave to reach IndexedDB, then reload.
  await page.waitForTimeout(700)
  await page.reload()

  await expect(page.getByLabel('Textinhalt')).toHaveValue('Aufgabe 3, Seite 42')
})

test('scoreboard score persists across reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Punktetafel hinzufügen' }).click()

  await page.getByPlaceholder('Name').fill('Team A')
  await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click()
  await page.getByRole('button', { name: 'Punkt für Team A', exact: true }).click()

  const row = page.getByRole('listitem').filter({ hasText: 'Team A' })
  await expect(row).toContainText('1')

  await page.waitForTimeout(700)
  await page.reload()

  await expect(page.getByRole('listitem').filter({ hasText: 'Team A' })).toContainText('1')
})

test('morning board shows weather from the (mocked) weather API', async ({ page }) => {
  await page.route('**/geocoding-api.open-meteo.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: [{ name: 'Hannover', admin1: 'Niedersachsen', latitude: 52.37, longitude: 9.73 }],
      }),
    }),
  )
  await page.route('**/api.open-meteo.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ current: { temperature_2m: 14.2, weather_code: 3 } }),
    }),
  )

  await page.goto('/')
  await page.getByRole('button', { name: 'Morning Board hinzufügen' }).click()
  await page.getByPlaceholder('Stadt suchen …').fill('Hannover')
  await page.getByRole('button', { name: 'Suchen', exact: true }).click()

  await expect(page.getByText('Hannover, Niedersachsen')).toBeVisible()
  await expect(page.getByText(/14 °C · Bewölkt/)).toBeVisible()
})

test('provides a keyboard alternative to drag for moving widgets', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Timer hinzufügen' }).click()
  await expect(page.getByRole('button', { name: 'Timer nach rechts verschieben' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Timer nach unten verschieben' })).toBeVisible()
})

test('reset clears the dashboard after confirmation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Timer hinzufügen' }).click()
  await expect(page.getByRole('button', { name: 'Timer entfernen' })).toBeVisible()

  page.once('dialog', (dialog) => dialog.accept())
  // Scope to the project actions group: the Timer widget also has a "Zurücksetzen".
  await page
    .getByRole('group', { name: 'Projektaktionen' })
    .getByRole('button', { name: 'Zurücksetzen' })
    .click()

  await expect(page.getByText('Noch keine Widgets hinzugefügt.')).toBeVisible()
})

test('a failed import shows an error and preserves current state', async ({ page }) => {
  await page.goto('/')
  await page.locator('input[type="file"]').setInputFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ this is not valid json'),
  })

  await expect(page.getByRole('alert')).toContainText('Import fehlgeschlagen')
  // Current (empty) state is preserved; still on the dashboard.
  await expect(page.getByText('Noch keine Widgets hinzugefügt.')).toBeVisible()
})
