import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
// Registry snapshot produced by scripts/build-spec-outputs.mts
const REGISTRY_PATH = process.env['DS_REGISTRY']
    ?? resolve(import.meta.dirname, 'registry-snapshot.json');
function loadRegistry() {
    try {
        return JSON.parse(readFileSync(REGISTRY_PATH, 'utf8'));
    }
    catch {
        return { components: [], foundations: [] };
    }
}
const server = new McpServer({
    name: 'ds-foundation',
    version: '0.1.0',
});
// ── Tool: get_component ───────────────────────────────────────────────────────
server.tool('get_component', 'Retrieve full component schema, ai-prompt, adapter mappings, and resolved tokens from the design system registry.', {
    id: z.string().describe('Component id (e.g. "button", "input", "badge")'),
    adapter: z.enum(['tailwind', 'material', 'bootstrap']).optional()
        .describe('Filter adapter mappings to a specific adapter'),
}, async ({ id, adapter }) => {
    const registry = loadRegistry();
    const component = registry.components.find((c) => c.id === id);
    if (!component) {
        return { content: [{ type: 'text', text: `Component "${id}" not found in registry.` }], isError: true };
    }
    const result = {
        ...component,
        adapters: adapter ? { [adapter]: component.adapters?.[adapter] } : component.adapters,
    };
    return {
        content: [{
                type: 'text',
                text: JSON.stringify(result, null, 2),
            }],
    };
});
// ── Tool: list_components ─────────────────────────────────────────────────────
server.tool('list_components', 'List all components in the registry with optional status filter.', {
    status: z.enum(['draft', 'beta', 'stable', 'deprecated']).optional(),
}, async ({ status }) => {
    const registry = loadRegistry();
    const filtered = status
        ? registry.components.filter((c) => c.status === status)
        : registry.components;
    const index = filtered.map((c) => ({
        id: c.id,
        version: c.version,
        status: c.status,
        variants: c.variants,
    }));
    return { content: [{ type: 'text', text: JSON.stringify(index, null, 2) }] };
});
// ── Tool: resolve_token ───────────────────────────────────────────────────────
server.tool('resolve_token', 'Resolve a semantic token path to its CSS custom property name and value.', {
    path: z.string().describe('Dot-notation token path (e.g. "color.brand.primary")'),
    theme: z.enum(['light', 'dark']).default('light'),
}, async ({ path }) => {
    const cssVar = `--ds-${path.replace(/\./g, '-')}`;
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ path, cssVar, usage: `var(${cssVar})` }, null, 2),
            }],
    };
});
// ── Tool: validate_component ──────────────────────────────────────────────────
server.tool('validate_component', 'Validate generated component code against its registry schema. Returns PASS, WARN, or FAIL.', {
    componentId: z.string(),
    code: z.string().describe('The generated component source code'),
    framework: z.enum(['react', 'angular', 'webcomponent']).default('react'),
}, async ({ componentId, code }) => {
    const registry = loadRegistry();
    const component = registry.components.find((c) => c.id === componentId);
    if (!component) {
        return { content: [{ type: 'text', text: `FAIL: Component "${componentId}" not found in registry.` }], isError: true };
    }
    const issues = [];
    // Check for hardcoded hex values
    if (/#[0-9a-fA-F]{3,8}/.test(code)) {
        issues.push('WARN: Hardcoded hex color detected. Use CSS custom properties (var(--ds-*)) instead.');
    }
    // Check all variants are implemented
    for (const variant of component.variants ?? []) {
        if (!code.includes(variant)) {
            issues.push(`WARN: Variant "${variant}" may not be implemented.`);
        }
    }
    // Check ARIA attributes
    for (const aria of component.accessibility?.aria ?? []) {
        if (!code.includes(aria)) {
            issues.push(`WARN: Required ARIA attribute "${aria}" not found.`);
        }
    }
    const status = issues.some(i => i.startsWith('FAIL')) ? 'FAIL'
        : issues.length > 0 ? 'WARN'
            : 'PASS';
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({ status, issues, componentId }, null, 2),
            }],
    };
});
// ── Tool: get_foundation ──────────────────────────────────────────────────────
server.tool('get_foundation', 'Retrieve a foundation spec (color, typography, spacing, etc.) from the registry.', { id: z.string().describe('Foundation id (e.g. "color", "typography", "spacing")') }, async ({ id }) => {
    const registry = loadRegistry();
    const foundation = registry.foundations.find((f) => f.id === id);
    if (!foundation) {
        return { content: [{ type: 'text', text: `Foundation "${id}" not found.` }], isError: true };
    }
    return { content: [{ type: 'text', text: JSON.stringify(foundation, null, 2) }] };
});
const transport = new StdioServerTransport();
await server.connect(transport);
//# sourceMappingURL=index.js.map