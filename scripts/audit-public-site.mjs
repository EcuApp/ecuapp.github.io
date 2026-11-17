import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const targetUrl = process.env.PUBLIC_SITE_URL || "https://ecuapp.github.io/";
const outputDir = resolve(process.cwd(), "artifacts/public-site-audit");
const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "laptop-1024", width: 1024, height: 900 },
  { name: "tablet-768", width: 768, height: 900 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-320", width: 320, height: 800 }
];

await mkdir(outputDir, { recursive: true });
const report = {
  targetUrl,
  capturedAt: new Date().toISOString(),
  viewports: [],
  consoleErrors: [],
  pageErrors: [],
  failedRequests: [],
  responses: [],
  screenshots: [],
  htmlSnapshot: "public-home.html"
};
let browser;

try {
  const launchOptions = { headless: true, args: ["--no-sandbox"] };
  if (process.env.PUBLIC_AUDIT_BROWSER_CHANNEL) launchOptions.channel = process.env.PUBLIC_AUDIT_BROWSER_CHANNEL;
  if (process.env.PUBLIC_AUDIT_BROWSER_EXECUTABLE) launchOptions.executablePath = process.env.PUBLIC_AUDIT_BROWSER_EXECUTABLE;
  browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference"
  });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(60000);
  page.on("pageerror", error => report.pageErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") report.consoleErrors.push(message.text());
  });
  page.on("requestfailed", request => report.failedRequests.push({
    url: request.url(),
    error: request.failure()?.errorText || "unknown"
  }));
  page.on("response", response => {
    if (response.url().startsWith(targetUrl)) {
      report.responses.push({ url: response.url(), status: response.status() });
    }
  });

  const response = await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  report.httpStatus = response?.status() ?? null;
  report.finalUrl = page.url();
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(180);

    // Visit each section so scroll-reveal content is captured in its final visible state.
    const scrollAudit = await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      const step = Math.max(300, Math.floor(window.innerHeight * 0.58));
      const checkpoints = [];
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        await new Promise(resolve => setTimeout(resolve, 160));
        checkpoints.push({
          requested: y,
          actual: Math.round(window.scrollY),
          visible: [...document.querySelectorAll(".reveal")].filter(element => element.classList.contains("is-visible")).length
        });
      }
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, maxScroll);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const visibleAtBottom = [...document.querySelectorAll(".reveal")].filter(element => element.classList.contains("is-visible")).length;
      window.scrollTo(0, 0);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { checkpoints, maxScroll, finalScroll: Math.round(window.scrollY), visibleAtBottom };
    });
    await page.waitForTimeout(900);
    await page.evaluate(() => document.fonts?.ready);

    const metrics = await page.evaluate(() => {
      const clean = value => String(value || "").replace(/\s+/g, " ").trim();
      const rect = element => {
        const r = element.getBoundingClientRect();
        return {
          x: Math.round(r.x * 10) / 10,
          y: Math.round(r.y * 10) / 10,
          width: Math.round(r.width * 10) / 10,
          height: Math.round(r.height * 10) / 10,
          right: Math.round(r.right * 10) / 10,
          bottom: Math.round(r.bottom * 10) / 10
        };
      };
      const revealElements = [...document.querySelectorAll(".reveal")];
      const revealState = {
        total: revealElements.length,
        visible: revealElements.filter(element => element.classList.contains("is-visible")).length,
        rendered: revealElements.filter(element => Number(getComputedStyle(element).opacity) >= 0.98).length
      };
      const sections = [...document.querySelectorAll("main > section")].map((section, index) => {
        const style = getComputedStyle(section);
        const heading = section.querySelector("h1,h2");
        const grids = [...section.querySelectorAll(".product-grid,.service-grid,.case-grid,.pricing-grid,.status-layout,.developer-panel,.contact-band")];
        return {
          index,
          id: section.id || null,
          className: section.className,
          heading: clean(heading?.innerText),
          rect: rect(section),
          display: style.display,
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
          grids: grids.map(grid => ({
            className: grid.className,
            rect: rect(grid),
            display: getComputedStyle(grid).display,
            columns: getComputedStyle(grid).gridTemplateColumns,
            gap: getComputedStyle(grid).gap,
            children: grid.children.length
          }))
        };
      });
      const header = document.querySelector(".site-header");
      const headerElements = [...(header?.querySelectorAll(".brand,.header-actions,.mobile-menu-toggle,.desktop-nav,.mobile-nav") || [])]
        .map(el => ({ className: el.className, rect: rect(el), display: getComputedStyle(el).display, visibility: getComputedStyle(el).visibility }));
      const overflowElements = [...document.querySelectorAll("body *")].flatMap(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const visible = r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden";
        if (!visible) return [];
        const horizontal = r.right > window.innerWidth + 1 || r.left < -1 || el.scrollWidth > el.clientWidth + 2;
        if (!horizontal) return [];
        return [{
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: typeof el.className === "string" ? el.className : "",
          text: clean(el.innerText).slice(0, 100),
          rect: rect(el),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          overflowX: cs.overflowX
        }];
      }).slice(0, 40);
      const cardSelectors = [".product-card", ".service-card", ".case-card", ".pricing-card", ".status-card"];
      const cards = Object.fromEntries(cardSelectors.map(selector => [selector, [...document.querySelectorAll(selector)].slice(0, 6).map(el => ({
        title: clean(el.querySelector("h2,h3")?.innerText),
        rect: rect(el),
        padding: getComputedStyle(el).padding,
        display: getComputedStyle(el).display
      }))]));
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          scrollHeight: document.documentElement.scrollHeight,
          bodyScrollWidth: document.body.scrollWidth,
          bodyScrollHeight: document.body.scrollHeight
        },
        title: document.title,
        heading: clean(document.querySelector("h1")?.innerText),
        header: { rect: header ? rect(header) : null, elements: headerElements },
        revealState,
        heroCodePanel: document.querySelector(".hero-code-panel") ? {
          rect: rect(document.querySelector(".hero-code-panel")),
          position: getComputedStyle(document.querySelector(".hero-code-panel")).position,
          transform: getComputedStyle(document.querySelector(".hero-code-panel")).transform
        } : null,
        sections,
        cards,
        overflowElements
      };
    });
    metrics.scrollAudit = scrollAudit;

    const screenshotPath = resolve(outputDir, viewport.name + ".png");
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      scale: "css"
    });
    report.screenshots.push(viewport.name + ".png");
    report.viewports.push(metrics);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await writeFile(resolve(outputDir, "public-home.html"), await page.content(), "utf8");
  await writeFile(resolve(outputDir, "public-home-visible-text.txt"), await page.locator("body").innerText(), "utf8");
  await writeFile(resolve(outputDir, "public-audit.json"), JSON.stringify(report, null, 2), "utf8");
  assert.ok(report.httpStatus && report.httpStatus < 400, "Public website did not return a successful HTTP status");
  assert.ok(report.viewports.length === viewports.length, "Not all public viewport captures completed");
  console.log("Public website audit captured:", JSON.stringify({
    targetUrl: report.targetUrl,
    httpStatus: report.httpStatus,
    viewports: report.viewports.map(item => item.viewport),
    screenshotCount: report.screenshots.length,
    consoleErrors: report.consoleErrors.length,
    pageErrors: report.pageErrors.length,
    failedRequests: report.failedRequests.length
  }, null, 2));
} catch (error) {
  report.auditError = error?.stack || String(error);
  await writeFile(resolve(outputDir, "public-audit.json"), JSON.stringify(report, null, 2), "utf8").catch(() => {});
  throw error;
} finally {
  await browser?.close();
}
