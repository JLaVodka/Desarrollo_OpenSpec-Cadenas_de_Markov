import { expect, test } from '@playwright/test';

test('calculates a prediction through the real FastAPI endpoint', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Calcular predicción/ }).click();

  const results = page.getByRole('table').filter({ has: page.getByRole('columnheader', { name: 'Pasos' }) });
  await expect(results.getByRole('row', { name: /10 pasos/ })).toContainText('35.75%');
  await expect(results.getByRole('row', { name: /10 pasos/ })).toContainText('40.27%');
  await expect(page.getByRole('heading', { name: 'Evolución de probabilidades' })).toBeVisible();
  await expect(page.locator('.recharts-bar-rectangles .recharts-rectangle')).toHaveCount(11);
});


test('keeps the page usable on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Enemy Behavior Predictor' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Calcular predicción/ })).toBeVisible();
  const noPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(noPageOverflow).toBe(true);
});
