const marked = require('marked');
const crypto = require('crypto');

const rawJson = `{
    "content": "$$\\n\\\\begin{aligned}\\n  u &= e^{\\\\sigma \\\\sqrt{\\\\Delta t}} \\\\\\\\\\n  d &= 1/u = e^{-\\\\sigma \\\\sqrt{\\\\Delta t}} \\\\\\\\\\n  p &= \\\\frac{e^{r \\\\Delta t} - d}{u - d}\\n\\\\end{aligned}\\n$$"
}`;

const chapter = JSON.parse(rawJson);
let rawMarkdown = chapter.content;

const mathBlocks = []

// 1. Display math: $$ ... $$
rawMarkdown = rawMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'display', content: inner })
    return ` @@MATH_BLOCK_${idx}@@ `
})

// ... some dummy replacements
console.log(mathBlocks[0].content);
