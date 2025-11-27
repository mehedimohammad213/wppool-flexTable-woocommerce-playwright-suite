import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WordPressLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly dashboardHeader: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user_login');
    this.passwordInput = page.locator('#user_pass');
    this.loginButton = page.locator('#wp-submit');
    this.dashboardHeader = page.locator('#wpadminbar');
    this.errorMessage = page.locator('#login_error');
  }

  async navigateToLogin(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    await this.navigateTo(`${baseUrl}/wp-admin`);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.page.waitForLoadState('networkidle');
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.isElementVisible(this.dashboardHeader);
  }

  async isDashboardDisplayed(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('/wp-admin') && await this.isLoggedIn();
  }
}
