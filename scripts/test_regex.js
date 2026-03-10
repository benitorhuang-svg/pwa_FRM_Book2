let text = `
$$
\\begin{aligned}
  r_{0,2} &= \\ln(P_2/P_1) + \\ln(P_1/P_0) \\\\
          &= \\ln\\left(\\frac{P_2}{P_1} \\cdot \\frac{P_1}{P_0}\\right) \\\\
          &= \\ln(P_2/P_0)
\\end{aligned}
$$
`;

// Simulate the replace
let mathBlocks = [];

text = text.replace(/\\+begin\{aligned\}([\s\S]*?)\\+end\{aligned\}/g, (match, inner) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'display', content: `\\begin{aligned}${inner}\\end{aligned}` })
    return ` @@MATH_BLOCK_${idx}@@ `
})

console.log("Blocks found for aligned:", mathBlocks.length);
if (mathBlocks.length > 0) {
    console.log("First block:", mathBlocks[0].content);
} else {
    console.log("Regex failed to match \\begin{aligned}");
}

// Check $$ blocks
text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, inner) => {
    const idx = mathBlocks.length
    mathBlocks.push({ type: 'display', content: inner })
    return ` @@MATH_BLOCK_${idx}@@ `
});
console.log("Blocks found for $$: ", mathBlocks.length);
