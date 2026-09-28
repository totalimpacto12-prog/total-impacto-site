const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {
  const outDir = path.join(__dirname, "reels");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("file://" + path.join(__dirname, "carrossel.html"));
  await page.waitForTimeout(300);

  const slides = await page.$$(".slide");
  for (let i = 0; i < slides.length; i++) {
    const num = String(i + 1).padStart(2, "0");
    await slides[i].screenshot({ path: path.join(outDir, `slide-${num}.png`) });
    console.log("Salvo:", `slide-${num}.png`);
  }

  await browser.close();
})();
