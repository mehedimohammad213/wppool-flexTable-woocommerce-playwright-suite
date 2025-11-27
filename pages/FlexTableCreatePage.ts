import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FlexTableCreatePage extends BasePage {
  readonly googleSheetUrlInput: Locator;
  readonly tableNameInput: Locator;
  readonly tableDescriptionInput: Locator;
  readonly fetchAndSaveButton: Locator;
  readonly saveButton: Locator;
  readonly successNotice: Locator;

  constructor(page: Page) {
    super(page);
    // Multiple possible selectors for Google Sheet URL
    this.googleSheetUrlInput = page.locator(
      'input[name*="google"], input[name*="sheet"], input[placeholder*="Google"], input[placeholder*="URL"], input[type="url"]'
    ).first();

    this.tableNameInput = page.locator(
      'input[name*="title"], input[name*="name"], input[placeholder*="Table Title"], input[placeholder*="Table Name"]'
    ).first();

    this.tableDescriptionInput = page.locator(
      'textarea[name*="description"], textarea[placeholder*="Description"], input[name*="description"]'
    ).first();

    this.fetchAndSaveButton = page.locator(
      'button:has-text("Fetch & Save"), button:has-text("Fetch"), button:has-text("Save"), button[type="submit"]'
    ).first();

    this.saveButton = page.locator(
      'button:has-text("Save"), button:has-text("Update"), input[value="Save"]'
    ).first();

    this.successNotice = page.locator('.notice-success, .success, [class*="success"]');
  }

  async fillGoogleSheetUrl(url: string): Promise<void> {
    await this.page.waitForTimeout(2000);
    await this.fillInput(this.googleSheetUrlInput, url);
  }

  async fillTableName(name: string): Promise<void> {
    await this.fillInput(this.tableNameInput, name);
  }

  async fillTableDescription(description: string): Promise<void> {
    await this.fillInput(this.tableDescriptionInput, description);
  }

  async clickFetchAndSave(): Promise<void> {
    await this.clickElement(this.fetchAndSaveButton);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
  }

  async createTableFromGoogleSheet(url: string, title: string, description: string): Promise<void> {
    await this.fillGoogleSheetUrl(url);
    await this.fillTableName(title);
    await this.fillTableDescription(description);
    await this.clickFetchAndSave();
  }

  async isSuccessNoticeDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.successNotice);
  }
}
