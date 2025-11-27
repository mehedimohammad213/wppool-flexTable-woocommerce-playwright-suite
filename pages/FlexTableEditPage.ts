import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FlexTableEditPage extends BasePage {
  readonly customizationTab: Locator;
  readonly layoutTab: Locator;
  readonly stylingTab: Locator;
  readonly showTitleCheckbox: Locator;
  readonly showDescriptionBelowCheckbox: Locator;
  readonly showEntryInfoCheckbox: Locator;
  readonly showPaginationCheckbox: Locator;
  readonly rowsPerPageSelect: Locator;
  readonly tableHeightInput: Locator;
  readonly fetchAndSaveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.customizationTab = page.locator('a:has-text("Customization"), button:has-text("Customization"), [href*="customization"]').first();
    this.layoutTab = page.locator('a:has-text("Layout"), button:has-text("Layout"), [href*="layout"]').first();
    this.stylingTab = page.locator('a:has-text("Styling"), button:has-text("Styling"), [href*="styling"]').first();

    // Checkboxes for various options
    this.showTitleCheckbox = page.locator('input[name*="show_title"], input[id*="show_title"], label:has-text("Show Table Title") >> input[type="checkbox"]').first();
    this.showDescriptionBelowCheckbox = page.locator('input[name*="show_description"], input[id*="show_description"], label:has-text("Show Table Description") >> input[type="checkbox"]').first();
    this.showEntryInfoCheckbox = page.locator('input[name*="entry_info"], input[id*="entry_info"], label:has-text("Show Entry Info") >> input[type="checkbox"]').first();
    this.showPaginationCheckbox = page.locator('input[name*="pagination"], input[id*="pagination"], label:has-text("Show Pagination") >> input[type="checkbox"]').first();

    this.rowsPerPageSelect = page.locator('select[name*="rows"], select[id*="rows"], select[name*="per_page"]').first();
    this.tableHeightInput = page.locator('input[name*="height"], input[id*="height"], input[placeholder*="height"]').first();

    this.fetchAndSaveButton = page.locator('button:has-text("Fetch & Save"), button:has-text("Save"), button:has-text("Update")').first();
  }

  async navigateToLayout(): Promise<void> {
    if (await this.layoutTab.count() > 0) {
      await this.clickElement(this.layoutTab);
      await this.page.waitForTimeout(1000);
    }
  }

  async navigateToStyling(): Promise<void> {
    if (await this.stylingTab.count() > 0) {
      await this.clickElement(this.stylingTab);
      await this.page.waitForTimeout(1000);
    }
  }

  async enableShowTitle(): Promise<void> {
    await this.checkCheckbox(this.showTitleCheckbox);
  }

  async enableShowDescriptionBelow(): Promise<void> {
    await this.checkCheckbox(this.showDescriptionBelowCheckbox);
  }

  async enableShowEntryInfo(): Promise<void> {
    await this.checkCheckbox(this.showEntryInfoCheckbox);
  }

  async enableShowPagination(): Promise<void> {
    await this.checkCheckbox(this.showPaginationCheckbox);
  }

  async checkCheckbox(locator: Locator): Promise<void> {
    const isChecked = await locator.isChecked();
    if (!isChecked) {
      await this.clickElement(locator);
    }
  }

  async setRowsPerPage(rows: string): Promise<void> {
    await this.rowsPerPageSelect.selectOption(rows);
  }

  async setTableHeight(height: string): Promise<void> {
    await this.fillInput(this.tableHeightInput, height);
  }

  async clickFetchAndSave(): Promise<void> {
    await this.clickElement(this.fetchAndSaveButton);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
  }
}
