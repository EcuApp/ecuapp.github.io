import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const publicHtml = readFileSync(resolve(root, "index.html"), "utf8");
const publicJs = readFileSync(resolve(root, "assets/site.js"), "utf8");
assert.doesNotMatch(publicHtml + publicJs, /github\.com|repositori|repository/i, "Internal repository details must not ship in public source");
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
  { width: 280, height: 760 }, { width: 300, height: 760 }, { width: 320, height: 800 },
  { width: 344, height: 800 }, { width: 360, height: 800 }, { width: 375, height: 812 },
  { width: 390, height: 844 }, { width: 414, height: 896 }, { width: 430, height: 900 },
  { width: 480, height: 900 }, { width: 520, height: 900 }, { width: 600, height: 900 },
  { width: 640, height: 900 }, { width: 641, height: 900 }, { width: 700, height: 900 },
  { width: 701, height: 900 }, { width: 760, height: 900 }, { width: 768, height: 900 },
  { width: 820, height: 900 }, { width: 900, height: 900 }, { width: 901, height: 900 },
  { width: 1024, height: 900 }, { width: 1080, height: 900 }, { width: 1120, height: 900 },
  { width: 1150, height: 900 }, { width: 1151, height: 900 }, { width: 1280, height: 900 },
  { width: 1440, height: 1000 }, { width: 1920, height: 1080 }
];

