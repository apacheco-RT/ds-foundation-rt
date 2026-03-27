/**
 * DTCG 2025.10 compliance validator.
 * Checks all *.tokens.json files against the spec rules.
 * Run: node scripts/validate-tokens.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const VALID_TYPES = ['color', 'dimension', 'font-family', 'font-weight', 'duration',
  'cubic-bezier', 'number', 'stroke-style', 'border', 'transition', 'shadow', 'gradient', 'typography'];

let errors = 0;
let warnings = 0;

function findTokenFiles(dir) {
  const results = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) results.push(...findTokenFiles(full));
      else if (entry.name.endsWith('.tokens.json')) results.push(full);
    }
  } catch { /* dir doesn't exist yet */ }
  return results;
}

function validateToken(name, token, filePath, groupType) {
  if (!('$value' in token)) return; // it's a group

  // Rule: must have $type (own or inherited from group)
  const type = token['$type'] ?? groupType;
  if (!type) {
    console.error(`  ✗ FAIL [${filePath}] "${name}" has no $type and inherits none from parent group`);
    errors++;
  } else if (!VALID_TYPES.includes(type)) {
    console.error(`  ✗ FAIL [${filePath}] "${name}" has invalid $type "${type}"`);
    errors++;
  }

  // Rule: color values must NOT be hex strings
  if (type === 'color' && typeof token['$value'] === 'string') {
    console.error(`  ✗ FAIL [${filePath}] "${name}" color $value is a string — must be { colorSpace, components } object`);
    errors++;
  }

  // Rule: color objects must have colorSpace + components
  if (type === 'color' && typeof token['$value'] === 'object' && token['$value'] !== null) {
    const v = token['$value'];
    if (!v['colorSpace']) {
      console.error(`  ✗ FAIL [${filePath}] "${name}" color missing colorSpace`);
      errors++;
    }
    if (!v['components']) {
      console.error(`  ✗ FAIL [${filePath}] "${name}" color missing components array`);
      errors++;
    }
    if (!v['hex']) {
      console.warn(`  ⚠ WARN [${filePath}] "${name}" color missing hex fallback field`);
      warnings++;
    }
  }

  // Rule: dimension values must be objects with value + unit
  if (type === 'dimension' && typeof token['$value'] !== 'string') {
    const v = token['$value'];
    if (typeof v === 'number') {
      console.error(`  ✗ FAIL [${filePath}] "${name}" dimension $value is a raw number — must be { value, unit }`);
      errors++;
    }
  }

  // Rule: $extensions keys must use reverse-domain notation
  if (token['$extensions']) {
    for (const key of Object.keys(token['$extensions'])) {
      if (!key.includes('.')) {
        console.warn(`  ⚠ WARN [${filePath}] "${name}" $extensions key "${key}" should use reverse-domain notation (e.g. "com.ds.${key}")`);
        warnings++;
      }
    }
  }
}

function walkTokens(obj, filePath, groupType, path = '') {
  if (!obj || typeof obj !== 'object') return;
  const inheritedType = obj['$type'] ?? groupType;

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const tokenPath = path ? `${path}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      if ('$value' in value) {
        validateToken(tokenPath, value, filePath, inheritedType);
      } else {
        walkTokens(value, filePath, inheritedType, tokenPath);
      }
    }
  }
}

const tokenFiles = findTokenFiles(resolve(ROOT, 'packages/tokens/src'));
if (tokenFiles.length === 0) {
  console.log('⚠ No .tokens.json files found in packages/tokens/src/');
  process.exit(0);
}

console.log(`\nValidating ${tokenFiles.length} token files against DTCG 2025.10...\n`);

for (const filePath of tokenFiles) {
  const rel = filePath.replace(ROOT + '/', '');
  try {
    const json = JSON.parse(readFileSync(filePath, 'utf8'));
    walkTokens(json, rel, null);
  } catch (err) {
    console.error(`  ✗ FAIL [${rel}] JSON parse error: ${err.message}`);
    errors++;
  }
}

console.log(`\n${ errors === 0 && warnings === 0 ? '✅' : errors > 0 ? '✗' : '⚠'} Validation complete: ${errors} errors, ${warnings} warnings`);
if (errors > 0) process.exit(1);
