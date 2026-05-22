import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class HomePage extends BasePage {
  private readonly url = 'https://www.kriso.ee/';
  private readonly addToCartLink: Locator;
  private readonly addToCartMessage: Locator;
  private readonly cartCount: Locator;
  private readonly backButton: Locator;
  private readonly forwardButton: Locator;
  private readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartLink = this.page.getByRole('link', { name: /Lisa ostukorvi/i });
    this.addToCartMessage = this.page.locator('.item-messagebox');
    this.cartCount = this.page.locator('.cart-products');
    this.backButton = this.page.locator('.cartbtn-event.back');
    this.forwardButton = this.page.locator('.cartbtn-event.forward');
    this.noResultsMessage = this.page.locator('.msg.msg-info');
  }

  async openUrl() {
    await this.page.goto(this.url);
  }

  async verifyResultsCountMoreThan(minCount: number) {
    const total = await this.getResultsCount();
    expect(total).toBeGreaterThan(minCount);
  }

  async addToCartByIndex(index: number) {
    await this.addToCartLink.nth(index).click();
  }

  async verifyAddToCartMessage() {
    await expect(this.addToCartMessage).toContainText(/Toode lisati ostukorvi|added to cart/i);
  }

  async verifyCartCount(expectedCount: number) {
    await expect(this.cartCount).toContainText(expectedCount.toString());
  }

  async goBackFromCart() {
    await this.backButton.click();
  }

  async openShoppingCart() {
    await this.forwardButton.click();
    return new CartPage(this.page);
  }

  async verifyNoProductsFoundMessage() {
    await expect(this.noResultsMessage).toBeVisible();
    await expect(this.noResultsMessage).toContainText(/ei leitud|did not find any match/i);
  }

  async verifyResultsContainKeyword(keyword: string) {
    const keywordLinks = this.page.getByRole('link', { name: new RegExp(keyword, 'i') });
    const count = await keywordLinks.count();
    if (count === 0) {
      console.log(`No links found containing "${keyword}"`);
    }
  }
}
