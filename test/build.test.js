/**
 * Build output tests for jackaraz.github.io
 *
 * Run:  node test/build.test.js
 * Or:   npm test   (after `make build`)
 */

const fs = require("fs");
const path = require("path");

const DIST = path.resolve(__dirname, "../dist");

// ── tiny test runner ──────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✓  ${description}`);
    passed++;
  } else {
    console.error(`  ✗  ${description}`);
    failed++;
  }
}

function assertContains(description, filePath, substring) {
  const exists = fs.existsSync(filePath);
  if (!exists) {
    console.error(`  ✗  ${description} (file missing: ${filePath})`);
    failed++;
    return;
  }
  const content = fs.readFileSync(filePath, "utf8");
  assert(description, content.includes(substring));
}

function section(name) {
  console.log(`\n${name}`);
}

// ── tests ─────────────────────────────────────────────────────────────────────

section("Build output directory");
assert("dist/ exists", fs.existsSync(DIST));

section("Core HTML files");
assert("dist/index.html exists", fs.existsSync(path.join(DIST, "index.html")));
assert(
  "dist/site.webmanifest exists",
  fs.existsSync(path.join(DIST, "site.webmanifest"))
);

section("CSS assets");
assert("dist/css/main.css exists", fs.existsSync(path.join(DIST, "css", "main.css")));
assert("dist/css/themes.css exists", fs.existsSync(path.join(DIST, "css", "themes.css")));
assert("dist/css/print.css exists", fs.existsSync(path.join(DIST, "css", "print.css")));
assert("dist/fonts/fonts.css exists", fs.existsSync(path.join(DIST, "fonts", "fonts.css")));

section("JavaScript assets");
assert("dist/js/main.js exists", fs.existsSync(path.join(DIST, "js", "main.js")));

section("index.html content");
const indexPath = path.join(DIST, "index.html");
assertContains("has DOCTYPE declaration", indexPath, "<!DOCTYPE html>");
assertContains("has page title", indexPath, "Jack Y. Araz");
assertContains("links main CSS", indexPath, "/css/main.css");
assertContains("links fonts CSS", indexPath, "/fonts/fonts.css");
assertContains("links themes CSS", indexPath, "/css/themes.css");
assertContains("links main JS", indexPath, "/js/main.js");
assertContains("has lang attribute", indexPath, 'lang="en"');
assertContains("has charset meta tag", indexPath, 'charset="UTF-8"');
assertContains("has viewport meta tag", indexPath, "viewport");

section("No stale external-URL output directories");
assert(
  "dist/https:/ not present (stale permalink artifact)",
  !fs.existsSync(path.join(DIST, "https:"))
);
assert(
  "dist/http:/ not present (stale permalink artifact)",
  !fs.existsSync(path.join(DIST, "http:"))
);

section("CSS is non-empty");
const mainCssPath = path.join(DIST, "css", "main.css");
if (fs.existsSync(mainCssPath)) {
  const size = fs.statSync(mainCssPath).size;
  assert(`dist/css/main.css is non-empty (${size} bytes)`, size > 0);
}

section("JS is non-empty");
const mainJsPath = path.join(DIST, "js", "main.js");
if (fs.existsSync(mainJsPath)) {
  const size = fs.statSync(mainJsPath).size;
  assert(`dist/js/main.js is non-empty (${size} bytes)`, size > 0);
}

// ── summary ───────────────────────────────────────────────────────────────────
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) {
  process.exit(1);
}
