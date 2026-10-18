import { expect, test } from '@playwright/test'

test('dashboard visual baseline', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('User ID').fill('aniket')
  await page.getByLabel('Password').fill('HabitTrack@2026')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: /Explore with demo data/ }).click()
  await expect(page).toHaveScreenshot('dashboard.png', { fullPage: true, animations: 'disabled' })
})