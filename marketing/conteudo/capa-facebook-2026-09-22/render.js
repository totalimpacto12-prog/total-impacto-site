const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {
  const outDir = path.join(__dirname, "facebook");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1640, height: 624 } });
  await page.goto("file://" + path.join(__dirname, "carrossel.html"));
  await page.waitForTimeout(300);

  const slide = await page.$(".slide");
  await slide.screenshot({ path: path.join(outDir, "capa-facebook.png") });
  console.log("Salvo: capa-facebook.png");

  await browser.close();
})();
