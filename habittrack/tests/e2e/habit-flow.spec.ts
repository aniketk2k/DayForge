import { expect, test } from '@playwright/test'

test('login, onboarding, and habit completion flow', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('User ID').fill('aniket')
  await page.getByLabel('Password').fill('HabitTrack@2026')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.getByRole('button', { name: /Explore with demo data/ }).click()
  await expect(page.getByRole('heading', { name: 'Habit tracker' })).toBeVisible()

  const cell = page.getByRole('button', { name: 'Wake up at 5:00 AM, September 1, 2026, completed' })
  await cell.click()
  await expect(page.getByRole('button', { name: 'Wake up at 5:00 AM, September 1, 2026, not completed' })).toHaveAttribute('aria-pressed', 'false')
})