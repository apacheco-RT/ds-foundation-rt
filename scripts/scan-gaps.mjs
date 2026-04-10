#!/usr/bin/env node
// scripts/scan-gaps.mjs
import { readFileSync, existsSync, writeFileSync, readdirSync, unlinkSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const COMPONENTS_ROOT = join(ROOT, 'packages/react/src/components')
const REGISTRY_ROOT = join(ROOT, 'packages/registry/components')
const TICKETS_PATH = join(ROOT, 'tickets.md')
const CHANGELOG_PATH = join(ROOT, 'CHANGELOG.md')

const args = process.argv.slice(2)
const componentIdx = args.indexOf('--component')
const _componentArg = componentIdx !== -1 ? (args[componentIdx + 1] ?? null) : null
const componentFilter = _componentArg && !_componentArg.startsWith('--') ? _componentArg : null
if (componentIdx !== -1 && !componentFilter) {
  console.error('Error: --component requires a component name argument')
  process.exit(1)
}
const isDryRun = args.includes('--dry-run')
const LAYERS = ['atoms', 'molecules', 'organisms', 'templates']
const FORBIDDEN_IMPORTS = { atom: ['organisms','molecules','templates'], molecule: ['organisms','templates'], organism: ['templates'], template: [] }

function toPascalCase(str) {
  return str.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')
}

function getComponentFiles(layerDir) {
  if (!existsSync(layerDir)) return []
  return readdirSync(layerDir)
    .filter(f => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'))
    .map(f => join(layerDir, f))
}

function checkLayerViolations(filePath, layer) {
  const content = readFileSync(filePath, 'utf8')
  const violations = []
  for (const forbidden of FORBIDDEN_IMPORTS[layer] || []) {
    if (content.includes(`/components/${forbidden}/`)) {
      violations.push(`Layer violation: ${layer} imports from ${forbidden}`)
    }
  }
  return violations
}

function getTypeScriptErrors() {
  try {
    execSync(`npx tsc --noEmit -p ${join(ROOT, 'packages/react/tsconfig.json')}`, { encoding: 'utf8', stdio: 'pipe' })
    return {}
  } catch (e) {
    const errorMap = {}
    for (const line of (e.stdout || '').split('\n')) {
      const m = line.match(/^.+\/([\w-]+)\.tsx?\(\d+,\d+\): error (TS\d+): (.+)$/)
      if (m) {
        if (!errorMap[m[1]]) errorMap[m[1]] = []
        errorMap[m[1]].push(`${m[2]}: ${m[3]}`)
      }
    }
    return errorMap
  }
}

function getUnimplementedSpecs() {
  if (!existsSync(REGISTRY_ROOT)) return []
  return readdirSync(REGISTRY_ROOT)
    .filter(f => f.endsWith('.mdx') && f !== '_template.mdx')
    .flatMap(mdxFile => {
      const content = readFileSync(join(REGISTRY_ROOT, mdxFile), 'utf8')
      const idMatch = content.match(/^id:\s*(.+)$/m)
      if (!idMatch) return []
      const componentName = toPascalCase(idMatch[1].trim())
      const found = LAYERS.some(l => existsSync(join(COMPONENTS_ROOT, l, `${componentName}.tsx`)))
      return found ? [] : [{ componentName, mdxFile, content }]
    })
}

function readExistingIssueNumbers() {
  if (!existsSync(TICKETS_PATH)) return {}
  const map = {}
  for (const m of readFileSync(TICKETS_PATH, 'utf8').matchAll(/### (\w+) \(#(\d+)\)/g)) {
    map[m[1]] = parseInt(m[2])
  }
  return map
}

function ensureGitHubInfra() {
  if (isDryRun) return
  try {
    execSync('gh api repos/:owner/:repo/milestones --jq \'.[] | select(.title=="Design System Coverage") | .number\' 2>/dev/null | grep -q . || gh api repos/:owner/:repo/milestones -f title="Design System Coverage" -f state="open"')
  } catch {}
  for (const [name, color, desc] of [
    ['test-coverage','0075ca','Missing .test.tsx file'],
    ['unimplemented','e4e669','Registry spec exists but no component'],
    ['code-quality','d73a4a','forwardRef missing, layer violation, or TS error'],
  ]) {
    try { execSync(`gh label create "${name}" --color "${color}" --description "${desc}" 2>/dev/null || true`) } catch {}
  }
}

function createIssue(componentName, layer, gapTypes, gaps, specContent) {
  if (isDryRun) { console.log(`[dry-run] [${layer}] ${componentName} — ${gapTypes.join(', ')}`); return null }
  const gapList = gaps.map(g => `- [ ] ${g}`).join('\n')
  const spec = specContent ? `\n## Registry spec\n\`\`\`\n${specContent.slice(0, 600)}...\n\`\`\`` : ''
  const body = `## Component: ${componentName} (${layer})\n\n## Gaps\n${gapList}${spec}\n\n## Acceptance criteria\n- [ ] All gaps resolved\n- [ ] \`npx vitest run\` passes\n- [ ] \`npm run typecheck\` passes\n- [ ] \`node scripts/scan-gaps.mjs --component ${componentName}\` → 0 gaps\n- [ ] \`CHANGELOG.md\` updated under \`[Unreleased]\``
  const title = `[${layer}] ${componentName} — ${gapTypes.join(', ')}`
  const tmpFile = join(ROOT, '.gh-issue-body.tmp')
  try {
    const milestoneNum = execSync('gh api repos/:owner/:repo/milestones --jq \'.[] | select(.title=="Design System Coverage") | .number\'', { encoding: 'utf8' }).trim()
    if (!milestoneNum) throw new Error('Design System Coverage milestone not found')
    const labelArgs = gapTypes.map(l => `--label "${l}"`).join(' ')
    writeFileSync(tmpFile, body)
    const out = execSync(`gh issue create --title ${JSON.stringify(title)} --body-file ${tmpFile} ${labelArgs} --milestone ${milestoneNum}`, { encoding: 'utf8' })
    const m = out.match(/\/issues\/(\d+)/)
    return m ? parseInt(m[1]) : null
  } catch (e) {
    console.error(`Failed to create issue for ${componentName}:`, e.message)
    return null
  } finally {
    try { unlinkSync(tmpFile) } catch {}
  }
}

function closeIssue(n) {
  if (isDryRun || !n) return
  try { execSync(`gh issue close ${n} --comment "All gaps resolved."`) } catch {}
}

async function main() {
  console.log('🔍 Scanning for gaps...\n')
  ensureGitHubInfra()

  const tsErrors = getTypeScriptErrors()
  const unimplementedSpecs = getUnimplementedSpecs()
  const existingIssues = readExistingIssueNumbers()
  const allGaps = []

  // Per-layer scan
  for (const layerPlural of LAYERS) {
    const layer = layerPlural.slice(0, -1)
    for (const filePath of getComponentFiles(join(COMPONENTS_ROOT, layerPlural))) {
      const name = basename(filePath, '.tsx')
      if (componentFilter && name !== componentFilter) continue
      const gaps = []
      const gapTypes = new Set()
      if (!existsSync(filePath.replace('.tsx', '.test.tsx'))) { gaps.push('Missing test file'); gapTypes.add('test-coverage') }
      const content = readFileSync(filePath, 'utf8')
      if (!content.includes('forwardRef')) { gaps.push('Missing React.forwardRef'); gapTypes.add('code-quality') }
      for (const v of checkLayerViolations(filePath, layer)) { gaps.push(v); gapTypes.add('code-quality') }
      for (const e of tsErrors[name] || []) { gaps.push(e); gapTypes.add('code-quality') }
      if (gaps.length) allGaps.push({ name, layer, gapTypes: [...gapTypes], gaps, specContent: null })
    }
  }

  // Unimplemented specs
  for (const { componentName, content } of unimplementedSpecs) {
    if (componentFilter && componentName !== componentFilter) continue
    allGaps.push({ name: componentName, layer: 'unimplemented', gapTypes: ['unimplemented'], gaps: ['No implementation found'], specContent: content })
  }

  // CHANGELOG sentinel (only in full scan, not per-component)
  if (!componentFilter && existsSync(CHANGELOG_PATH) && !readFileSync(CHANGELOG_PATH, 'utf8').includes('## [Unreleased]')) {
    allGaps.push({ name: 'CHANGELOG', layer: 'meta', gapTypes: ['code-quality'], gaps: ['Missing [Unreleased] section'], specContent: null })
  }

  // Write tickets.md + sync GH issues
  const byLayer = {}
  for (const g of allGaps) { (byLayer[g.layer] ??= []).push(g) }

  const lines = [`# DS Foundation — Coverage Tickets`, `Generated: ${new Date().toISOString().slice(0,10)} | Open: ${allGaps.length} | Closed: 0`, '']
  for (const layer of ['meta','unimplemented','atom','molecule','organism','template']) {
    const items = byLayer[layer]; if (!items?.length) continue
    lines.push(`## ${layer.charAt(0).toUpperCase() + layer.slice(1)}s`, '')
    for (const item of items) {
      const issueNum = existingIssues[item.name] ?? createIssue(item.name, item.layer, item.gapTypes, item.gaps, item.specContent)
      lines.push(`### ${item.name}${issueNum ? ` (#${issueNum})` : ''} — ${item.gapTypes.join(', ')}`)
      for (const g of item.gaps) lines.push(`- [ ] ${g}`)
      lines.push(`Labels: ${item.gapTypes.join(', ')}`, '')
    }
  }

  if (!isDryRun) writeFileSync(TICKETS_PATH, lines.join('\n'))

  console.log(`\n✅ ${allGaps.length} gaps across ${new Set(allGaps.map(g => g.name)).size} components`)
  if (allGaps.length === 0) console.log('🎉 All gates green — ready to close milestone!')
}

main().catch(console.error)
