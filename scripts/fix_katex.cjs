/**
 * fix_katex.cjs — Unified KaTeX repair tool
 *
 * Fixes math rendering failures by:
 *   Phase 1: Batch-repair corrupted JSON math blocks in public/data/modular
 *   Phase 2: Rebuild ContentPanel.jsx math-block protection logic
 *
 * Usage: node scripts/fix_katex.cjs
 */
const fs = require('fs');
const path = require('path');

const PROJECT = path.resolve(__dirname, '..');
const DATA_ROOT = path.join(PROJECT, 'public', 'data', 'modular');
const PANEL_PATH = path.join(PROJECT, 'src', 'components', 'ContentPanel.jsx');

// ═══════════════════════════════════════════════
// Phase 1: Batch-repair corrupted JSON files
// ═══════════════════════════════════════════════
function phase1_fixJsonMath() {
  console.log('═══ Phase 1: JSON 數據修復 ═══');
  let total = 0, fixed = 0, errors = 0;

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.json')) processFile(p);
    }
  }

  function processFile(filePath) {
    total++;
    const raw = fs.readFileSync(filePath, 'utf8');
    const lines = raw.split(/\r?\n/);
    if (lines.length <= 3) return;               // already clean

    const rel = path.relative(DATA_ROOT, filePath);
    if (!raw.includes('"content"')) { console.log(`  ⏭ No content: ${rel}`); return; }

    if (lines.length === 5) {
      let l2 = lines[1], l3 = lines[2], l4 = lines[3];

      // Strip trailing \$$ from line 2
      if (l2.endsWith('\\$$')) l2 = l2.slice(0, -3);

      // Fix \b (0x08) -> \\begin
      l3 = l3.replace(/\x08egin\{/g, '\\\\begin{');
      l3 = l3.replace(/^\\begin\{/g, '\\\\begin{');

      // Strip leading duplicated $$ from line 4
      if (l4.startsWith('$$')) {
        l4 = l4.slice(2);
        if (l4.startsWith('\\n')) l4 = l4.slice(2);
      }

      const joined = l2 + '\\n' + l3 + '\\n' + l4;
      const result = lines[0] + '\n' + joined + '\n' + lines[4];

      try {
        JSON.parse(result);
        fs.writeFileSync(filePath, result, 'utf8');
        fixed++;
        console.log(`  ✅ ${rel}`);
      } catch (e) {
        errors++;
        console.error(`  ❌ ${rel}: ${e.message}`);
      }
    }
  }

  walk(DATA_ROOT);
  console.log(`  📊 ${fixed} fixed, ${errors} errors, ${total} total\n`);
}

// ═══════════════════════════════════════════════
// Phase 2: Rebuild ContentPanel.jsx math protection
// ═══════════════════════════════════════════════
function phase2_fixContentPanel() {
  console.log('═══ Phase 2: ContentPanel.jsx 渲染邏輯重建 ═══');

  let content = fs.readFileSync(PANEL_PATH, 'utf8');
  const startMarker = '      // Pre-process for KaTeX: Recover from corrupted escapes and standardize delimiters';
  const endMarker = '      let rawHtml = marked.parse(rawMarkdown)';

  const s = content.indexOf(startMarker);
  const e = content.indexOf(endMarker);

  if (s === -1 || e === -1) {
    console.error('  ❌ Section markers not found (rStart=' + s + ' rEnd=' + e + ')');
    return;
  }

  const patch = `      // Pre-process for KaTeX: Recover from corrupted escapes and standardize delimiters
      /* eslint-disable no-control-regex */
      rawMarkdown = rawMarkdown
        // 1. Recover from "eaten" backslashes that became control characters
        .replace(/\\x08(?![e\\\\])/g, '\\\\b')
        .replace(/\\x0c(?![r\\\\])/g, '\\\\f')
        .replace(/\\x0b/g, '\\\\v')
        .replace(/\\r(?![ \\n])/g, '\\\\r')

        // 2. Idempotent recovery for common LaTeX commands
        .replace(/[\\x08]egin\\{/g, '\\\\begin{')
        .replace(/[\\x08]eta/g, '\\\\beta')
        .replace(/[\\x0c]rac\\{/g, '\\\\frac{')
        .replace(/[\\x09]ext\\{/g, '\\\\text{')
        .replace(/[\\x09]heta/g, '\\\\theta')
        .replace(/[\\x09]au(?=\\s|$|[^a-z])/g, '\\\\tau')
        /* eslint-enable no-control-regex */

        // Fix corrupted delimiters: \\$$ -> $$, $$\\n\\$$ -> $$
        .replace(/\\\\+\\$\\$/g, '$$')
        .replace(/\\$\\$[\\s\\\\]*\\$\\$/g, '$$')

      // ── Protect math blocks from marked parsing ──
      const mathBlocks = []
      rawMarkdown = rawMarkdown.replace(/\\$\\$([\\s\\S]*?)\\$\\$/g, (match, inner) => {
        const idx = mathBlocks.length
        mathBlocks.push(inner)
        return \`%%MATHBLOCK_\${idx}%%\`
      })

      let rawHtml = marked.parse(rawMarkdown)

      // Re-insert math blocks after marked parsing
      rawHtml = rawHtml.replace(/%%MATHBLOCK_(\\d+)%%/g, (match, idx) => {
        return \`$$\${mathBlocks[parseInt(idx)]}$$\`
      })
`;

  content = content.substring(0, s) + patch + content.substring(e + endMarker.length);
  fs.writeFileSync(PANEL_PATH, content, 'utf8');
  console.log('  ✅ ContentPanel.jsx updated\n');
}

// ═══════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════
console.log('🔧 KaTeX Unified Repair Tool\n');
phase1_fixJsonMath();
phase2_fixContentPanel();
console.log('✅ Done.');
