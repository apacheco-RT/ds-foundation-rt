/**
 * Post-Velite build script.
 * Reads .velite/*.json and fans out to:
 *   1. .claude/registry-context/ (AI agent context)
 *   2. packages/registry/figma-connect/*.figma.tsx (Figma Code Connect)
 *   3. mcp/ds-server/src/registry-snapshot.json (MCP server data)
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const ROOT = resolve(import.meta.dirname, '..');
async function loadVelite(collection) {
    const path = resolve(ROOT, `.velite/${collection}.json`);
    if (!existsSync(path)) {
        console.warn(`⚠️  .velite/${collection}.json not found — run 'npm run build' in packages/registry first`);
        return [];
    }
    const { default: data } = await import(path, { assert: { type: 'json' } });
    return data;
}
function pascalCase(str) {
    return str.replace(/(^\w|-\w)/g, (c) => c.replace('-', '').toUpperCase());
}
async function run() {
    const components = await loadVelite('components');
    const foundations = await loadVelite('foundations');
    // ── 1. Full registry.json for AI context window injection ─────────────────
    await mkdir(resolve(ROOT, '.claude/registry-context/components'), { recursive: true });
    await writeFile(resolve(ROOT, '.claude/registry-context/registry.json'), JSON.stringify({
        generated: new Date().toISOString(),
        spec: 'DTCG-2025.10',
        components: components.map((c) => ({
            id: c['id'], version: c['version'], status: c['status'],
            variants: c['variants'], sizes: c['sizes'],
            primitive: c['primitive'], frameworks: c['frameworks'],
            adapters: c['adapters'], accessibility: c['accessibility'],
            aiPrompt: c['ai-prompt'],
        })),
        foundations: foundations.map((f) => ({
            id: f['id'], category: f['category'], version: f['version'],
            aiPrompt: f['ai-prompt'],
        })),
    }, null, 2));
    // ── 2. Per-component AI context markdown files ────────────────────────────
    for (const c of components) {
        const id = c['id'];
        const variants = c['variants'] ?? [];
        const adapters = c['adapters'] ?? {};
        const a11y = c['accessibility'];
        const md = [
            `# ${id} — Design System Component`,
            `**Version:** ${c['version']} | **Status:** ${c['status']} | **Primitive:** ${c['primitive'] ?? 'none'}`,
            '',
            '## Agent Instructions',
            c['ai-prompt'],
            '',
            '## Variants',
            variants.map((v) => `- \`${v}\``).join('\n'),
            '',
            '## Adapter Mappings',
            '```json',
            JSON.stringify(adapters, null, 2),
            '```',
            '',
            '## Accessibility Contract',
            `- **Role:** \`${a11y?.['role']}\``,
            `- **WCAG:** ${a11y?.['wcag']?.join(', ')}`,
            `- **Required ARIA:** ${a11y?.['aria']?.join(', ')}`,
            a11y?.['notes'] ? `- **Notes:** ${a11y['notes']}` : '',
        ].filter(Boolean).join('\n');
        await writeFile(resolve(ROOT, `.claude/registry-context/components/${id}.md`), md);
    }
    // ── 3. Figma Code Connect files (auto-generated) ──────────────────────────
    await mkdir(resolve(ROOT, 'packages/registry/figma-connect'), { recursive: true });
    for (const c of components) {
        const figma = c['figma'];
        if (!figma?.['code-connect'])
            continue;
        const id = c['id'];
        const variants = c['variants'] ?? [];
        const sizes = c['sizes'] ?? [];
        const frameworks = c['frameworks'];
        const nodeId = figma['node-id'];
        const importPath = frameworks?.['react'] ?? `@ds/react/${id}`;
        const name = pascalCase(id);
        const variantMap = variants.map((v) => `      ${v}: '${v}'`).join(',\n');
        const sizeMap = sizes.map((s) => `${s}: '${s}'`).join(', ');
        const content = [
            `// Auto-generated — do not edit. Update ${id}.mdx frontmatter to change.`,
            `// Regenerate: npm run registry:context`,
            `import { figma } from '@figma/code-connect';`,
            `import { ${name} } from '${importPath}';`,
            '',
            `figma.connect(${name}, 'https://figma.com/design/REPLACE_FILE_KEY?node-id=${nodeId}', {`,
            '  props: {',
            variants.length ? `    variant: figma.enum('Variant', {\n${variantMap}\n    }),` : '',
            sizes.length ? `    size: figma.enum('Size', { ${sizeMap} }),` : '',
            '  },',
            `  example: ({ variant, size }) => (`,
            `    <${name} variant={variant} size={size}>Label</${name}>`,
            `  ),`,
            `});`,
        ].filter(l => l !== '').join('\n');
        await writeFile(resolve(ROOT, `packages/registry/figma-connect/${id}.figma.tsx`), content);
    }
    // ── 4. MCP server registry snapshot ──────────────────────────────────────
    await writeFile(resolve(ROOT, 'mcp/ds-server/src/registry-snapshot.json'), JSON.stringify({ components, foundations }, null, 2));
    console.log('✅ Spec outputs built');
    console.log('   AI context:    .claude/registry-context/');
    console.log('   Figma Connect: packages/registry/figma-connect/');
    console.log('   MCP snapshot:  mcp/ds-server/src/registry-snapshot.json');
}
run().catch((err) => { console.error(err); process.exit(1); });
//# sourceMappingURL=build-spec-outputs.mjs.map