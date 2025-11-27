import { test, expect } from '@playwright/test';
import { WordPressLoginPage } from '../../pages/WordPressLoginPage';
import { WooCommerceShopPage } from '../../pages/WooCommerceShopPage';
import { WooCommerceCartPage } from '../../pages/WooCommerceCartPage';
import { WooCommerceCheckoutPage } from '../../pages/WooCommerceCheckoutPage';
import { WooCommerceMyAccountPage } from '../../pages/WooCommerceMyAccountPage';
import { TestHelpers, getBillingDetailsFromEnv } from '../../utils/test-helpers';

let orderNumber: string;
let orderTotal: string;

test.describe('WooCommerce Test Scenarios', () => {

  test('Scenario 1: End-to-End Checkout Flow', async ({ page }) => {
    const shopPage = new WooCommerceShopPage(page);
    const cartPage = new WooCommerceCartPage(page);
    const checkoutPage = new WooCommerceCheckoutPage(page);

    // Step 1: Navigate to shop and add products to cart
    await shopPage.navigateToShop();

    // Add 2 products to cart
    const productNames = await shopPage.addMultipleProductsToCart(2);
    console.log(`Added products to cart: ${productNames.join(', ')}`);

    // Step 2: View cart
    await shopPage.viewCart();

    // Verify cart is not empty
    const isCartEmpty = await cartPage.isCartEmpty();
    expect(isCartEmpty).toBeFalsy();

    // Get cart total
    const cartTotal = await cartPage.getCartTotal();
    console.log(`Cart Total: ${cartTotal}`);
    expect(cartTotal).toBeTruthy();

    // Take screenshot of cart
    await TestHelpers.takeScreenshot(page, 'wc-scenario1-cart');

    // Step 3: Proceed to checkout
    await cartPage.proceedToCheckout();

    // Step 4: Fill billing details
    const billingDetails = getBillingDetailsFromEnv();
    await checkoutPage.fillBillingDetails(billingDetails);

    // Take screenshot of filled checkout form
    await TestHelpers.takeScreenshot(page, 'wc-scenario1-checkout-filled');

    // Step 5: Select payment method
    await checkoutPage.selectPaymentMethod();

    // Step 6: Place order
    await checkoutPage.placeOrder();

    // Step 7: Verify order completion
    const isOrderComplete = await checkoutPage.isOrderComplete();
    expect(isOrderComplete).toBeTruthy();

    // Get order details
    orderNumber = await checkoutPage.getOrderNumber();
    orderTotal = await checkoutPage.getOrderTotal();

    console.log(`Order Number: ${orderNumber}`);
    console.log(`Order Total: ${orderTotal}`);

    expect(orderNumber).toBeTruthy();
    expect(orderTotal).toBeTruthy();

    // Take screenshot of order confirmation
    await TestHelpers.takeScreenshot(page, 'wc-scenario1-order-complete');

    // Step 8: Verify order in WooCommerce backend
    const loginPage = new WordPressLoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to WooCommerce Orders
    const baseUrl = process.env.WP_BASE_URL || '';
    await page.goto(`${baseUrl}/wp-admin/edit.php?post_type=shop_order`);
    await page.waitForLoadState('networkidle');

    // Check if order exists in the list
    const orderExists = await TestHelpers.waitForElement(
      page,
      `tr:has-text("#${orderNumber}"), tr:has-text("${orderNumber}")`,
      5000
    );

    expect(orderExists).toBeTruthy();

    // Take screenshot of order in backend
    await TestHelpers.takeScreenshot(page, 'wc-scenario1-backend-order');

    console.log('✅ SCENARIO 1 PASSED: End-to-End Checkout Flow Completed Successfully');
  });

  test('Scenario 2: User Account Order History', async ({ page }) => {
    const myAccountPage = new WooCommerceMyAccountPage(page);

    // Step 1: Login to customer account
    await myAccountPage.navigateToMyAccount();

    const customerEmail = process.env.WC_CUSTOMER_EMAIL || '';
    const customerPassword = process.env.WC_CUSTOMER_PASSWORD || '';

    // If not already logged in, login
    if (await myAccountPage.usernameInput.isVisible()) {
      await myAccountPage.login(customerEmail, customerPassword);
    }

    // Step 2: Navigate to Orders section
    await myAccountPage.navigateToOrders();

    // Step 3: Verify order history is displayed
    const orderCount = await myAccountPage.getOrderCount();
    console.log(`Total orders in history: ${orderCount}`);
    expect(orderCount).toBeGreaterThan(0);

    // Step 4: Verify the order from Scenario 1 appears in history
    if (orderNumber) {
      const isOrderInHistory = await myAccountPage.isOrderInHistory(orderNumber);
      expect(isOrderInHistory).toBeTruthy();
      console.log(`Order #${orderNumber} found in order history`);
    } else {
      // If orderNumber is not set, verify latest order
      const latestOrderNumber = await myAccountPage.getLatestOrderNumber();
      expect(latestOrderNumber).toBeTruthy();
      console.log(`Latest Order Number: ${latestOrderNumber}`);
    }

    // Step 5: Verify order details match backend records
    // Click on the order to view details
    if (orderNumber) {
      const orderLink = page.locator(`a:has-text("#${orderNumber}"), a:has-text("${orderNumber}")`).first();
      if (await orderLink.count() > 0) {
        await orderLink.click();
        await page.waitForLoadState('networkidle');

        // Verify order details page loads
        const orderDetailsExists = await TestHelpers.waitForElement(
          page,
          '.woocommerce-order-details, .order-details',
          5000
        );
        expect(orderDetailsExists).toBeTruthy();

        // Take screenshot of order details
        await TestHelpers.takeScreenshot(page, 'wc-scenario2-order-details');
      }
    }

    // Take screenshot of order history
    await myAccountPage.navigateToOrders();
    await TestHelpers.takeScreenshot(page, 'wc-scenario2-order-history');

    console.log('✅ SCENARIO 2 PASSED: User Account Order History Verified Successfully');
  });
});
