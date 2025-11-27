# 🚀 Quick Start Guide

Get up and running with the WPPOOL QA test suite in 5 minutes!

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] WordPress site with admin access
- [ ] FlexTable plugin installed on WordPress
- [ ] WooCommerce plugin installed and configured
- [ ] At least 2 products in WooCommerce shop
- [ ] Public Google Sheet for FlexTable testing

## 5-Minute Setup

### 1. Install Dependencies (2 minutes)

```bash
cd /home/dev2/Documents/wppool

# Install Node packages
npm install

# Install Playwright browsers
npx playwright install chromium
```

### 2. Configure Environment (2 minutes)

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your credentials
nano .env  # or use your preferred editor
```

**Required values:**
```env
WP_BASE_URL=https://your-site.com
WP_ADMIN_USERNAME=admin
WP_ADMIN_PASSWORD=your-password
FLEXTABLE_GOOGLE_SHEET_URL=https://docs.google.com/spreadsheets/d/YOUR-SHEET-ID/edit
WC_CUSTOMER_EMAIL=customer@example.com
WC_CUSTOMER_PASSWORD=customer-password
```

### 3. Run Tests (1 minute)

```bash
# Run all tests
npm test

# Or run specific suite
npm run test:flextable
npm run test:woocommerce
```

## 🎯 What Gets Tested

### ✅ FlexTable (9 Test Cases)
- WordPress login
- Plugin activation
- Table creation from Google Sheet
- Shortcode display
- Layout customization
- Styling options
- Table deletion

### ✅ WooCommerce (2 Scenarios)
- Complete checkout flow
- Order history verification

## 📊 View Results

After tests complete:

```bash
# Open HTML report
npm run test:report
```

Results are also available in:
- `test-results/html-report/`
- `test-results/screenshots/`
- `test-results/results.json`

## 🎬 Running Specific Tests

```bash
# Run with visible browser
npm run test:headed

# Run in UI mode (interactive)
npm run test:ui

# Debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/flextable/flextable.spec.ts

# Run single test by name
npx playwright test -g "TC1: Verify WordPress Login"
```

## 🐛 Quick Troubleshooting

### Tests fail immediately?
✅ Check `.env` file credentials
✅ Verify WordPress site is accessible
✅ Ensure plugins are installed

### "Element not found" errors?
✅ Check if WordPress uses custom theme
✅ Verify plugin versions match expected
✅ Try running in headed mode to see UI

### Login test fails?
✅ Try logging in manually first
✅ Check for CAPTCHA or 2FA
✅ Verify admin username (not email)

### FlexTable tests fail?
✅ Ensure Google Sheet is public
✅ Verify FlexTable plugin is activated
✅ Check plugin version compatibility

### WooCommerce tests fail?
✅ Ensure at least 2 products exist
✅ Verify products are published
✅ Check if customer account exists
✅ Verify payment methods are enabled

## 📝 Next Steps

1. ✅ Review test results in HTML report
2. 📸 Check screenshots in `test-results/screenshots/`
3. 🐛 Report bugs using GitHub Issues
4. 📚 Read [TESTING_GUIDE.md](TESTING_GUIDE.md) for details
5. 🤝 Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## 🎓 Learning Resources

- **Playwright Docs:** https://playwright.dev/
- **Page Object Model:** https://playwright.dev/docs/pom
- **TypeScript Basics:** https://www.typescriptlang.org/docs/handbook/intro.html

## ⚡ Pro Tips

1. **Run tests one suite at a time** when debugging
2. **Use headed mode** (`--headed`) to see what's happening
3. **Take screenshots** liberally for documentation
4. **Check browser console** for JavaScript errors
5. **Use Playwright Inspector** for debugging selectors

```bash
# Open Playwright Inspector
npx playwright test --debug
```

## 🆘 Need Help?

1. Check [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Review [README.md](README.md)
3. Search existing [GitHub Issues](https://github.com/yourusername/wppool-qa-assignment/issues)
4. Create a new issue with details

## ✨ You're All Set!

You now have a fully functional test automation suite. Happy testing! 🎉

---

**For detailed information, see [README.md](README.md)**
