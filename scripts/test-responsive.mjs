import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const port = 4173;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8"
};

const server = createServer((request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    const pathname = decodeURIComponent(url.pathname);
    const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const file = resolve(root, relative);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    if (!existsSync(file)) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": mime[extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(readFileSync(file));
  } catch {
    response.writeHead(400).end("Bad request");
  }
});

await new Promise((resolveListen, reject) => {
  server.once("error", reject);
  server.listen(port, "127.0.0.1", resolveListen);
});

let browser;
const failures = [];
const pageErrors = [];
const viewports = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 900 },
  { width: 640, height: 900 },
  { width: 768, height: 900 },
  { width: 900, height: 900 },
  { width: 1024, height: 900 },
  { width: 1120, height: 900 },
  { width: 1121, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000 }
];

try {
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: false
  });
  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") pageErrors.push("console: " + message.text());
  });

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "load" });
    await page.waitForFunction(() => document.querySelectorAll("#product-grid .product-card").length === 11, { timeout: 5000 });
    await page.waitForTimeout(80);

    const layout = await page.evaluate(() => {
      const rect = element => {
        const box = element.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height };
      };
      const overlaps = boxes => {
        const collisions = [];
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i];
            const b = boxes[j];
            const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (overlapX > 1 && overlapY > 1) collisions.push([i, j]);
          }
        }
        return collisions;
      };
      const nodes = [...document.querySelectorAll("#network-nodes .network-node")];
      const products = [...document.querySelectorAll("#product-grid .product-card")];
      const parts = [
        document.querySelector(".network-core"),
        ...nodes,
        document.querySelector(".hero-code-panel")
      ].filter(Boolean);
      const heroParts = parts.map(rect);
      const nodeBoxes = nodes.map(rect);
      const productBoxes = products.map(rect);
      const header = rect(document.querySelector(".site-header"));
      const headerContent = rect(document.querySelector(".header-inner"));
      const visual = document.querySelector(".hero-visual");
      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        header,
        headerContent,
        productCount: products.length,
        nodeCount: nodes.length,
        visualDisplay: getComputedStyle(visual).display,
        diagramNodePosition: nodes[0] ? getComputedStyle(nodes[0]).position : "missing",
        heroCollisions: overlaps(heroParts),
        nodeCollisions: overlaps(nodeBoxes),
        productCollisions: overlaps(productBoxes),
        headerWithinViewport: headerContent.left >= -1 && headerContent.right <= window.innerWidth + 1
      };
    });

    assert.equal(layout.productCount, 11, "Expected 11 rendered products at " + viewport.width + "px");
    assert.equal(layout.nodeCount, 7, "Expected 7 ecosystem nodes at " + viewport.width + "px");
    assert.ok(layout.documentWidth <= viewport.width + 1, "Horizontal document overflow at " + viewport.width + "px: " + layout.documentWidth);
    assert.ok(layout.bodyWidth <= viewport.width + 1, "Horizontal body overflow at " + viewport.width + "px: " + layout.bodyWidth);
    assert.ok(layout.header.left >= -1 && layout.header.right <= viewport.width + 1, "Header escapes viewport at " + viewport.width + "px");
    assert.equal(layout.headerWithinViewport, true, "Header content overflows at " + viewport.width + "px");
    assert.deepEqual(layout.nodeCollisions, [], "Product nodes overlap at " + viewport.width + "px");
    assert.deepEqual(layout.heroCollisions, [], "Hero diagram elements overlap at " + viewport.width + "px");
    assert.deepEqual(layout.productCollisions, [], "Product cards overlap at " + viewport.width + "px");
    if (viewport.width <= 1120) {
      assert.equal(layout.visualDisplay, "grid", "Tablet/mobile diagram should use grid at " + viewport.width + "px");
      assert.equal(layout.diagramNodePosition, "relative", "Tablet/mobile nodes must be in normal flow at " + viewport.width + "px");
    }
    console.log("Responsive viewport OK:", viewport.width + "x" + viewport.height);
  }

  // Interaction smoke tests at a common mobile viewport.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelectorAll("#product-grid .product-card").length === 11);

  await page.locator(".theme-toggle").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark", "Theme toggle did not switch to dark");
  await page.locator(".theme-toggle").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light", "Theme toggle did not switch back to light");

  await page.locator("#language-select").selectOption("en");
  assert.match(await page.locator("#hero-title").innerText(), /Digital infrastructure/i, "English translation did not update");
  await page.locator("#language-select").selectOption("es");
  assert.match(await page.locator("#hero-title").innerText(), /infraestructura digital/i, "Spanish translation did not restore");

  await page.locator('[data-filter="business"]').click();
  assert.equal(await page.locator("#product-grid .product-card").count(), 5, "Business filter should show five products");
  await page.locator('[data-filter="all"]').click();
  assert.equal(await page.locator("#product-grid .product-card").count(), 11, "All filter should restore the catalog");

  await page.locator(".search-open").click();
  assert.equal(await page.locator("#search-dialog").evaluate(element => element.open), true, "Global search did not open");
  await page.locator("#global-search").fill("helio");
  assert.equal(await page.locator("#search-results .search-result").count(), 1, "Live search should find Helios");
  await page.locator("#search-results .search-result").click();
  assert.equal(await page.locator("#product-dialog").evaluate(element => element.open), true, "Search result did not open product detail");
  assert.match(await page.locator("#product-dialog-content").innerText(), /Helios/, "Wrong product detail opened");
  await page.locator(".dialog-close").click();

  await page.locator(".mobile-menu-toggle").click();
  assert.equal(await page.locator("#mobile-nav").evaluate(element => element.classList.contains("is-open")), true, "Mobile navigation did not open");
  await page.locator(".mobile-access-button").click();
  assert.equal(await page.locator("#credentials-dialog").evaluate(element => element.open), true, "Credential request dialog did not open");
  assert.equal(await page.locator("#credentials-product option").count(), 12, "Credential form should include general inquiry plus all products");
  await page.locator(".credentials-close").click();

  // Mega-menu product links must open the matching product modal on desktop.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "load" });
  await page.locator(".nav-trigger").first().click();
  assert.equal(await page.locator(".nav-item.is-open").count(), 1, "Product mega-menu did not open");
  await page.locator('.mega-menu [data-open-product="hefesto"]').click();
  assert.equal(await page.locator("#product-dialog").evaluate(element => element.open), true, "Mega-menu product link did not open detail");
  assert.match(await page.locator("#product-dialog-content").innerText(), /Hefesto/, "Mega-menu opened the wrong product");

  assert.deepEqual(pageErrors, [], "Browser reported runtime errors");
  console.log("Interactive smoke tests passed: theme, language, filters, live search, product dialog, mobile nav, credential request and mega-menu.");
} catch (error) {
  failures.push(error);
} finally {
  if (browser) await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}

if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
} else {
  console.log("EcuApp responsive browser validation passed.");
}
