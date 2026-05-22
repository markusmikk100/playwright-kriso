import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;
  protected readonly logo: Locator;
  protected readonly consentButton: Locator;
  protected readonly searchInput: Locator;
  protected readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = this.page.getByRole('link', { name: /Kriso/i }).first();
    this.consentButton = this.page.getByRole('button', { name: /Nõustun|I agree|Accept/i });
    this.searchInput = this.page.getByRole('textbox', { name: /Pealkiri|Title|ISBN|märksõna|keyword/i }).first();
    this.searchButton = this.page.getByRole('button', { name: /Search|Otsi/i }).first();
  }

  // Public getter to access page from tests
  getPage(): Page {
    return this.page;
  }

  async acceptCookies() {
    if (await this.consentButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.consentButton.click();
    }
  }

  async verifyLogo() {
    await expect(this.logo).toBeVisible();
  }

  async searchByKeyword(keyword: string) {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async getResultsCount() {
    const resultsText = await this.page.locator('.sb-results-total').first().textContent();
    return Number((resultsText || '').replace(/\D/g, '')) || 0;
  }
}