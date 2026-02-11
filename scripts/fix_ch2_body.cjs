const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');
const filePath = path.join(dataDir, 'chapters_b2_ch2.json');

try {
    let rawContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawContent);

    if (data.content && typeof data.content.body === 'string') {
        const s = data.content.body;
        console.log(`Manually extracting keys from body string for chapters_b2_ch2.json...`);

        // This is a last-resort regex extraction for the specific format of these files
        const keys = ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7"];
        const extractedBody = {};

        keys.forEach((key, index) => {
            const currentKeyMarker = `"${key}": "`;
            const nextKey = keys[index + 1];
            const nextKeyMarker = nextKey ? `",\n      "${nextKey}": "` : `"\n    }`;

            let startIdx = s.indexOf(currentKeyMarker);
            if (startIdx !== -1) {
                startIdx += currentKeyMarker.length;
                let endIdx = s.indexOf(nextKeyMarker, startIdx);
                if (endIdx === -1) {
                    // Fallback for end of string
                    endIdx = s.lastIndexOf('"');
                }

                let val = s.substring(startIdx, endIdx);
                // Basic unescaping for common things if needed
                val = val.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                extractedBody[key] = val;
            }
        });

        if (Object.keys(extractedBody).length > 0) {
            data.content.body = extractedBody;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Successfully extracted ${Object.keys(extractedBody).length} keys and saved chapters_b2_ch2.json`);
        } else {
            console.error("Extraction failed to find any keys.");
        }
    }
} catch (err) {
    console.error(`Error:`, err.message);
}