try {
  const launchOptions = { headless: true, args: ["--no-sandbox"] };
  if (process.env.PUBLIC_AUDIT_BROWSER_CHANNEL) launchOptions.channel = process.env.PUBLIC_AUDIT_BROWSER_CHANNEL;
  if (process.env.PUBLIC_AUDIT_BROWSER_EXECUTABLE) launchOptions.executablePath = process.env.PUBLIC_AUDIT_BROWSER_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
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
        productColumns: getComputedStyle(document.querySelector("#product-grid")).gridTemplateColumns.split(" ").length,
        serviceColumns: getComputedStyle(document.querySelector(".service-grid")).gridTemplateColumns.split(" ").length,
        statusTableDisplay: getComputedStyle(document.querySelector(".status-table")).display,
        mobileToggleDisplay: getComputedStyle(document.querySelector(".mobile-menu-toggle")).display,
        desktopNavDisplay: getComputedStyle(document.querySelector(".desktop-nav")).display,
        mobileAccessDisplay: getComputedStyle(document.querySelector(".mobile-access-button")).display,
        heroCodePanel: rect(document.querySelector(".hero-code-panel")),
        contactColumns: getComputedStyle(document.querySelector(".contact-band")).gridTemplateColumns.split(" ").length,
        revealCount: document.querySelectorAll(".reveal").length,
        visibleRevealCount: [...document.querySelectorAll(".reveal")].filter(element => element.classList.contains("is-visible")).length,
        statusLabels: [...document.querySelectorAll(".status-table tbody td")].filter(cell => cell.dataset.label).length,
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
    assert.ok(layout.heroCodePanel.left >= -1 && layout.heroCodePanel.right <= viewport.width + 1,
      "Hero code panel escapes viewport at " + viewport.width + "px: " + JSON.stringify(layout.heroCodePanel));
    if (viewport.width <= 700) assert.equal(layout.contactColumns, 1, "Contact block must stack into one column at " + viewport.width + "px");
    assert.ok(layout.revealCount >= 30, "Reveal targets were not initialized at " + viewport.width + "px");
    assert.deepEqual(layout.nodeCollisions, [], "Product nodes overlap at " + viewport.width + "px");
    assert.deepEqual(layout.heroCollisions, [], "Hero diagram elements overlap at " + viewport.width + "px");
    assert.deepEqual(layout.productCollisions, [], "Product cards overlap at " + viewport.width + "px");
    if (viewport.width <= 1150) {
      assert.equal(layout.visualDisplay, "grid", "Tablet/mobile diagram should use grid at " + viewport.width + "px");
      assert.equal(layout.diagramNodePosition, "relative", "Tablet/mobile nodes must be in normal flow at " + viewport.width + "px");
      assert.equal(layout.desktopNavDisplay, "none", "Desktop navigation must yield to the mobile menu at " + viewport.width + "px");
      assert.equal(layout.mobileToggleDisplay, "flex", "Mobile menu control missing at " + viewport.width + "px");
      assert.notEqual(layout.mobileAccessDisplay, "none", "Access action must remain visible in the mobile menu at " + viewport.width + "px");
    } else {
      assert.notEqual(layout.desktopNavDisplay, "none", "Desktop navigation should be visible above 1150px");
    }
    assert.equal(layout.productColumns, viewport.width <= 640 ? 1 : viewport.width <= 900 ? 2 : 3,
      "Unexpected product grid columns at " + viewport.width + "px: " + layout.productColumns);
    assert.equal(layout.serviceColumns, viewport.width <= 640 ? 1 : viewport.width <= 900 ? 2 : 3,
      "Unexpected service grid columns at " + viewport.width + "px: " + layout.serviceColumns);
    assert.equal(layout.statusTableDisplay, viewport.width <= 700 ? "block" : "table",
      "Status table should become stacked cards on small screens at " + viewport.width + "px");
    assert.equal(layout.statusLabels, 33, "Responsive table labels are missing or stale at " + viewport.width + "px");
    console.log("Responsive viewport OK:", viewport.width + "x" + viewport.height);
  }

  // Interaction smoke tests at a common mobile viewport.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelectorAll("#product-grid .product-card").length === 11);

  // Every reveal target must become visible after a normal page scroll.
  await page.evaluate(async () => {
    const targets = [...document.querySelectorAll(".reveal")];
    for (const target of targets) {
      target.scrollIntoView({ block: "center", behavior: "auto" });
      await new Promise(resolve => setTimeout(resolve, 55));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.querySelectorAll(".reveal")].every(element => element.classList.contains("is-visible")), { timeout: 6000 });
  const hiddenRevealCount = await page.evaluate(() => [...document.querySelectorAll(".reveal")].filter(element => Number(getComputedStyle(element).opacity) < 0.98).length);
  assert.equal(hiddenRevealCount, 0, "Some page sections remain visually hidden after scrolling");

  await page.locator(".theme-toggle").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark", "Theme toggle did not switch to dark");
  await page.locator(".theme-toggle").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light", "Theme toggle did not switch back to light");

  await page.locator("#language-select").selectOption("en");
  assert.match(await page.locator("#hero-title").innerText(), /Digital infrastructure/i, "English translation did not update");
  assert.equal(await page.locator(".status-table tbody td").first().getAttribute("data-label"), "Product", "Responsive table labels did not translate to English");
  await page.locator("#language-select").selectOption("es");
  assert.match(await page.locator("#hero-title").innerText(), /infraestructura digital/i, "Spanish translation did not restore");
  assert.equal(await page.locator(".status-table tbody td").first().getAttribute("data-label"), "Producto", "Responsive table labels did not restore to Spanish");

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
  assert.doesNotMatch(await page.locator("#product-dialog-content").innerText(), /github|repositorio|repository/i, "Internal source details must not appear in the public product modal");
  await page.locator(".dialog-close").click();

  await page.locator(".mobile-menu-toggle").click();
  assert.equal(await page.locator("#mobile-nav").evaluate(element => element.classList.contains("is-open")), true, "Mobile navigation did not open");
  await page.locator(".mobile-access-button").click();
  assert.equal(await page.locator("#mobile-nav").evaluate(element => element.classList.contains("is-open")), false, "Mobile navigation should close when opening access");
  assert.equal(await page.locator("#credentials-dialog").evaluate(element => element.open), true, "Credential request dialog did not open");
  assert.equal(await page.locator("#credentials-product option").count(), 12, "Credential form should include general inquiry plus all products");
  await page.locator(".credentials-close").click();

  // Tablet menu behavior and visibility of the access action above 900px.
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "load" });
  await page.locator(".mobile-menu-toggle").click();
  assert.equal(await page.locator("#mobile-nav").evaluate(element => element.classList.contains("is-open")), true, "Tablet navigation did not open at 1024px");
  await page.locator(".mobile-access-button").waitFor({ state: "visible", timeout: 1500 });
  assert.equal(await page.locator(".mobile-access-button").isVisible(), true, "Access action is missing in the tablet menu");
  await page.locator(".mobile-access-button").click();
  assert.equal(await page.locator("#mobile-nav").evaluate(element => element.classList.contains("is-open")), false, "Tablet navigation did not close after selecting access");
  assert.equal(await page.locator("#credentials-dialog").evaluate(element => element.open), true, "Tablet access action did not open the request dialog");
  await page.locator(".credentials-close").click();

  const publicSurface = await page.evaluate(() => ({
    githubLinks: [...document.querySelectorAll('a[href*="github.com"]')].length,
    sourceMentions: /github|repositori|repository/i.test(document.body.innerText)
  }));
  assert.equal(publicSurface.githubLinks, 0, "Public pages must not link to internal repositories");
  assert.equal(publicSurface.sourceMentions, false, "Public pages must not mention internal repository sources");

  // Mega-menu product links must open the matching product modal on desktop.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "load" });
  await page.locator(".nav-trigger").first().click();
  assert.equal(await page.locator(".nav-item.is-open").count(), 1, "Product mega-menu did not open");
  await page.locator('.mega-menu [data-open-product="hefesto"]').click();
  assert.equal(await page.locator("#product-dialog").evaluate(element => element.open), true, "Mega-menu product link did not open detail");
  assert.match(await page.locator("#product-dialog-content").innerText(), /Hefesto/, "Mega-menu opened the wrong product");
  assert.doesNotMatch(await page.locator("#product-dialog-content").innerText(), /github|repositorio|repository/i, "Product detail exposed internal source data");
  await page.locator(".dialog-close").click();

  // Visual system smoke tests: transitions, ambient animations and pointer polish.
  const visualStyles = await page.evaluate(() => {
    const headline = document.querySelector(".gradient-text");
    const networkLine = document.querySelector(".network-lines path");
    const productCard = document.querySelector("#product-grid .product-card");
    const style = getComputedStyle(productCard);
    return {
      headlineAnimation: getComputedStyle(headline).animationName,
      networkAnimation: getComputedStyle(networkLine).animationName,
      cardTransition: style.transitionProperty,
      heroKeyframe: getComputedStyle(document.querySelector(".hero-copy h1")).animationName,
      focusOutline: getComputedStyle(document.querySelector(".search-open")).outlineStyle
    };
  });
  assert.match(visualStyles.headlineAnimation, /gradient-flow/, "Animated gradient headline is missing");
  assert.match(visualStyles.networkAnimation, /dash-flow/, "Animated network lines are missing");
  assert.match(visualStyles.cardTransition, /transform/, "Product card transform transition is missing");
  assert.match(visualStyles.heroKeyframe, /hero-copy-enter/, "Hero entrance animation is missing");

  const firstCard = page.locator("#product-grid .product-card").first();
  await firstCard.hover({ position: { x: 22, y: 30 } });
  const pointerState = await firstCard.evaluate(element => ({
    active: element.classList.contains("is-pointer-active"),
    tiltX: element.style.getPropertyValue("--tilt-x"),
    tiltY: element.style.getPropertyValue("--tilt-y"),
    spotX: element.style.getPropertyValue("--spot-x")
  }));
  assert.equal(pointerState.active, true, "Pointer lighting interaction did not activate");
  assert.notEqual(pointerState.tiltX, "0deg", "Pointer tilt did not respond to cursor position");
  await page.mouse.move(4, 4);
  await page.waitForTimeout(80);
  assert.equal(await firstCard.evaluate(element => element.style.getPropertyValue("--tilt-x")), "0deg", "Pointer tilt did not reset on leave");

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotionDuration = await page.locator(".gradient-text").evaluate(element => getComputedStyle(element).animationDuration);
  assert.ok(parseFloat(reducedMotionDuration) <= 0.001, "Reduced-motion preference did not suppress animation");
  await page.emulateMedia({ reducedMotion: "no-preference" });

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
