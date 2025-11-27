# WPPOOL QA Assignment - Automation Test Suite

[![Playwright Tests](https://github.com/yourusername/wppool-qa-assignment/actions/workflows/playwright-tests.yml/badge.svg)](https://github.com/yourusername/wppool-qa-assignment/actions/workflows/playwright-tests.yml)

## 📋 Overview

This repository contains an **Automation Test Suite** built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** design pattern. The test suite covers:

1. **FlexTable Plugin** - WordPress plugin for creating tables from Google Sheets
2. **WooCommerce** - E-commerce checkout and order management

## 🎯 Test Coverage

### Part A: FlexTable Plugin (9 Test Cases)

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC1 | Verify WordPress Login Functionality | ✅ |
| TC2 | Verify FlexTable Plugin Activation Status | ✅ |
| TC3 | Navigate to FlexTable Dashboard | ✅ |
| TC4 | Create a New Table Using Google Sheet Input | ✅ |
| TC5 | Verify Table Display Using Shortcode | ✅ |
| TC6 | Enable 'Show Table Title' and 'Show Table Description Below Table' | ✅ |
| TC7 | Enable Entry Info & Pagination | ✅ |
| TC8 | Update 'Rows Per Page & Table Height' | ✅ |
| TC9 | Delete the Table and Verify Frontend Removal | ✅ |

### Part B: WooCommerce (2 Test Scenarios)

| Scenario | Description | Status |
|----------|-------------|--------|
| Scenario 1 | End-to-End Checkout Flow | ✅ |
| Scenario 2 | User Account Order History | ✅ |

## 🏗️ Project Structure

```
wppool/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml    # GitHub Actions workflow
├── pages/                          # Page Object Model classes
│   ├── BasePage.ts
│   ├── WordPressLoginPage.ts
│   ├── WordPressPluginsPage.ts
│   ├── WordPressPostsPage.ts
│   ├── FlexTableDashboardPage.ts
│   ├── FlexTableCreatePage.ts
│   ├── FlexTableEditPage.ts
│   ├── WooCommerceShopPage.ts
│   ├── WooCommerceCartPage.ts
│   ├── WooCommerceCheckoutPage.ts
│   └── WooCommerceMyAccountPage.ts
├── tests/
│   ├── flextable/
│   │   └── flextable.spec.ts       # FlexTable test cases
│   └── woocommerce/
│       └── woocommerce.spec.ts     # WooCommerce test scenarios
├── utils/
│   └── test-helpers.ts             # Helper functions and utilities
├── test-results/                   # Test execution results
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **WordPress site** with admin access
- **FlexTable plugin** installed
- **WooCommerce plugin** installed and configured

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/wppool-qa-assignment.git
cd wppool-qa-assignment
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers**

```bash
npx playwright install chromium
```

4. **Configure environment variables**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file and add your WordPress and WooCommerce credentials:

```env
# WordPress Credentials
WP_BASE_URL=https://your-wordpress-site.com
WP_ADMIN_USERNAME=your_admin_username
WP_ADMIN_PASSWORD=your_admin_password

# FlexTable Plugin Settings
FLEXTABLE_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/your-sheet-id/edit
FLEXTABLE_TABLE_TITLE=Test Table Title
FLEXTABLE_TABLE_DESCRIPTION=This is a test table description

# WooCommerce Settings
WC_CUSTOMER_EMAIL=customer@example.com
WC_CUSTOMER_PASSWORD=customer_password
WC_CUSTOMER_FIRST_NAME=John
WC_CUSTOMER_LAST_NAME=Doe
WC_BILLING_ADDRESS=123 Main Street
WC_BILLING_CITY=New York
WC_BILLING_STATE=NY
WC_BILLING_POSTCODE=10001
WC_BILLING_PHONE=1234567890

# Test Configuration
HEADLESS=true
TIMEOUT=30000
VIDEO_ON_FAILURE=true
```

> **⚠️ Important:** Never commit the `.env` file to version control. It's already included in `.gitignore`.

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run tests in headed mode (with browser UI)

```bash
npm run test:headed
```

### Run tests with Playwright UI mode

```bash
npm run test:ui
```

### Run specific test suite

**FlexTable tests only:**
```bash
npm run test:flextable
```

**WooCommerce tests only:**
```bash
npm run test:woocommerce
```

### Debug mode

```bash
npm run test:debug
```

### View test report

```bash
npm run test:report
```

## 🤖 GitHub Actions CI/CD

The repository includes a GitHub Actions workflow that automatically runs tests on:
- Push to `main`, `master`, or `develop` branches
- Pull requests
- Manual trigger (workflow_dispatch)

### Setting up GitHub Actions

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**

2. Add the following secrets:
   - `WP_BASE_URL`
   - `WP_ADMIN_USERNAME`
   - `WP_ADMIN_PASSWORD`
   - `FLEXTABLE_GOOGLE_SHEET_URL`
   - `WC_CUSTOMER_EMAIL`
   - `WC_CUSTOMER_PASSWORD`

3. The workflow will run automatically on push/PR, or manually from the **Actions** tab

## 📊 Test Reports

After test execution, reports are generated in:
- **HTML Report:** `test-results/html-report/`
- **JSON Report:** `test-results/results.json`
- **Screenshots:** `test-results/screenshots/`

View the HTML report:

```bash
npm run test:report
```

## 🐛 Bug Reporting

Bugs and issues found during testing are tracked using **GitHub Issues** with appropriate labels:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `priority:high` - High priority issue
- `priority:medium` - Medium priority issue
- `priority:low` - Low priority issue
- `severity:critical` - Critical severity
- `severity:major` - Major severity
- `severity:minor` - Minor severity

## 🏆 Best Practices Implemented

- ✅ **Page Object Model (POM)** - Clean separation of test logic and page interactions
- ✅ **TypeScript** - Type safety and better IDE support
- ✅ **Environment Variables** - Secure credential management
- ✅ **Reusable Utilities** - Helper functions for common operations
- ✅ **Comprehensive Assertions** - Validates expected vs actual behavior
- ✅ **Screenshots on Failure** - Automatic screenshot capture for debugging
- ✅ **CI/CD Integration** - Automated test execution with GitHub Actions
- ✅ **Detailed Reporting** - HTML and JSON reports with test results

## 🔧 Troubleshooting

### Common Issues

**Issue:** Tests fail with "Element not found"
- **Solution:** Check if the WordPress site is accessible and plugins are activated

**Issue:** Login fails
- **Solution:** Verify credentials in `.env` file are correct

**Issue:** FlexTable tests fail
- **Solution:** Ensure FlexTable plugin is installed and activated

**Issue:** WooCommerce tests fail
- **Solution:** Verify WooCommerce is installed with at least one product

### Debug Mode

Run tests in debug mode to step through execution:

```bash
npm run test:debug
```

## 📝 Notes

1. **Test Data:** The tests create and delete test data (tables, pages, orders) during execution
2. **Google Sheets:** For FlexTable tests, ensure the Google Sheet URL is publicly accessible
3. **WooCommerce Products:** Ensure your WooCommerce shop has at least 2 published products
4. **Test Order:** Tests in the FlexTable suite must run in order as they depend on previous test states

## 📞 Support

For questions or issues, please:
1. Check the troubleshooting section above
2. Review existing GitHub Issues
3. Create a new GitHub Issue with detailed information

## 📄 License

MIT License

---

**Author:** WPPOOL QA Candidate
**Date:** November 2025
**Framework:** Playwright with TypeScript
**Design Pattern:** Page Object Model (POM)
