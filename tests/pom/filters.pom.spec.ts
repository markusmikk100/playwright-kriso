/**
 * Part II — Page Object Model tests
 * Test suite: Navigate Products via Filters
 */
import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';

test.describe.configure({ mode: 'serial' });

let productPage: ProductPage;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  productPage = new ProductPage(page);
  await productPage.openUrl();
  await productPage.acceptCookies();
});

test('Test logo is visible', async () => {
  await productPage.verifyLogo();
});

test('Test music books section is visible', async () => {
  const musicLink = productPage.getPage().getByRole('link', { name: /Muusikaraamatud ja noodid/i }).first();
  await musicLink.scrollIntoViewIfNeeded();
  await expect(musicLink).toBeVisible();
});