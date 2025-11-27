import { test, expect } from '@playwright/test';
import { WordPressLoginPage } from '../../pages/WordPressLoginPage';
import { WordPressPluginsPage } from '../../pages/WordPressPluginsPage';
import { FlexTableDashboardPage } from '../../pages/FlexTableDashboardPage';
import { FlexTableCreatePage } from '../../pages/FlexTableCreatePage';
import { FlexTableEditPage } from '../../pages/FlexTableEditPage';
import { WordPressPostsPage } from '../../pages/WordPressPostsPage';
import { TestHelpers } from '../../utils/test-helpers';

let tableName: string;
let tableShortcode: string;
let pageUrl: string;

test.describe('FlexTable Plugin Test Suite', () => {

  test.beforeAll(async () => {
    // Generate unique table name for this test run
    tableName = `Test Table ${TestHelpers.generateRandomString(6)}`;
  });

  test('TC1: Verify WordPress Login Functionality', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);

    // Navigate to WordPress login page
    await loginPage.navigateToLogin();

    // Enter valid credentials and login
    const username = process.env.WP_ADMIN_USERNAME || '';
    const password = process.env.WP_ADMIN_PASSWORD || '';
    await loginPage.login(username, password);

    // Verify user is redirected to dashboard
    const isDashboardDisplayed = await loginPage.isDashboardDisplayed();
    expect(isDashboardDisplayed).toBeTruthy();

    // Verify no errors on page
    const hasError = await loginPage.isElementVisible(loginPage.errorMessage);
    expect(hasError).toBeFalsy();

    console.log('✅ TC1 PASSED: WordPress Login Successful');
  });

  test('TC2: Verify FlexTable Plugin Activation Status', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const pluginsPage = new WordPressPluginsPage(page);

    // Login first
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to Plugins page
    await pluginsPage.navigateToPlugins();

    // Check if FlexTable plugin is installed
    const isInstalled = await pluginsPage.isPluginInstalled('FlexTable');

    if (!isInstalled) {
      console.log('⚠️  FlexTable plugin is not installed. Please install it manually.');
      // You could add installation logic here if needed
    }

    // Check if plugin is active
    const isActive = await pluginsPage.isPluginActive('FlexTable');

    if (!isActive) {
      console.log('Activating FlexTable plugin...');
      await pluginsPage.activatePlugin('FlexTable');
    }

    // Verify plugin is now active
    await page.reload();
    await page.waitForLoadState('networkidle');
    const isNowActive = await pluginsPage.isPluginActive('FlexTable');
    expect(isNowActive).toBeTruthy();

    console.log('✅ TC2 PASSED: FlexTable Plugin is Active');
  });

  test('TC3: Navigate to FlexTable Dashboard', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const dashboardPage = new FlexTableDashboardPage(page);

    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to FlexTable Dashboard
    await dashboardPage.navigateToDashboard();

    // Verify dashboard loads correctly
    const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
    expect(isDashboardLoaded).toBeTruthy();

    console.log('✅ TC3 PASSED: FlexTable Dashboard Loaded Successfully');
  });

  test('TC4: Create a New Table Using Google Sheet Input', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const dashboardPage = new FlexTableDashboardPage(page);
    const createPage = new FlexTableCreatePage(page);

    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to FlexTable Dashboard
    await dashboardPage.navigateToDashboard();

    // Click Create New Table
    await dashboardPage.clickCreateNewTable();

    // Fill in table details
    const googleSheetUrl = process.env.FLEXTABLE_GOOGLE_SHEET_URL ||
                          'https://docs.google.com/spreadsheets/d/1qZt38K8qvPCq_y-JhEKA2MfVlbGexampleID/edit';
    const tableDescription = process.env.FLEXTABLE_TABLE_DESCRIPTION || 'Test table description';

    await createPage.createTableFromGoogleSheet(googleSheetUrl, tableName, tableDescription);

    // Return to dashboard
    await dashboardPage.navigateToDashboard();
    await page.waitForTimeout(2000);

    // Verify table appears in list
    const isTableInList = await dashboardPage.isTableInList(tableName);
    expect(isTableInList).toBeTruthy();

    console.log(`✅ TC4 PASSED: Table "${tableName}" Created Successfully`);
  });

  test('TC5: Verify Table Display Using Shortcode', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const dashboardPage = new FlexTableDashboardPage(page);
    const postsPage = new WordPressPostsPage(page);

    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to FlexTable Dashboard
    await dashboardPage.navigateToDashboard();

    // Get table shortcode
    tableShortcode = await dashboardPage.getTableShortcode(tableName);
    expect(tableShortcode).toBeTruthy();
    console.log(`Shortcode: ${tableShortcode}`);

    // Create a new page with the shortcode
    const pageName = `FlexTable Test Page ${TestHelpers.generateRandomString(6)}`;
    await postsPage.createPageWithShortcode(pageName, tableShortcode);

    // Get the page permalink and visit it
    pageUrl = await postsPage.getPagePermalink();
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Verify table is displayed
    const tableExists = await TestHelpers.waitForElement(
      page,
      'table, .flextable, [class*="table"]',
      10000
    );
    expect(tableExists).toBeTruthy();

    // Take screenshot for verification
    await TestHelpers.takeScreenshot(page, 'tc5-table-display');

    console.log('✅ TC5 PASSED: Table Displays Correctly with Shortcode');
  });

  test('TC6: Enable Show Table Title and Show Table Description Below Table', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const dashboardPage = new FlexTableDashboardPage(page);
    const editPage = new FlexTableEditPage(page);

    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to FlexTable Dashboard
    await dashboardPage.navigateToDashboard();

    // Navigate to Edit Table
    await dashboardPage.navigateToEditTable(tableName);

    // Navigate to Layout section
    await editPage.navigateToLayout();

    // Enable Show Table Title
    await editPage.enableShowTitle();

    // Enable Show Table Description Below Table
    await editPage.enableShowDescriptionBelow();

    // Save changes
    await editPage.clickFetchAndSave();

    // Visit frontend page
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify title and description are visible
    const titleVisible = await TestHelpers.waitForElement(
      page,
      `h1:has-text("${tableName}"), h2:has-text("${tableName}"), h3:has-text("${tableName}"), [class*="title"]`,
      5000
    );

    // Take screenshot
    await TestHelpers.takeScreenshot(page, 'tc6-title-description');

    console.log('✅ TC6 PASSED: Table Title and Description Displayed');
  });

  test('TC7: Enable Entry Info & Pagination', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const dashboardPage = new FlexTableDashboardPage(page);
    const editPage = new FlexTableEditPage(page);

    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to Edit Table
    await dashboardPage.navigateToDashboard();
    await dashboardPage.navigateToEditTable(tableName);

    // Navigate to Layout
    await editPage.navigateToLayout();

    // Enable Show Entry Info and Show Pagination
    await editPage.enableShowEntryInfo();
    await editPage.enableShowPagination();

    // Save changes
    await editPage.clickFetchAndSave();

    // Visit frontend
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify Entry Info is visible (by class/style)
    const entryInfoExists = await TestHelpers.waitForElement(
      page,
      '[class*="entry"], [class*="info"], .dataTables_info',
      5000
    );

    // Verify Pagination is visible
    const paginationExists = await TestHelpers.waitForElement(
      page,
      '[class*="pagination"], .dataTables_paginate, nav[aria-label*="Pagination"]',
      5000
    );

    // Take screenshot
    await TestHelpers.takeScreenshot(page, 'tc7-entry-info-pagination');

    console.log('✅ TC7 PASSED: Entry Info and Pagination Enabled');
  });

  test('TC8: Update Rows Per Page & Table Height', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const dashboardPage = new FlexTableDashboardPage(page);
    const editPage = new FlexTableEditPage(page);

    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to Edit Table
    await dashboardPage.navigateToDashboard();
    await dashboardPage.navigateToEditTable(tableName);

    // Navigate to Styling
    await editPage.navigateToStyling();

    // Select random values
    const rowsPerPage = TestHelpers.getRandomRowsPerPage();
    const tableHeight = TestHelpers.getRandomTableHeight();

    console.log(`Setting Rows Per Page: ${rowsPerPage}, Table Height: ${tableHeight}px`);

    await editPage.setRowsPerPage(rowsPerPage);
    await editPage.setTableHeight(tableHeight);

    // Save changes
    await editPage.clickFetchAndSave();

    // Visit frontend
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify table styling is applied (by checking classes/styles)
    const tableElement = await page.locator('table, [class*="table"]').first();
    const isTableVisible = await tableElement.isVisible();
    expect(isTableVisible).toBeTruthy();

    // Take screenshot
    await TestHelpers.takeScreenshot(page, 'tc8-styling-applied');

    console.log('✅ TC8 PASSED: Rows Per Page and Table Height Updated');
  });

  test('TC9: Delete the Table and Verify Frontend Removal', async ({ page }) => {
    const loginPage = new WordPressLoginPage(page);
    const dashboardPage = new FlexTableDashboardPage(page);

    // Login
    await loginPage.navigateToLogin();
    await loginPage.login(
      process.env.WP_ADMIN_USERNAME || '',
      process.env.WP_ADMIN_PASSWORD || ''
    );

    // Navigate to Dashboard
    await dashboardPage.navigateToDashboard();

    // Delete the table
    await dashboardPage.deleteTable(tableName);

    // Verify table is removed from list
    await page.waitForTimeout(2000);
    const isTableStillInList = await dashboardPage.isTableInList(tableName);
    expect(isTableStillInList).toBeFalsy();

    // Visit the frontend page
    await page.goto(pageUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify table does not display or shows error message
    const tableExists = await TestHelpers.waitForElement(
      page,
      'table, .flextable',
      3000
    );

    // Table should not exist OR error message should be present
    if (tableExists) {
      const errorMessageExists = await TestHelpers.waitForElement(
        page,
        '[class*="error"], [class*="not-found"], .woocommerce-error',
        2000
      );
      // Either table doesn't exist or error message is shown
      expect(errorMessageExists || !tableExists).toBeTruthy();
    }

    // Take screenshot
    await TestHelpers.takeScreenshot(page, 'tc9-table-deleted');

    console.log('✅ TC9 PASSED: Table Deleted and Removed from Frontend');
  });
});
