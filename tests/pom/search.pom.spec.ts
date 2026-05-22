/**
 * Part II — Page Object Model tests
 * Test suite: Search for Books by Keywords
 */
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe.configure({ mode: 'serial' });

let homePage: HomePage;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  homePage = new HomePage(page);
  await homePage.openUrl();
  await homePage.acceptCookies();
});

test('Test logo is visible', async () => {
  await homePage.verifyLogo();
});

test('Test search for harry potter returns results', async () => {
  await homePage.searchByKeyword('harry potter');
  await homePage.verifyResultsCountMoreThan(1);
});

test('Test search results contain keyword', async () => {
  await homePage.searchByKeyword('tolkien');
  await homePage.verifyResultsContainKeyword('tolkien');
});

test('Test no products found message', async () => {
  await homePage.searchByKeyword('xqzwmfkj');
  await homePage.verifyNoProductsFoundMessage();
});