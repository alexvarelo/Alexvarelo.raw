const puppeteer = require('puppeteer');

async function takeScreenshot(url, path) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ path, fullPage: true });
  await browser.close();
}

(async () => {
  await takeScreenshot('http://localhost:3000', 'screenshots/landing.png');
  await takeScreenshot('http://localhost:3000/collections', 'screenshots/collections.png');
  await takeScreenshot('http://localhost:3000/collections/Yny1v4mNifM', 'screenshots/collection-detail.png');
  await takeScreenshot('http://localhost:3000/statistics', 'screenshots/statistics.png');
})();