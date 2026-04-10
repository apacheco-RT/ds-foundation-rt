#!/usr/bin/env node
/**
 * publish-figma-connect.mjs
 *
 * Publishes generated Code Connect mappings from packages/registry/figma-connect/
 * to Figma, linking design components to their codebase implementations.
 *
 * Prerequisites:
 *   - Run `npm run build --filter=@ds-foundation/registry` first to generate
 *     the figma-connect/*.figma.tsx files.
 *   - Set FIGMA_ACCESS_TOKEN in your environment (Figma personal access token
 *     with "File content" and "Code Connect" scopes).
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=<token> node scripts/publish-figma-connect.mjs
 *
 * Implementation notes:
 *   This script will wrap `npx figma connect publish` with the correct
 *   config file path. Direct CLI invocation also works:
 *     npx figma connect publish --config packages/registry/figma-connect.config.ts
 */

if (!process.env.FIGMA_ACCESS_TOKEN) {
  console.error('[publish-figma-connect] FIGMA_ACCESS_TOKEN is not set.');
  console.error('Set it in your environment before running this script.');
  process.exit(1);
}

console.error(
  '[publish-figma-connect] Not yet implemented as a standalone script.\n' +
  'Run: npx figma connect publish --config packages/registry/figma-connect.config.ts'
);
process.exit(1);
