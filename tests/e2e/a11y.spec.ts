import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { addApp } from './helpers'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test('dashboard has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/')
  // Populate the workspace so widgets are included in the scan.
  await addApp(page, 'Timer')
  await addApp(page, 'Unterrichtsphasen')

  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([])
})

test('a content page has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/datenschutz')
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([])
})
