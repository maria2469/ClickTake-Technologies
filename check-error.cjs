const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.toString());
  });
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });
  await page.goto('http://localhost:8080/admin', { waitUntil: 'networkidle2' });
  
  // Wait a bit for React to render
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Click CRM tab if not already on it
  try {
    const tabs = await page.$$('button');
    for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && text.includes('Lead CRM')) {
        console.log('Found CRM tab, clicking...');
        await tab.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (e) {
    console.error('Error clicking CRM tab:', e);
  }
  
  await browser.close();
})();
