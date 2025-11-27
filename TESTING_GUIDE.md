# Testing Guide - WPPOOL QA Assignment

This guide provides detailed information about the test suite structure, execution, and best practices.

## 📚 Table of Contents

- [Test Architecture](#test-architecture)
- [Page Object Model](#page-object-model)
- [Test Execution Flow](#test-execution-flow)
- [FlexTable Tests](#flextable-tests)
- [WooCommerce Tests](#woocommerce-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🏗️ Test Architecture

### Technology Stack

- **Framework:** Playwright v1.40+
- **Language:** TypeScript 5.3+
- **Pattern:** Page Object Model (POM)
- **CI/CD:** GitHub Actions
- **Reporting:** HTML, JSON

### Design Pattern: Page Object Model (POM)

The Page Object Model is a design pattern that:
- Separates test logic from page-specific code
- Improves maintainability
- Reduces code duplication
- Makes tests more readable

#### Structure:

```
BasePage (Abstract)
    ↓
WordPressLoginPage
FlexTableDashboardPage
WooCommerceShopPage
... (other page objects)
```

## 📄 Page Object Model

### BasePage

The `BasePage` class provides common functionality:

```typescript
- navigateTo(url: string)
- clickElement(locator: Locator)
- fillInput(locator: Locator, text: string)
- getText(locator: Locator)
- isElementVisible(locator: Locator)
- waitForSelector(selector: string)
- takeScreenshot(name: string)
```

### Page Objects

Each page object represents a specific page or component:

| Page Object | Purpose |
|-------------|---------|
| `WordPressLoginPage` | WordPress admin login |
| `WordPressPluginsPage` | Plugin management |
| `WordPressPostsPage` | Creating pages/posts |
| `FlexTableDashboardPage` | FlexTable main dashboard |
| `FlexTableCreatePage` | Creating new tables |
| `FlexTableEditPage` | Editing table settings |
| `WooCommerceShopPage` | Product catalog |
| `WooCommerceCartPage` | Shopping cart |
| `WooCommerceCheckoutPage` | Checkout process |
| `WooCommerceMyAccountPage` | Customer account |

## 🔄 Test Execution Flow

### FlexTable Test Flow

```
1. Login to WordPress
2. Verify Plugin Status
3. Navigate to Dashboard
4. Create Table from Google Sheet
5. Insert Shortcode in Page
6. Verify Frontend Display
7. Modify Table Settings
8. Verify Changes on Frontend
9. Delete Table
10. Verify Removal
```

### WooCommerce Test Flow

```
Scenario 1:
1. Browse Products
2. Add to Cart
3. View Cart
4. Proceed to Checkout
5. Fill Billing Details
6. Place Order
7. Verify Order Completion
8. Verify Order in Backend

Scenario 2:
1. Login to Customer Account
2. Navigate to Orders
3. Verify Order History
4. Verify Order Details Match
```

## 🧪 FlexTable Tests

### Test Case Details

#### TC1: WordPress Login
- **Objective:** Validate admin login functionality
- **Validates:** Authentication, redirection, error handling
- **Dependencies:** None

#### TC2: Plugin Activation
- **Objective:** Ensure FlexTable plugin is active
- **Validates:** Plugin installation, activation status
- **Dependencies:** TC1

#### TC3: Dashboard Navigation
- **Objective:** Verify dashboard loads correctly
- **Validates:** Navigation, page load, UI elements
- **Dependencies:** TC1, TC2

#### TC4: Create Table
- **Objective:** Create table from Google Sheet
- **Validates:** Data import, table creation, save functionality
- **Dependencies:** TC1, TC2, TC3
- **Note:** Requires public Google Sheet URL

#### TC5: Shortcode Display
- **Objective:** Verify table renders on frontend
- **Validates:** Shortcode functionality, data accuracy, layout
- **Dependencies:** TC4
- **Note:** Creates a new WordPress page

#### TC6: Title & Description
- **Objective:** Test layout customization options
- **Validates:** Settings persistence, frontend display
- **Dependencies:** TC4, TC5

#### TC7: Entry Info & Pagination
- **Objective:** Test table bottom elements
- **Validates:** Settings application, UI elements
- **Dependencies:** TC4, TC5

#### TC8: Styling Options
- **Objective:** Test rows per page and table height
- **Validates:** Style application, responsive behavior
- **Dependencies:** TC4, TC5

#### TC9: Table Deletion
- **Objective:** Verify table removal
- **Validates:** Delete functionality, frontend cleanup
- **Dependencies:** TC4, TC5

### Sample Google Sheet

For testing FlexTable, you need a publicly accessible Google Sheet. Example format:

| Name | Email | Phone | City | Country |
|------|-------|-------|------|---------|
| John Doe | john@example.com | 123-456-7890 | New York | USA |
| Jane Smith | jane@example.com | 098-765-4321 | London | UK |
| Bob Johnson | bob@example.com | 555-123-4567 | Toronto | Canada |

**To create:**
1. Create a Google Sheet
2. Add data with headers
3. File → Share → Get link
4. Set to "Anyone with the link can view"
5. Copy the URL to `.env` file

## 🛒 WooCommerce Tests

### Scenario 1: End-to-End Checkout

**Steps:**
1. Navigate to shop
2. Add 2 products to cart
3. View cart and verify totals
4. Proceed to checkout
5. Fill billing details
6. Select payment method (COD or BACS)
7. Place order
8. Verify order confirmation
9. Check order in WooCommerce admin

**Validations:**
- Cart calculations
- Form validation
- Payment processing
- Order creation
- Backend sync

### Scenario 2: Order History

**Steps:**
1. Login to customer account
2. Navigate to orders section
3. Verify order count
4. Verify specific order exists
5. View order details
6. Validate details match

**Validations:**
- Order history display
- Order details accuracy
- Data consistency

## ✅ Best Practices

### Writing Tests

1. **Use Descriptive Names**
   ```typescript
   // Good
   test('TC1: Verify WordPress Login Functionality', async ({ page }) => {})

   // Bad
   test('login test', async ({ page }) => {})
   ```

2. **Follow AAA Pattern**
   ```typescript
   // Arrange
   const loginPage = new WordPressLoginPage(page);

   // Act
   await loginPage.login(username, password);

   // Assert
   expect(await loginPage.isLoggedIn()).toBeTruthy();
   ```

3. **Add Console Logs**
   ```typescript
   console.log('✅ TC1 PASSED: WordPress Login Successful');
   ```

4. **Take Screenshots**
   ```typescript
   await TestHelpers.takeScreenshot(page, 'test-step-name');
   ```

5. **Use Waits Appropriately**
   ```typescript
   await page.waitForLoadState('networkidle');
   await page.waitForTimeout(2000); // Use sparingly
   ```

### Creating Page Objects

1. **Extend BasePage**
   ```typescript
   export class MyPage extends BasePage {
     constructor(page: Page) {
       super(page);
     }
   }
   ```

2. **Define Locators in Constructor**
   ```typescript
   readonly myElement: Locator;

   constructor(page: Page) {
     super(page);
     this.myElement = page.locator('#element-id');
   }
   ```

3. **Create Action Methods**
   ```typescript
   async performAction(): Promise<void> {
     await this.clickElement(this.myElement);
   }
   ```

4. **Return Values When Needed**
   ```typescript
   async getElementText(): Promise<string> {
     return await this.getText(this.myElement);
   }
   ```

## 🐛 Troubleshooting

### Common Issues

#### Test Timeout
```
Error: Test timeout of 30000ms exceeded
```
**Solution:**
- Increase timeout in `playwright.config.ts`
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Check network connectivity

#### Element Not Found
```
Error: Element not found: #element-id
```
**Solution:**
- Verify selector is correct
- Check if element is in iframe
- Add wait before interaction
- Use multiple selector strategies

#### Login Fails
```
Error: Login unsuccessful
```
**Solution:**
- Verify credentials in `.env`
- Check if site is accessible
- Clear browser cookies
- Verify WordPress URL format

#### Plugin Not Found
```
Error: FlexTable plugin not found
```
**Solution:**
- Install and activate FlexTable plugin
- Verify plugin name/slug
- Check WordPress admin access

### Debug Mode

Run tests in debug mode:

```bash
# Debug all tests
npm run test:debug

# Debug specific file
npx playwright test tests/flextable/flextable.spec.ts --debug

# Run headed mode
npm run test:headed
```

### Screenshots

Screenshots are automatically captured:
- On test failure
- When explicitly called: `await TestHelpers.takeScreenshot(page, 'name')`
- Location: `test-results/screenshots/`

### Logs

Check logs for detailed information:
- Console logs during test execution
- Test results in `test-results/results.json`
- HTML report: `test-results/html-report/index.html`

## 📊 Reporting

### HTML Report

View detailed HTML report:
```bash
npm run test:report
```

Features:
- Test results overview
- Passed/Failed/Skipped counts
- Execution time
- Screenshots
- Error traces

### JSON Report

Programmatic access to results:
```javascript
const results = require('./test-results/results.json');
console.log(results.suites);
```

## 🔐 Security

### Credentials Management

- **NEVER** commit `.env` file
- Use environment variables
- Use GitHub Secrets for CI/CD
- Rotate credentials regularly
- Use minimal permissions

### Best Practices

1. Store credentials in `.env`
2. Add `.env` to `.gitignore`
3. Use `.env.example` as template
4. Document required variables
5. Use strong passwords
6. Enable 2FA where possible

## 📞 Support

For issues or questions:

1. Check this guide
2. Review [README.md](README.md)
3. Check [GitHub Issues](https://github.com/yourusername/wppool-qa-assignment/issues)
4. Create new issue with details

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)

---

**Last Updated:** November 2025
**Version:** 1.0.0
