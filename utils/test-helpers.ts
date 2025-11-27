import { Page } from '@playwright/test';

export class TestHelpers {
  static generateRandomString(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true
    });
  }

  static async waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  static getRandomRowsPerPage(): string {
    const options = ['5', '10', '20', '25', '50', '100'];
    return options[Math.floor(Math.random() * options.length)];
  }

  static getRandomTableHeight(): string {
    const options = ['300', '400', '500', '600', '800'];
    return options[Math.floor(Math.random() * options.length)];
  }
}

export interface BillingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
}

export const getBillingDetailsFromEnv = (): BillingDetails => {
  return {
    firstName: process.env.WC_CUSTOMER_FIRST_NAME || 'John',
    lastName: process.env.WC_CUSTOMER_LAST_NAME || 'Doe',
    address: process.env.WC_BILLING_ADDRESS || '123 Main Street',
    city: process.env.WC_BILLING_CITY || 'New York',
    state: process.env.WC_BILLING_STATE || 'NY',
    postcode: process.env.WC_BILLING_POSTCODE || '10001',
    phone: process.env.WC_BILLING_PHONE || '1234567890',
    email: process.env.WC_CUSTOMER_EMAIL || 'customer@example.com'
  };
};
