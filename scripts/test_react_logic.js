import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import katex from 'katex';

const window = new JSDOM('').window;
const purify = DOMPurify(window);
const marked = new Marked();

let rawMarkdown = `
### 1.1 Returns
$$
\\begin{aligned}
  r_{0,2} &= \\ln(P_2/P_1) + \\ln(P_1/P_0) \\\\
          &= \\ln(P_2/P_0)
\\end{aligned}
$$
Some inline math $x=1$ here.
`;

const mathBlocks = [];

rawMarkdown = rawMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'display', content: inner })
    return ` @@MATH_BLOCK_${idx}@@ `
})
rawMarkdown = rawMarkdown.replace(/\\+\[([\s\S]*?)\\+\]/g, (match, inner) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'display', content: inner })
    return ` @@MATH_BLOCK_${idx}@@ `
})
rawMarkdown = rawMarkdown.replace(/\\+begin\{aligned\}([\s\S]*?)\\+end\{aligned\}/g, (match, inner) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'display', content: `\\begin{aligned}${inner}\\end{aligned}` })
    return ` @@MATH_BLOCK_${idx}@@ `
})

rawMarkdown = rawMarkdown.replace(/(?<!\\)\$([^$\n]+?)\$/g, (match, inner) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'inline', content: inner })
    return ` @@MATH_BLOCK_${idx}@@ `
})

console.log("Blocks found:", mathBlocks.length);

const rawHtml = marked.parse(rawMarkdown);
console.log("\n--- rawHtml ---");
console.log(rawHtml);

const cleanHtml = purify.sanitize(rawHtml, {
    USE_PROFILES: { html: true, mathml: true, svg: true }
});

console.log("\n--- cleanHtml ---");
console.log(cleanHtml);

const processedHtml = cleanHtml.replace(/@@MATH_BLOCK_(\d+)@@/g, (match, idx) => {
    const block = mathBlocks[parseInt(idx)]
    try {
        return katex.renderToString(block.content.trim(), {
            displayMode: block.type === 'display',
            throwOnError: false
        })
    } catch (e) {
        return "ERROR";
    }
})

console.log("\n--- processedHtml starts with Katex ---");
console.log(processedHtml.includes('class="katex-display"'));
