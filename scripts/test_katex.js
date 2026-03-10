import katex from 'katex';

let inner = `
\\begin{aligned}
  r_{0,2} &= \\ln(P_2/P_1) + \\ln(P_1/P_0) \\\\
          &= \\ln\\left(\\frac{P_2}{P_1} \\cdot \\frac{P_1}{P_0}\\right) \\\\
          &= \\ln(P_2/P_0)
\\end{aligned}
`;

try {
    let output = katex.renderToString(inner.trim(), { displayMode: true, throwOnError: true });
    console.log("SUCCESS");
} catch (e) {
    console.error("FAIL:", e);
}
