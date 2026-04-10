#!/usr/bin/env node
/**
 * build-registry.mjs
 *
 * Builds the registry manifest from Velite MDX output.
 * This script is invoked by the Turbo `registry:build` pipeline task.
 *
 * Usage:
 *   node scripts/build-registry.mjs
 *
 * Implementation notes:
 *   The registry is currently built by the Velite pipeline inside
 *   packages/registry. Run `npm run build --filter=@ds-foundation/registry`
 *   to rebuild. A standalone manifest export is planned for a future sprint.
 */

console.error(
  '[build-registry] Not yet implemented as a standalone script.\n' +
  'Run: npm run build --filter=@ds-foundation/registry'
);
process.exit(1);
