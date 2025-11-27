const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function generatePDFReport() {
  console.log('🚀 Starting PDF report generation...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Get the HTML report path
  const htmlReportPath = path.join(__dirname, 'test-results', 'html-report', 'index.html');

  // Check if HTML report exists
  if (!fs.existsSync(htmlReportPath)) {
    console.error('❌ HTML report not found at:', htmlReportPath);
    console.error('Please run tests first: npm test');
    process.exit(1);
  }

  console.log('📄 Found HTML report:', htmlReportPath);

  // Navigate to the HTML report
  await page.goto(`file://${htmlReportPath}`, { waitUntil: 'networkidle' });

  // Wait a bit for any dynamic content to load
  await page.waitForTimeout(2000);

  // Generate PDF
  const pdfPath = path.join(__dirname, 'test-results', 'test-report.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });

  console.log('✅ PDF report generated successfully:', pdfPath);

  // Also generate a detailed summary report
  const results = require('./test-results/results.json');

  // Flatten nested suites structure for summary
  function getAllSpecs(suite) {
    let specs = [];
    if (suite.specs && suite.specs.length > 0) {
      specs = [...suite.specs];
    }
    if (suite.suites && suite.suites.length > 0) {
      suite.suites.forEach(nestedSuite => {
        specs = [...specs, ...getAllSpecs(nestedSuite)];
      });
    }
    return specs;
  }

  const allSpecs = results.suites.flatMap(suite => getAllSpecs(suite));
  const passed = allSpecs.filter(spec => spec.tests[0]?.results[0]?.status === 'passed').length;
  const failed = allSpecs.filter(spec => spec.tests[0]?.results[0]?.status === 'failed').length;

  const summaryPDF = await generateSummaryPDF(browser, results);

  await browser.close();

  console.log('');
  console.log('📊 Report Summary:');
  console.log('==================');
  console.log(`Total Tests: ${allSpecs.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('');
  console.log('📁 Generated Reports:');
  console.log(`  - HTML: ${htmlReportPath}`);
  console.log(`  - PDF (Full): ${pdfPath}`);
  console.log(`  - PDF (Summary): ${summaryPDF}`);
  console.log('');
}

async function generateSummaryPDF(browser, results) {
  const page = await browser.newPage();

  // Flatten nested suites structure
  function getAllSpecs(suite) {
    let specs = [];
    if (suite.specs && suite.specs.length > 0) {
      specs = [...suite.specs];
    }
    if (suite.suites && suite.suites.length > 0) {
      suite.suites.forEach(nestedSuite => {
        specs = [...specs, ...getAllSpecs(nestedSuite)];
      });
    }
    return specs;
  }

  const allSpecs = results.suites.flatMap(suite => getAllSpecs(suite));

  // Get test statistics
  const passed = allSpecs.filter(spec => spec.tests[0]?.results[0]?.status === 'passed').length;
  const failed = allSpecs.filter(spec => spec.tests[0]?.results[0]?.status === 'failed').length;
  const skipped = allSpecs.filter(spec => spec.tests[0]?.results[0]?.status === 'skipped').length;
  const total = allSpecs.length;
  const duration = allSpecs.reduce((acc, spec) =>
    acc + (spec.tests[0]?.results[0]?.duration || 0), 0);

  // Generate test case details
  let testCaseRows = '';
  allSpecs.forEach(spec => {
    const test = spec.tests[0];
    const result = test?.results[0];
    const status = result?.status || 'unknown';
    const statusEmoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
    const statusColor = status === 'passed' ? '#10b981' : status === 'failed' ? '#ef4444' : '#6b7280';
    const durationMs = result?.duration || 0;
    const durationSec = (durationMs / 1000).toFixed(2);

    testCaseRows += `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${spec.title}</td>
        <td style="padding: 12px; text-align: center;">
          <span style="color: ${statusColor}; font-weight: 600;">${statusEmoji} ${status.toUpperCase()}</span>
        </td>
        <td style="padding: 12px; text-align: center;">${durationSec}s</td>
      </tr>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Report Summary</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          background: #f9fafb;
          color: #1f2937;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3b82f6;
        }
        .header h1 {
          font-size: 32px;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .header p {
          color: #6b7280;
          font-size: 14px;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-align: center;
        }
        .stat-card h3 {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-card p {
          font-size: 36px;
          font-weight: bold;
        }
        .stat-card.total p { color: #3b82f6; }
        .stat-card.passed p { color: #10b981; }
        .stat-card.failed p { color: #ef4444; }
        .stat-card.duration p { color: #8b5cf6; font-size: 28px; }
        .test-results {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .test-results h2 {
          padding: 20px;
          background: #f3f4f6;
          font-size: 18px;
          border-bottom: 2px solid #e5e7eb;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #f9fafb;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        th:nth-child(2), th:nth-child(3) {
          text-align: center;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧪 WPPOOL QA - Test Automation Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>

      <div class="summary">
        <div class="stat-card total">
          <h3>Total Tests</h3>
          <p>${total}</p>
        </div>
        <div class="stat-card passed">
          <h3>Passed</h3>
          <p>${passed}</p>
        </div>
        <div class="stat-card failed">
          <h3>Failed</h3>
          <p>${failed}</p>
        </div>
        <div class="stat-card duration">
          <h3>Duration</h3>
          <p>${(duration / 1000).toFixed(1)}s</p>
        </div>
      </div>

      <div class="test-results">
        <h2>📋 Test Case Details</h2>
        <table>
          <thead>
            <tr>
              <th>Test Case</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${testCaseRows}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p><strong>WPPOOL QA Assignment</strong> - Automation Test Suite</p>
        <p>Framework: Playwright with TypeScript | Design Pattern: Page Object Model (POM)</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(1000);

  const summaryPdfPath = path.join(__dirname, 'test-results', 'test-report-summary.pdf');
  await page.pdf({
    path: summaryPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    }
  });

  await page.close();
  return summaryPdfPath;
}

generatePDFReport().catch(error => {
  console.error('❌ Error generating PDF report:', error);
  process.exit(1);
});
