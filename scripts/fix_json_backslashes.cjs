const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');
const filesToFix = [
    'chapters_b2_ch2.json',
    'chapters_b2_ch3.json',
    'chapters_b2_ch5.json',
    'chapters_b2_ch6.json'
];

filesToFix.forEach(filename => {
    const filePath = path.join(dataDir, filename);
    console.log(`Normalizing backslashes in ${filename}...`);

    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Simple string replacement: replace \\\\ with \\ (at the JSON source level)
        // In JSON, \\\\ means a literal \\ in the string.
        // We want \\ in JSON, which means a literal \ in the string.
        let fixedContent = content.replace(/\\\\\\\\/g, '\\\\');

        // Also handle \n and other escapes if they were accidentally double-escaped
        // But be careful not to break valid double-escapes if any.
        // However, in these files, we likely want \n to be \\n in JSON (which is a newline in the string)
        // Wait, if it's \\\\n in JSON, it's \n in the string. That's actually okay for raw markdown.
        // But KaTeX needs \.

        if (fixedContent !== content) {
            fs.writeFileSync(filePath, fixedContent, 'utf8');
            console.log(`  Successfully normalized ${filename}`);
        } else {
            console.log(`  No double-escaped backslashes found in ${filename}`);
        }
    } catch (err) {
        console.error(`  Error processing ${filename}:`, err.message);
    }
});
