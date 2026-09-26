#!/usr/bin/env node
// Headless browser test for the designer docs. Builds the site into a private
// temporary folder (so parallel runs never collide), serves it, and loads every guide (or only the slugs passed as arguments) at
// 1280 and 390 px in headless Chrome. A guide fails if it does not render,
// its title does not match the navigation, its Anatomy self-check reports an
// issue, its pins do not match its legend rows, the page scrolls sideways, or
// the page throws.
//
//   npm run test:browser            # every guide
//   npm run test:browser badge      # selected guides

import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build, preview } from 'vite'
import { chromium } from 'playwright-core'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const WIDTHS = [1280, 390]
const PAGES_IN_PARALLEL = 4

const requested = process.argv.slice(2)
const slugs = requested.length
  ? requested
  : readdirSync(join(root, 'src/guides'))
      .filter((file) => file.endsWith('.guide.tsx'))
      .map((file) => file.replace('.guide.tsx', ''))

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'chrome' })
  } catch {
    try {
      return await chromium.launch()
    } catch {
      console.error(
        'No browser available. Install Google Chrome, or run `npx playwright-core install chromium`.',
      )
      process.exit(1)
    }
  }
}

const outDir = mkdtempSync(join(tmpdir(), 'coin-docs-test-'))
await build({ root, logLevel: 'silent', build: { outDir, emptyOutDir: true } })
const server = await preview({
  root,
  logLevel: 'silent',
  build: { outDir },
  preview: { host: '127.0.0.1', port: 4190, strictPort: false },
})
const baseUrl = server.resolvedUrls.local[0]
const browser = await launchBrowser()
const failures = []

async function checkGuide(context, slug, width) {
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    // Failed requests are reported with their URL by the response handler.
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) {
      errors.push(message.text())
    }
  })
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url().replace(baseUrl, '/')}`)
  })
  try {
    await page.goto(`${baseUrl}?component=${slug}`, { waitUntil: 'load' })
    await page.waitForSelector('h1', { timeout: 15000 })
    await page.evaluate(() => document.fonts.ready)
    // Anatomy reports after its layout settles (about 600 ms).
    await page.waitForTimeout(1200)
    const result = await page.evaluate(() => {
      const kit = window.__guideKit ?? {}
      return {
        title: document.querySelector('h1')?.textContent?.trim(),
        active: document.querySelector('.sidebar [aria-current="page"]')?.textContent?.trim(),
        issues: Object.values(kit).flat(),
        anatomies: document.querySelectorAll('#anatomy .gk-anatomy').length,
        pins: document.querySelectorAll('#anatomy .gk-anatomy-stage .gk-anatomy-pin').length,
        legend: document.querySelectorAll('#anatomy .gk-anatomy-legend ol > li').length,
        scrollWidth: document.documentElement.scrollWidth,
      }
    })
    const problems = [...result.issues]
    if (width >= 1024 && result.title !== result.active) {
      problems.push(`title "${result.title}" does not match navigation "${result.active}"`)
    }
    if (result.anatomies !== 1) problems.push(`${result.anatomies} anatomy diagrams (expected 1)`)
    if (result.pins !== result.legend) problems.push(`${result.pins} pins for ${result.legend} legend rows`)
    if (result.scrollWidth > width) problems.push(`page scrolls sideways (${result.scrollWidth}px)`)
    problems.push(...errors.map((error) => `runtime error: ${error}`))
    if (problems.length) failures.push({ guide: `${slug} @ ${width}px`, problems })
  } catch (error) {
    failures.push({ guide: `${slug} @ ${width}px`, problems: [`did not load: ${error.message}`] })
  } finally {
    await page.close()
  }
}

try {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const queue = [...slugs]
    await Promise.all(
      Array.from({ length: PAGES_IN_PARALLEL }, async () => {
        while (queue.length) await checkGuide(context, queue.shift(), width)
      }),
    )
    await context.close()
  }
} finally {
  await browser.close()
  await server.close()
  rmSync(outDir, { recursive: true, force: true })
}

if (failures.length) {
  console.error(`Browser test failed (${failures.length}):`)
  for (const failure of failures) {
    console.error(`  • ${failure.guide}`)
    for (const problem of failure.problems) console.error(`      - ${problem}`)
  }
  process.exit(1)
}
console.log(`Browser test passed · ${slugs.length} guides × ${WIDTHS.join(' and ')} px`)
