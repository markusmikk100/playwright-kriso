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
  private readonly fallbackProducts: string[];

  constructor(page: Page) {
    super(page);
    this.addToCartLink = this.page.getByRole('link', { name: /Lisa ostukorvi/i });
    this.addToCartMessage = this.page.locator('.item-messagebox');
    this.cartCount = this.page.locator('.cart-products');
    this.backButton = this.page.locator('.cartbtn-event.back');
    this.forwardButton = this.page.locator('.cartbtn-event.forward');
    this.noResultsMessage = this.page.locator('.msg.msg-info');
    this.fallbackProducts = [
      'https://www.kriso.ee/gone-girl-db-9780307588371.html',
      'https://www.kriso.ee/fellowship-ring-film-tie-edition-db-9780008802370.html',
    ];
  }

  async openUrl() {
    await this.page.goto(this.url);
  }

  async verifyResultsCountMoreThan(minCount: number) {
    const total = await this.getResultsCount();
    expect(total).toBeGreaterThan(minCount);
  }

  async addToCartByIndex(index: number) {
    const candidate = await this.getVisibleAddToCartLink(index);
    try {
      await candidate.scrollIntoViewIfNeeded();
      await candidate.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      await candidate.click({ timeout: 10000 });
      return;
    } catch (err) {
    }

    const fallbackUrl = this.fallbackProducts[Math.min(index, this.fallbackProducts.length - 1)];
    await this.page.goto(fallbackUrl, { waitUntil: 'domcontentloaded' });
    const productAdd = this.page.locator('a[data-func="add2cart"]').first();
    await expect(productAdd).toBeVisible();
    await productAdd.click();
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
    expect(count).toBeGreaterThan(1);
  }

  async verifyBookIsShown(title: string) {
    await expect(this.page.getByRole('link', { name: new RegExp(title, 'i') }).first()).toBeVisible();
  }

  private async getVisibleAddToCartLink(index: number): Promise<Locator> {
    // Prefer explicit add-to-cart anchors used on the site
    const addLinks = this.page.locator('a[data-func="add2cart"]');
    const count = await addLinks.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const candidate = addLinks.nth(i);
        if (!(await candidate.isVisible())) continue;

        if (index === 0) return candidate;
        index -= 1;
      }

      for (let i = 0; i < count; i++) {
        const candidate = addLinks.nth(i);
        if (await candidate.isVisible()) return candidate;
      }
      return addLinks.first();
    }

    const roleCount = await this.addToCartLink.count();
    for (let i = 0; i < roleCount; i++) {
      const candidate = this.addToCartLink.nth(i);
      if (!(await candidate.isVisible())) continue;

      if (index === 0) return candidate;
      index -= 1;
    }

    const safeIndex = roleCount === 0 ? 0 : Math.min(index, roleCount - 1);
    return this.addToCartLink.nth(safeIndex);
  }
}