/**
 * Part II — Page Object Model tests
 * Test suite: Add Books to Shopping Cart
 */
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';

test.describe.configure({ mode: 'serial' });

let homePage: HomePage;
let cartPage: CartPage;

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  homePage = new HomePage(page);
  await homePage.openUrl();
  await homePage.acceptCookies();
});

test('Test logo is visible', async () => {
  await homePage.verifyLogo();
});

test('Test add one book to cart', async () => {
  await homePage.searchByKeyword('harry potter');
  await homePage.addToCartByIndex(0);
  await homePage.verifyAddToCartMessage();
  await homePage.verifyCartCount(1);
  await homePage.goBackFromCart();
});

test('Test add second book to cart', async () => {
  await homePage.addToCartByIndex(1);
  await homePage.verifyAddToCartMessage();
  await homePage.verifyCartCount(2);
});

test('Test cart count and sum is correct', async () => {
  cartPage = await homePage.openShoppingCart();
  await cartPage.verifyCartCount(2);
  await cartPage.verifyCartSumIsCorrect();
});

test('Test remove item from cart', async () => {
  await cartPage.removeItemByIndex(0);
  await cartPage.verifyCartCount(1);
  await cartPage.verifyCartSumIsCorrect();
});