import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WordPressPostsPage extends BasePage {
  readonly addNewPageButton: Locator;
  readonly titleInput: Locator;
  readonly contentEditor: Locator;
  readonly publishButton: Locator;
  readonly viewPageLink: Locator;
  readonly blockEditorTitle: Locator;
  readonly blockEditorContent: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewPageButton = page.locator('a:has-text("Add New"), .page-title-action');
    this.titleInput = page.locator('#title, .editor-post-title__input, [placeholder*="Add title"]');
    this.contentEditor = page.locator('#content, .editor-styles-wrapper, [data-type="core/paragraph"]');
    this.publishButton = page.locator('button:has-text("Publish"), #publish');
    this.viewPageLink = page.locator('a:has-text("View Page"), a:has-text("View Post")');
    this.blockEditorTitle = page.locator('.editor-post-title__input, [aria-label*="Add title"]');
    this.blockEditorContent = page.locator('.block-editor-block-list__layout, [data-type="core/paragraph"]').first();
  }

  async navigateToPages(): Promise<void> {
    const baseUrl = process.env.WP_BASE_URL || '';
    await this.navigateTo(`${baseUrl}/wp-admin/edit.php?post_type=page`);
    await this.waitForPageLoad();
  }

  async clickAddNewPage(): Promise<void> {
    await this.clickElement(this.addNewPageButton);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
  }

  async createPageWithShortcode(pageTitle: string, shortcode: string): Promise<string> {
    await this.navigateToPages();
    await this.clickAddNewPage();

    // Handle both classic and block editor
    await this.page.waitForTimeout(2000);

    // Check if block editor is present
    const isBlockEditor = await this.blockEditorTitle.count() > 0;

    if (isBlockEditor) {
      // Block editor (Gutenberg)
      await this.blockEditorTitle.fill(pageTitle);
      await this.page.waitForTimeout(1000);

      // Click on the content area and add shortcode block
      await this.blockEditorContent.click();
      await this.page.keyboard.type(shortcode);

    } else {
      // Classic editor
      await this.fillInput(this.titleInput, pageTitle);
      await this.page.waitForTimeout(500);

      // Check if we need to switch to HTML mode
      const htmlTab = this.page.locator('button#content-html, #content-tmce');
      if (await htmlTab.count() > 0) {
        await htmlTab.click();
      }

      await this.contentEditor.fill(shortcode);
    }

    await this.page.waitForTimeout(1000);

    // Publish the page
    await this.clickElement(this.publishButton);
    await this.page.waitForTimeout(2000);

    // Click publish again if needed (block editor has two-step publish)
    const publishPanelButton = this.page.locator('.editor-post-publish-panel__header-publish-button button:has-text("Publish")');
    if (await publishPanelButton.count() > 0) {
      await publishPanelButton.click();
      await this.page.waitForTimeout(2000);
    }

    // Get the page URL
    const pageUrl = this.page.url();

    return pageUrl;
  }

  async getPagePermalink(): Promise<string> {
    // Try to get permalink from various locations
    const permalinkInput = this.page.locator('#sample-permalink, .editor-post-link__link');

    if (await permalinkInput.count() > 0) {
      return await permalinkInput.textContent() || await permalinkInput.inputValue() || '';
    }

    return this.page.url();
  }
}
