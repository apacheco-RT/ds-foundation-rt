#!/usr/bin/env node
// Validates all component MDX specs in packages/registry/components/
// Run: node scripts/validate-registry.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import matter from 'gray-matter';

const COMPONENTS_DIR = resolve(import.meta.dirname, '../packages/registry/components');
const files = readdirSync(COMPONENTS_DIR).filter(f => f.endsWith('.mdx') && !f.startsWith('_'));

let errors = 0;
let warnings = 0;

for (const file of files) {
  const raw = readFileSync(join(COMPONENTS_DIR, file), 'utf8');
  const { data } = matter(raw);
  const id = data.id ?? file.replace('.mdx', '');
  const prefix = `[${id}]`;

  // Required top-level fields
  for (const field of ['id', 'type', 'version', 'status', 'ai-prompt']) {
    if (!data[field]) {
      console.error(`${prefix} FAIL: missing required field "${field}"`);
      errors++;
    }
  }

  // Semver version
  if (data.version && !/^\d+\.\d+\.\d+$/.test(data.version)) {
    console.error(`${prefix} FAIL: version "${data.version}" is not valid semver`);
    errors++;
  }

  // Accessibility
  if (!data.accessibility?.role) {
    console.error(`${prefix} FAIL: missing accessibility.role`);
    errors++;
  }
  if (!data.accessibility?.wcag?.length) {
    console.error(`${prefix} FAIL: accessibility.wcag is empty`);
    errors++;
  }
  if (!data.accessibility?.aria?.length) {
    console.warn(`${prefix} WARN: accessibility.aria is empty`);
    warnings++;
  }

  // Adapter mappings — at least one adapter must have at least one key
  const adapters = data.adapters ?? {};
  const hasAnyAdapter = Object.values(adapters).some(
    a => a && typeof a === 'object' && Object.keys(a).length > 0
  );
  if (!hasAnyAdapter) {
    console.error(`${prefix} FAIL: no adapter mappings defined`);
    errors++;
  }

  // Variant coverage in tailwind adapter
  const variants = data.variants ?? [];
  const twAdapter = adapters.tailwind ?? {};
  for (const variant of variants) {
    if (!twAdapter[variant]) {
      console.warn(`${prefix} WARN: variant "${variant}" has no tailwind adapter entry`);
      warnings++;
    }
  }
}

const icon = errors > 0 ? '✖' : warnings > 0 ? '⚠' : '✔';
console.log(`\n${icon}  Validated ${files.length} components — ${errors} error(s), ${warnings} warning(s)`);
if (errors > 0) process.exit(1);
