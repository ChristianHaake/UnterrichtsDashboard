import { expect, test } from '@playwright/test'
import { addApp } from './helpers'

// Fresh storage per test (Playwright isolates context), so IndexedDB starts empty.

test('adds a widget and persists it and its content across reload', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Noch keine Widgets hinzugefügt.')).toBeVisible()

  await addApp(page, 'Textfeld')
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
  await addApp(page, 'Punktetafel')

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
  await addApp(page, 'Morning Board')
  await page.getByPlaceholder('Stadt suchen …').fill('Hannover')
  await page.getByRole('button', { name: 'Suchen', exact: true }).click()

  await expect(page.getByText('Hannover, Niedersachsen')).toBeVisible()
  await expect(page.getByText(/14 °C · Bewölkt/)).toBeVisible()
})

test('whiteboard records a drawn stroke and can be cleared', async ({ page }) => {
  await page.goto('/')
  await addApp(page, 'Whiteboard')

  const canvas = page.getByRole('img', { name: /Zeichenfläche/ })
  await expect(canvas).toBeVisible()
  const box = await canvas.boundingBox()
  if (!box) throw new Error('canvas has no bounding box')

  await page.mouse.move(box.x + 20, box.y + 20)
  await page.mouse.down()
  await page.mouse.move(box.x + 80, box.y + 60)
  await page.mouse.move(box.x + 130, box.y + 40)
  await page.mouse.up()

  const undo = page.getByRole('button', { name: 'Rückgängig' })
  await expect(undo).toBeEnabled()

  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Löschen', exact: true }).click()
  await expect(undo).toBeDisabled()
})

test('math instruments switch the rendered SVG', async ({ page }) => {
  await page.goto('/')
  await addApp(page, 'Mathe-Instrumente')

  await expect(page.getByRole('img', { name: 'Koordinatensystem' })).toBeVisible()
  await page.getByRole('button', { name: 'Geodreieck' }).click()
  await expect(page.getByRole('img', { name: 'Geodreieck' })).toBeVisible()
})

test('app palette filters apps by search', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'App hinzufügen' }).click()
  await page.getByRole('searchbox', { name: 'Apps durchsuchen …' }).fill('white')

  await expect(page.getByRole('button', { name: 'Whiteboard hinzufügen' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Timer hinzufügen' })).toHaveCount(0)

  await page.getByRole('searchbox', { name: 'Apps durchsuchen …' }).fill('zzzz')
  await expect(page.getByText('Keine Treffer.')).toBeVisible()
})

test('canvas zoom controls change and reset the zoom level', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('100%')).toBeVisible()
  await page.getByRole('button', { name: 'Vergrößern' }).click()
  await expect(page.getByText('120%')).toBeVisible()
  await page.getByRole('button', { name: 'Ansicht zurücksetzen' }).click()
  await expect(page.getByText('100%')).toBeVisible()
})

test('boards isolate widgets and persist across reload', async ({ page }) => {
  await page.goto('/')
  await addApp(page, 'Timer')
  await expect(page.getByRole('button', { name: 'Timer entfernen' })).toBeVisible()

  // New board is empty and does not show board 1's widgets.
  await page.getByRole('button', { name: 'Neue Tafel' }).click()
  await expect(page.getByText('Noch keine Widgets hinzugefügt.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Timer entfernen' })).toHaveCount(0)

  // Switching back shows board 1's widget again.
  await page.getByRole('button', { name: 'Tafel 1', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Timer entfernen' })).toBeVisible()

  await page.waitForTimeout(700)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Tafel 2', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Timer entfernen' })).toBeVisible()
})

test('canvas view (zoom) persists across reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Vergrößern' }).click()
  await expect(page.getByText('120%')).toBeVisible()

  await page.waitForTimeout(700)
  await page.reload()

  await expect(page.getByText('120%')).toBeVisible()
})

test('provides a keyboard alternative to drag for moving widgets', async ({ page }) => {
  await page.goto('/')
  await addApp(page, 'Timer')
  await expect(page.getByRole('button', { name: 'Timer nach rechts verschieben' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Timer nach unten verschieben' })).toBeVisible()
})

test('reset clears the dashboard after confirmation', async ({ page }) => {
  await page.goto('/')
  await addApp(page, 'Timer')
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
