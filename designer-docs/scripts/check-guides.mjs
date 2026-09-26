#!/usr/bin/env node
// Static guardrails for the designer docs. Runs as part of `npm run build`.
//
// New guides must use src/guide-kit instead of bespoke markup or CSS. Guides
// written before the kit are listed in guide-check-legacy.json with the rules
// they still break; remove a guide's entry once it is migrated. The script
// fails when a listed guide becomes clean, so the list only ever shrinks.

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const read = (path) => readFileSync(join(root, path), 'utf8')
const legacy = JSON.parse(read('scripts/guide-check-legacy.json'))
const errors = []

const RULES = [
  {
    id: 'bespoke-anatomy',
    pattern: /className=[{"'`][^>]*?\b[\w-]*anatomy[\w-]*/,
    fix: 'Use <Anatomy> from ./guide-kit instead of bespoke anatomy markup.',
  },
  {
    id: 'raw-story-url',
    pattern: /jfs-components-storybook\.vercel\.app\/(iframe\.html|\?path=\/story)/,
    fix: 'Link stories through <Sources stories={[{ label, id }]}> or storyUrl() from ./guide-kit.',
  },
  {
    id: 'local-segment',
    pattern: /function\s+(Guide)?Segment\s*</,
    fix: 'Import Segment from ./guide-kit.',
  },
  {
    id: 'route-helper',
    pattern: /\.get\('component'\)/,
    fix: 'Routing comes from src/guides/registry; do not read ?component= in a guide.',
  },
]

// 1. Registered guides ---------------------------------------------------
const slugs = new Set()
for (const file of readdirSync(join(root, 'src/guides')).filter((f) => f.endsWith('.guide.tsx'))) {
  const slug = file.replace('.guide.tsx', '')
  const source = read(`src/guides/${file}`)
  const declared = source.match(/slug:\s*'([^']+)'/)?.[1]
  if (declared !== slug) errors.push(`src/guides/${file}: slug must be '${slug}' to match the file name.`)
  if (!/label:\s*'[^']+'/.test(source)) errors.push(`src/guides/${file}: add a readable label.`)
  if (!/icon:/.test(source)) errors.push(`src/guides/${file}: add an 18×18 navigation icon.`)
  if (slugs.has(slug)) errors.push(`src/guides/${file}: duplicate slug '${slug}'.`)
  slugs.add(slug)
}

// 2. Guide sources ---------------------------------------------------------
const sources = [
  ...readdirSync(join(root, 'src')).filter((f) => f.endsWith('.tsx')).map((f) => `src/${f}`),
  ...readdirSync(join(root, 'src/guides')).filter((f) => f.endsWith('.tsx')).map((f) => `src/guides/${f}`),
].filter((path) => path !== 'src/main.tsx' && path !== 'src/App.tsx')

const found = {}
for (const path of sources) {
  const source = read(path)
  const broken = RULES.filter((rule) => rule.pattern.test(source)).map((rule) => rule.id)
  if (broken.length) found[path] = broken
  const allowed = legacy.files[path] ?? []
  for (const id of broken) {
    if (!allowed.includes(id)) {
      const rule = RULES.find((r) => r.id === id)
      errors.push(`${path}: ${id}. ${rule.fix}`)
    }
  }
  for (const id of allowed) {
    if (!broken.includes(id)) {
      errors.push(`${path}: no longer breaks '${id}'. Remove it from scripts/guide-check-legacy.json.`)
    }
  }
}
for (const path of Object.keys(legacy.files)) {
  if (!sources.includes(path)) errors.push(`${path} is listed in guide-check-legacy.json but does not exist.`)
}

// 3. Shared stylesheet ceiling --------------------------------------------
const styleLines = read('src/styles.css').split('\n').length
if (styleLines > legacy.stylesCssMaxLines) {
  errors.push(
    `src/styles.css grew to ${styleLines} lines (ceiling ${legacy.stylesCssMaxLines}). ` +
      'Guides must not add CSS; use ./guide-kit components or extend the kit.',
  )
}

// Report -------------------------------------------------------------------
if (process.argv.includes('--print-legacy')) console.log(JSON.stringify(found, null, 2))
const legacyCount = Object.keys(legacy.files).length
if (errors.length) {
  console.error(`Guide check failed (${errors.length}):\n` + errors.map((e) => `  • ${e}`).join('\n'))
  process.exit(1)
}
const slack = legacy.stylesCssMaxLines - styleLines
console.log(
  `Guide check passed · ${slugs.size} guides · ${legacyCount} legacy files left to migrate` +
    (slack > 0 ? ` · styles.css ceiling can drop to ${styleLines}` : ''),
)
