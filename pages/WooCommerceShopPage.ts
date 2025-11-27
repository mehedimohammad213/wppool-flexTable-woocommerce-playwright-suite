import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WooCommerceShopPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly cartIcon: Locator;
  readonly viewCartButton: Locator;
  readonly products: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.locator('button:has-text("Add to cart"), a:has-text("Add to cart")');
    this.cartIcon = page.locator('.cart-contents, a[href*="cart"]');
    this.viewCartButton = page.locator('a:has-text("View cart")');
    this.products = page.locator('.product, .type-product');
  }

  async navigateToShop(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    await this.navigateTo(`${baseUrl}/shop`);
    await this.waitForPageLoad();
  }

  async addFirstProductToCart(): Promise<string> {
    await this.page.waitForTimeout(2000);
    const firstProduct = this.products.first();
    const productName = await firstProduct.locator('.woocommerce-loop-product__title, h2, h3').textContent() || 'Product';

    const addToCartBtn = firstProduct.locator('button:has-text("Add to cart"), a:has-text("Add to cart")').first();
    await this.clickElement(addToCartBtn);
    await this.page.waitForTimeout(2000);

    return productName.trim();
  }

  async addMultipleProductsToCart(count: number): Promise<string[]> {
    const productNames: string[] = [];

    for (let i = 0; i < count; i++) {
      const product = this.products.nth(i);
      const productName = await product.locator('.woocommerce-loop-product__title, h2, h3').textContent() || `Product ${i + 1}`;
      productNames.push(productName.trim());

      const addToCartBtn = product.locator('button:has-text("Add to cart"), a:has-text("Add to cart")').first();
      await this.clickElement(addToCartBtn);
      await this.page.waitForTimeout(2000);
    }

    return productNames;
  }

  async viewCart(): Promise<void> {
    if (await this.viewCartButton.count() > 0) {
      await this.clickElement(this.viewCartButton);
    } else {
      await this.clickElement(this.cartIcon);
    }
    await this.waitForPageLoad();
  }
}
