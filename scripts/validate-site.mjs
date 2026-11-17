import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { Script } from "node:vm";
import { resolve } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), "utf8");
const requiredFiles = [
  "index.html",
  "assets/site.css",
  "assets/site.js",
  "assets/favicon.svg",
  "scripts/test-responsive.mjs",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml"
];

for (const file of requiredFiles) {
  assert.ok(existsSync(resolve(root, file)), "Missing required file: " + file);
}

const html = read("index.html");
const css = read("assets/site.css");
const js = read("assets/site.js");

// JavaScript must parse before it is shipped to GitHub Pages.
new Script(js, { filename: "assets/site.js" });

// HTML ids must be unique and every local anchor must resolve.
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
const idSet = new Set(ids);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
assert.deepEqual([...new Set(duplicates)], [], "Duplicate HTML ids found");

const anchors = [...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map((match) => match[1]);
const brokenAnchors = [...new Set(anchors.filter((id) => !idSet.has(id)))];
assert.deepEqual(brokenAnchors, [], "Broken in-page anchors found");

// Linked local assets must exist.
const localSources = [
  ...[...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map((match) => match[1]),
  ...[...html.matchAll(/<link[^>]+href=["']([^"']+\.css)["']/g)].map((match) => match[1]),
  ...[...html.matchAll(/<link[^>]+href=["']([^"']+\.svg)["']/g)].map((match) => match[1])
];
for (const source of localSources) {
  if (/^https?:\/\//i.test(source)) continue;
  const localPath = source.replace(/^\/+/, "");
  assert.ok(existsSync(resolve(root, localPath)), "Missing linked asset: " + source);
}

// Every translated HTML label needs a key in the JS dictionaries.
const translatedKeys = [
  ...[...html.matchAll(/data-i18n=["']([^"']+)["']/g)].map((match) => match[1]),
  ...[...html.matchAll(/data-i18n-placeholder=["']([^"']+)["']/g)].map((match) => match[1]),
  ...[...html.matchAll(/data-i18n-aria=["']([^"']+)["']/g)].map((match) => match[1])
];
const jsDictionaryKeys = new Set([...js.matchAll(/'([^']+)'\s*:/g)].map((match) => match[1]));
const missingTranslations = [...new Set(translatedKeys.filter((key) => !jsDictionaryKeys.has(key)))];
assert.deepEqual(missingTranslations, [], "Missing translation keys");

// Guard against the selector mistake that previously interrupted app initialization.
assert.doesNotMatch(js, /^\s*\$\('[^']+'\)\.forEach/m, "querySelector() cannot be used with forEach()");
assert.match(js, /\$\$\('\.mega-menu a'\)\.forEach/, "Mega-menu links should be queried as a collection");
assert.match(js, /setupCredentialRequests\(\)/, "Credential request flow was not initialized");
assert.match(js, /function setupSearch\(\)/, "Global search initializer missing");
assert.match(js, /function setupScrollEffects\(\)/, "Scroll effects initializer missing");
assert.match(js, /const elements = \$\$\('\.reveal:not\(\[data-reveal-ready\]\)'\)/, "Reveal observer must collect every reveal target");
assert.doesNotMatch(js, /const elements = \$\('\.reveal:not/, "Reveal observer must not use single-element querySelector");
assert.match(css, /\.reveal\[data-reveal-ready=/, "Reveal animation must use progressive enhancement without hiding uninitialized content");

// Responsive and accessibility guardrails.
assert.match(css, /#network-nodes\s*\{[^}]*display:\s*grid/s, "Responsive product diagram grid missing");
assert.match(css, /@media\s*\(max-width:\s*420px\)/, "Small-phone breakpoint missing");
assert.match(css, /@media\s*\(max-width:\s*350px\)/, "Narrow-phone breakpoint missing");
assert.match(css, /prefers-reduced-motion/, "Reduced-motion support missing");
assert.match(css, /@keyframes\s+dash-flow/, "Network animation missing");
assert.doesNotMatch(css, /@import\s+url\s*\(/, "Blocking external CSS import should not be used");

// Keep the static payload within a predictable range.
for (const file of ["index.html", "assets/site.css", "assets/site.js"]) {
  const bytes = statSync(resolve(root, file)).size;
  assert.ok(bytes < 180_000, file + " is unexpectedly large: " + bytes + " bytes");
}

console.log("EcuApp website validation passed.");
console.log("HTML ids:", ids.length, "| translated labels:", new Set(translatedKeys).size);
console.log("Responsive breakpoints, reduced-motion support and JavaScript syntax: OK.");
