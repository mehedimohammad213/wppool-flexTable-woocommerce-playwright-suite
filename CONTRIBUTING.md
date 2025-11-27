# Contributing to WPPOOL QA Assignment

Thank you for your interest in contributing to this test automation project! This document provides guidelines for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/wppool-qa-assignment/issues)
2. Use the **Bug Report** template
3. Add appropriate labels:
   - `bug` (required)
   - Priority: `priority:low`, `priority:medium`, `priority:high`
   - Severity: `severity:minor`, `severity:major`, `severity:critical`
4. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details

### Suggesting Features

1. Check if the feature has been requested in [Issues](https://github.com/yourusername/wppool-qa-assignment/issues)
2. Use the **Feature Request** template
3. Add the `enhancement` label
4. Clearly describe:
   - The problem it solves
   - Proposed solution
   - Benefits
   - Use cases

### Suggesting Test Cases

1. Use the **Test Suggestion** template
2. Add `test` and `enhancement` labels
3. Include:
   - Test objective
   - Steps to execute
   - Expected results
   - Required test data

## 💻 Development Guidelines

### Code Style

- Use **TypeScript** for all code
- Follow **Page Object Model (POM)** pattern
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Page Objects

- Create separate page objects for each page/component
- Extend `BasePage` class
- Use descriptive locator names
- Add JSDoc comments for public methods

Example:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExamplePage extends BasePage {
  readonly elementName: Locator;

  constructor(page: Page) {
    super(page);
    this.elementName = page.locator('#element-id');
  }

  /**
   * Performs an action on the page
   */
  async performAction(): Promise<void> {
    await this.clickElement(this.elementName);
  }
}
```

### Test Files

- Name test files with `.spec.ts` extension
- Group related tests in `describe` blocks
- Use clear test descriptions
- Add console logs for important steps
- Take screenshots for verification

Example:

```typescript
test.describe('Feature Name', () => {
  test('should perform expected action', async ({ page }) => {
    // Arrange
    const myPage = new MyPage(page);

    // Act
    await myPage.performAction();

    // Assert
    expect(await myPage.isActionComplete()).toBeTruthy();
  });
});
```

### Commit Messages

Use conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Adding or updating tests
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

Examples:
```
feat: add test for product search functionality
fix: correct selector for checkout button
test: add validation for order confirmation
docs: update setup instructions in README
```

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `develop`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests** to ensure they pass:
   ```bash
   npm test
   ```
5. **Commit your changes** with clear commit messages
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request** to the `develop` branch
8. Fill in the PR template with:
   - Description of changes
   - Related issues
   - Test results
   - Screenshots (if applicable)

## ✅ Checklist Before Submitting PR

- [ ] Code follows the project style guidelines
- [ ] Tests have been added/updated
- [ ] All tests pass locally
- [ ] Documentation has been updated (if needed)
- [ ] Commit messages are clear and descriptive
- [ ] No sensitive data (credentials, API keys) in code
- [ ] `.env` file is not committed

## 🧪 Testing Your Changes

Before submitting a PR:

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:flextable
npm run test:woocommerce

# Run in headed mode for debugging
npm run test:headed

# Generate report
npm run test:report
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🙏 Thank You!

Your contributions help improve the quality of this test automation project. Thank you for taking the time to contribute!
