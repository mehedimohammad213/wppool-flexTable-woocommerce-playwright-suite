import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FlexTableDashboardPage extends BasePage {
  readonly createTableButton: Locator;
  readonly dashboardTitle: Locator;
  readonly tablesList: Locator;

  constructor(page: Page) {
    super(page);
    this.createTableButton = page.locator('button:has-text("Create New Table"), a:has-text("Create New Table"), button:has-text("Add New"), a:has-text("Add New")').first();
    this.dashboardTitle = page.locator('h1:has-text("FlexTable"), h2:has-text("FlexTable")').first();
    this.tablesList = page.locator('.wp-list-table, table.dataTable, .flextable-list, [class*="table-list"]').first();
  }

  async navigateToDashboard(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    // Try multiple possible URLs
    const possiblePaths = [
      '/wp-admin/admin.php?page=flextable',
      '/wp-admin/admin.php?page=flextable-dashboard',
      '/wp-admin/admin.php?page=flextable-tables'
    ];

    for (const path of possiblePaths) {
      await this.navigateTo(`${baseUrl}${path}`);
      await this.page.waitForTimeout(2000);

      // Check if we're on the right page
      if (await this.isDashboardLoaded()) {
        break;
      }
    }
  }

  async isDashboardLoaded(): Promise<boolean> {
    // Check for various indicators that the dashboard loaded
    const titleExists = await this.isElementVisible(this.dashboardTitle);
    const urlContainsFlextable = this.page.url().toLowerCase().includes('flextable');

    return titleExists || urlContainsFlextable;
  }

  async clickCreateNewTable(): Promise<void> {
    await this.page.waitForTimeout(2000);
    await this.clickElement(this.createTableButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getTableShortcode(tableName: string): Promise<string> {
    // Try to find shortcode in various possible locations
    const tableRow = this.page.locator(`tr:has-text("${tableName}")`).first();

    // Try different selectors for shortcode
    const shortcodeSelectors = [
      '.shortcode',
      '[class*="shortcode"]',
      'code',
      '.code',
      'input[readonly]'
    ];

    for (const selector of shortcodeSelectors) {
      const shortcodeElement = tableRow.locator(selector).first();
      if (await shortcodeElement.count() > 0) {
        const text = await shortcodeElement.textContent() || await shortcodeElement.inputValue();
        if (text && text.includes('[')) {
          return text.trim();
        }
      }
    }

    // If not found in table row, look for it on the page
    const pageShortcode = this.page.locator('code:has-text("[flextable"), input[value*="[flextable"]').first();
    if (await pageShortcode.count() > 0) {
      return await pageShortcode.textContent() || await pageShortcode.inputValue() || '';
    }

    return '';
  }

  async isTableInList(tableName: string): Promise<boolean> {
    const tableRow = this.page.locator(`tr:has-text("${tableName}"), div:has-text("${tableName}"), li:has-text("${tableName}")`);
    return await tableRow.count() > 0;
  }

  async deleteTable(tableName: string): Promise<void> {
    const tableRow = this.page.locator(`tr:has-text("${tableName}")`).first();

    // Try different delete button selectors
    const deleteButton = tableRow.locator('a:has-text("Delete"), a:has-text("Trash"), button:has-text("Delete"), .delete').first();

    await this.clickElement(deleteButton);

    // Handle confirmation dialog if present
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async navigateToEditTable(tableName: string): Promise<void> {
    const tableRow = this.page.locator(`tr:has-text("${tableName}")`).first();
    const editButton = tableRow.locator('a:has-text("Edit"), button:has-text("Edit")').first();

    await this.clickElement(editButton);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }
}
