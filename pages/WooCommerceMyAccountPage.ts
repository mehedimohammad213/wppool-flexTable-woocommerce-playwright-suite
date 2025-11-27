import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WooCommerceMyAccountPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly ordersLink: Locator;
  readonly ordersTable: Locator;
  readonly orderRows: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button:has-text("Log in"), input[name="login"]');
    this.ordersLink = page.locator('a:has-text("Orders")');
    this.ordersTable = page.locator('.woocommerce-orders-table, table.my_account_orders');
    this.orderRows = page.locator('.woocommerce-orders-table tbody tr, table.my_account_orders tbody tr');
  }

  async navigateToMyAccount(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    await this.navigateTo(`${baseUrl}/my-account`);
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  async navigateToOrders(): Promise<void> {
    if (await this.ordersLink.count() > 0) {
      await this.clickElement(this.ordersLink);
      await this.waitForPageLoad();
    }
  }

  async isOrderInHistory(orderNumber: string): Promise<boolean> {
    await this.navigateToOrders();
    await this.page.waitForTimeout(2000);

    const orderRow = this.page.locator(`tr:has-text("#${orderNumber}"), tr:has-text("${orderNumber}")`);
    return await orderRow.count() > 0;
  }

  async getOrderCount(): Promise<number> {
    await this.navigateToOrders();
    return await this.orderRows.count();
  }

  async getLatestOrderNumber(): Promise<string> {
    await this.navigateToOrders();
    const firstOrder = this.orderRows.first();
    const orderNumber = await firstOrder.locator('.woocommerce-orders-table__cell-order-number a, td:first-child a').textContent();
    return orderNumber?.replace('#', '').trim() || '';
  }
}
