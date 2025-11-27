# ⚡ Quick Reference Card

## 🚀 Quick Commands

```bash
# Setup
npm install
npx playwright install chromium
cp .env.example .env

# Run Tests
npm test                     # All tests
npm run test:flextable       # FlexTable only
npm run test:woocommerce     # WooCommerce only
npm run test:headed          # With visible browser
npm run test:ui              # Interactive UI mode
npm run test:debug           # Debug mode

# View Results
npm run test:report          # Open HTML report
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `README.md` | Main documentation |
| `QUICKSTART.md` | 5-minute setup |
| `TESTING_GUIDE.md` | Detailed guide |
| `SUBMISSION_CHECKLIST.md` | Submission help |
| `.env.example` | Environment template |
| `package.json` | Dependencies |
| `playwright.config.ts` | Playwright config |

## 📂 Project Structure

```
wppool/
├── pages/           # 11 Page Objects
├── tests/           # Test specs
│   ├── flextable/   # 9 test cases
│   └── woocommerce/ # 2 scenarios
├── utils/           # Helpers
└── .github/         # CI/CD & templates
```

## 🧪 Test Coverage

### FlexTable (9 Tests)
1. WordPress Login
2. Plugin Activation
3. Navigate Dashboard
4. Create Table
5. Shortcode Display
6. Title & Description
7. Entry Info & Pagination
8. Rows Per Page & Height
9. Delete Table

### WooCommerce (2 Tests)
1. E2E Checkout Flow
2. Order History

## 🔧 Configuration

### Required .env Variables

```env
WP_BASE_URL=https://your-site.com
WP_ADMIN_USERNAME=admin
WP_ADMIN_PASSWORD=password
FLEXTABLE_GOOGLE_SHEET_URL=https://docs.google.com/...
WC_CUSTOMER_EMAIL=customer@example.com
WC_CUSTOMER_PASSWORD=password
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Login fails | Check credentials in .env |
| Element not found | Run in headed mode to see UI |
| Tests timeout | Increase timeout in config |
| Plugin not found | Install FlexTable plugin |

## 📊 Test Results Location

- HTML Report: `test-results/html-report/`
- Screenshots: `test-results/screenshots/`
- JSON Results: `test-results/results.json`

## 🎬 Recording Video

1. Show project structure
2. Explain POM architecture
3. Run tests (blur credentials!)
4. Show results
5. Demonstrate GitHub issues
6. Show CI/CD workflow

Duration: 5-15 minutes

## 📤 Submission Checklist

- [ ] Tests run successfully
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub issues created
- [ ] QA report filled out
- [ ] Report exported to PDF
- [ ] Video recorded and uploaded
- [ ] Submit via Google Form

## 🔗 Important Links

- **Submission Form:** https://forms.gle/7nyM5wfUsFfxsTQX9
- **Playwright Docs:** https://playwright.dev/
- **TypeScript Docs:** https://www.typescriptlang.org/docs/

## 💡 Pro Tips

1. ✅ Test early and often
2. ✅ Document bugs immediately
3. ✅ Take screenshots for evidence
4. ✅ Use headed mode for debugging
5. ✅ Review checklist before submitting

## 📞 Quick Help

```bash
# Installation issues
npm install
npm cache clean --force
npm install

# Browser issues
npx playwright install --force chromium

# Test debugging
npx playwright test --debug
npx playwright test --headed

# View specific test
npx playwright test -g "TC1"
```

## 🏆 What Makes This Project Stand Out

1. ✅ Complete POM implementation (11 page objects)
2. ✅ All 11 test cases covered
3. ✅ CI/CD with GitHub Actions
4. ✅ 7 comprehensive documentation files
5. ✅ GitHub issue templates
6. ✅ TypeScript for type safety
7. ✅ Professional code quality
8. ✅ Security best practices

---

**Keep this reference handy while working on the assignment!**
