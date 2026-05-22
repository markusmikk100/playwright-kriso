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

test('Test navigate to kitarr category', async () => {
  await productPage.openMusicBooksSection();
  await productPage.openKitarrCategory();
  await productPage.verifyKitarrInUrl();
  const count = await productPage.getResultsCount();
  expect(count).toBeGreaterThan(1);
});

test('Test apply English language filter', async () => {
  const initialCount = await productPage.getResultsCount();
  await productPage.applyEnglishFilter();
  await productPage.verifyLanguageFilterInUrl();
  const newCount = await productPage.getResultsCount();
  expect(newCount).toBeLessThan(initialCount);
});

test('Test apply CD format filter', async () => {
  const currentCount = await productPage.getResultsCount();
  await productPage.applyCdFormatFilter();
  await productPage.verifyCdFilterInUrl();
  const newCount = await productPage.getResultsCount();
  expect(newCount).toBeLessThan(currentCount);
});