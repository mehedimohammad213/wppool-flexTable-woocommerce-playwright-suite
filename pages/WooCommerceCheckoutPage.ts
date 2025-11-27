import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WooCommerceCheckoutPage extends BasePage {
  readonly billingFirstName: Locator;
  readonly billingLastName: Locator;
  readonly billingAddress: Locator;
  readonly billingCity: Locator;
  readonly billingState: Locator;
  readonly billingPostcode: Locator;
  readonly billingPhone: Locator;
  readonly billingEmail: Locator;
  readonly placeOrderButton: Locator;
  readonly orderReceivedMessage: Locator;
  readonly orderNumber: Locator;
  readonly orderTotal: Locator;
  readonly paymentMethod: Locator;

  constructor(page: Page) {
    super(page);
    this.billingFirstName = page.locator('#billing_first_name');
    this.billingLastName = page.locator('#billing_last_name');
    this.billingAddress = page.locator('#billing_address_1');
    this.billingCity = page.locator('#billing_city');
    this.billingState = page.locator('#billing_state');
    this.billingPostcode = page.locator('#billing_postcode');
    this.billingPhone = page.locator('#billing_phone');
    this.billingEmail = page.locator('#billing_email');
    this.placeOrderButton = page.locator('#place_order, button:has-text("Place order")');
    this.orderReceivedMessage = page.locator('.woocommerce-notice--success, .woocommerce-thankyou-order-received');
    this.orderNumber = page.locator('.woocommerce-order-overview__order strong, .order-number');
    this.orderTotal = page.locator('.woocommerce-order-overview__total strong, .order-total');
    this.paymentMethod = page.locator('#payment_method_cod, #payment_method_bacs, input[name="payment_method"]').first();
  }

  async navigateToCheckout(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    await this.navigateTo(`${baseUrl}/checkout`);
    await this.waitForPageLoad();
  }

  async fillBillingDetails(details: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    phone: string;
    email: string;
  }): Promise<void> {
    await this.fillInput(this.billingFirstName, details.firstName);
    await this.fillInput(this.billingLastName, details.lastName);
    await this.fillInput(this.billingAddress, details.address);
    await this.fillInput(this.billingCity, details.city);

    // Handle state - could be select or input
    try {
      await this.billingState.selectOption(details.state);
    } catch {
      await this.fillInput(this.billingState, details.state);
    }

    await this.fillInput(this.billingPostcode, details.postcode);
    await this.fillInput(this.billingPhone, details.phone);
    await this.fillInput(this.billingEmail, details.email);
  }

  async selectPaymentMethod(): Promise<void> {
    await this.page.waitForTimeout(1000);
    if (await this.paymentMethod.count() > 0) {
      await this.clickElement(this.paymentMethod);
    }
  }

  async placeOrder(): Promise<void> {
    await this.clickElement(this.placeOrderButton);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
  }

  async isOrderComplete(): Promise<boolean> {
    return await this.isElementVisible(this.orderReceivedMessage);
  }

  async getOrderNumber(): Promise<string> {
    const orderNum = await this.getText(this.orderNumber);
    return orderNum.trim();
  }

  async getOrderTotal(): Promise<string> {
    return await this.getText(this.orderTotal);
  }
}
