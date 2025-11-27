import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WooCommerceCartPage extends BasePage {
  readonly proceedToCheckoutButton: Locator;
  readonly cartTable: Locator;
  readonly cartSubtotal: Locator;
  readonly cartTotal: Locator;
  readonly updateCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.proceedToCheckoutButton = page.locator('a:has-text("Proceed to checkout"), button:has-text("Proceed to checkout")');
    this.cartTable = page.locator('.shop_table, .cart_table, table.cart');
    this.cartSubtotal = page.locator('.cart-subtotal .amount, [data-title="Subtotal"]');
    this.cartTotal = page.locator('.order-total .amount');
    this.updateCartButton = page.locator('button:has-text("Update cart")');
  }

  async navigateToCart(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    await this.navigateTo(`${baseUrl}/cart`);
    await this.waitForPageLoad();
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.proceedToCheckoutButton);
    await this.waitForPageLoad();
  }

  async getCartTotal(): Promise<string> {
    return await this.getText(this.cartTotal);
  }

  async isCartEmpty(): Promise<boolean> {
    const emptyCartMessage = this.page.locator('.cart-empty, .woocommerce-info:has-text("cart is currently empty")');
    return await emptyCartMessage.count() > 0;
  }
}
