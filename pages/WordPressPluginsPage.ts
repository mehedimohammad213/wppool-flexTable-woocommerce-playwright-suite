import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WordPressPluginsPage extends BasePage {
  readonly pluginSearchInput: Locator;
  readonly activateButton: Locator;
  readonly deactivateButton: Locator;
  readonly pluginActivatedNotice: Locator;

  constructor(page: Page) {
    super(page);
    this.pluginSearchInput = page.locator('#plugin-search-input');
    this.activateButton = page.locator('text=Activate');
    this.deactivateButton = page.locator('text=Deactivate');
    this.pluginActivatedNotice = page.locator('.notice-success');
  }

  async navigateToPlugins(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    await this.navigateTo(`${baseUrl}/wp-admin/plugins.php`);
    await this.waitForPageLoad();
  }

  async searchPlugin(pluginName: string): Promise<void> {
    await this.fillInput(this.pluginSearchInput, pluginName);
    await this.page.waitForTimeout(1000);
  }

  async isPluginActive(pluginName: string): Promise<boolean> {
    const pluginRow = this.page.locator(`tr[data-plugin*="${pluginName.toLowerCase()}"], tr:has-text("${pluginName}")`).first();

    if (await pluginRow.count() === 0) {
      return false;
    }

    const deactivateLink = pluginRow.locator('a:has-text("Deactivate")');
    return await deactivateLink.count() > 0;
  }

  async activatePlugin(pluginName: string): Promise<void> {
    const pluginRow = this.page.locator(`tr:has-text("${pluginName}")`).first();
    const activateLink = pluginRow.locator('a:has-text("Activate")');

    if (await activateLink.count() > 0) {
      await activateLink.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
    }
  }

  async isPluginInstalled(pluginName: string): Promise<boolean> {
    const pluginRow = this.page.locator(`tr:has-text("${pluginName}")`);
    return await pluginRow.count() > 0;
  }
}
