const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');
const filesToFix = [
    'chapters_b2_ch2.json'
];

filesToFix.forEach(filename => {
    const filePath = path.join(dataDir, filename);
    console.log(`Checking ${filename}...`);

    try {
        let rawContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawContent);
        let changed = false;

        if (data.content && typeof data.content.body === 'string') {
            console.log(`  Attempting to fix 'body' in ${filename}`);
            let fieldStr = data.content.body;

            // Let's try to just escape ALL backslashes that aren't already doubled.
            // This is safer for LaTeX content that was poorly stringified.
            let improvedStr = fieldStr.replace(/\\/g, '\\\\');

            // Wait, if it was ALREADY a valid JSON string, doubling backslashes will break it.
            // But we know it's NOT a valid JSON string because JSON.parse failed.

            try {
                data.content.body = JSON.parse(improvedStr);
                changed = true;
                console.log(`    Successfully parsed 'body' after global backslash normalization`);
            } catch (e) {
                console.error(`    Global normalization failed: ${e.message}`);

                // Try one more thing: if it's "{\"key\": \"val\"}", the quotes inside are escaped. 
                // Doubling backslashes made it "{\\\"key\\\": ...}" which is invalid.
                // We only want to double backslashes that are NOT followed by " or \
                let smarterStr = fieldStr.replace(/\\(?![\\"])/g, '\\\\');
                try {
                    data.content.body = JSON.parse(smarterStr);
                    changed = true;
                    console.log(`    Successfully parsed 'body' after smart backslash normalization`);
                } catch (e2) {
                    console.error(`    Smart normalization failed: ${e2.message}`);
                }
            }
        }

        if (changed) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`  Successfully updated ${filename}`);
        }
    } catch (err) {
        console.error(`  Error processing ${filename}:`, err.message);
    }
});
