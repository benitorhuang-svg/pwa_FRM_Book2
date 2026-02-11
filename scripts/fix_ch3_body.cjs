const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');
const filePath = path.join(dataDir, 'chapters_b2_ch3.json');

try {
    let rawContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawContent);

    if (data.content && typeof data.content.body === 'string') {
        const s = data.content.body;
        console.log(`Manually extracting keys from body string for chapters_b2_ch3.json...`);

        // Keys for Chapter 3: 3.1 to 3.8
        const keys = ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8"];
        const extractedBody = {};

        // Try direct JSON.parse first, it might be valid JSON string
        try {
            const parsed = JSON.parse(s);
            if (typeof parsed === 'object' && parsed !== null) {
                console.log("Successfully parsed body string as JSON directly.");
                data.content.body = parsed;
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                console.log(`Saved chapters_b2_ch3.json with parsed body object.`);
                return;
            }
        } catch (e) {
            console.log("Direct JSON parse failed, attempting manual extraction...");
        }

        // Fallback: Manual extraction if JSON.parse fails (e.g. bad escaping)
        keys.forEach((key, index) => {
            // The format from the file view shows: \"3.1\": \"...
            // So we look for:  \"3.1\": \"
            const currentKeyMarker = `\\"${key}\\": \\"`;

            // The next key marker would be:  \",\n      \"3.2\": \"
            const nextKey = keys[index + 1];
            // Note: The original file has escaped newlines inside the string: \n
            // The separator between fields in the stringified json is typically: \",\n      \"NEXT_KEY\": \"
            const nextKeyMarker = nextKey ? `\\",\\n      \\"${nextKey}\\": \\"` : `\\"\\n    }`;

            let startIdx = s.indexOf(currentKeyMarker);
            if (startIdx === -1) {
                // Try alternative spacing/formatting if first attempt fails
                // maybe it's just: \"3.1\": \"
                const altMarker = `"${key}": "`;
                startIdx = s.indexOf(altMarker);
                if (startIdx !== -1) {
                    // If we found it without backslashes, it might not be double-escaped or format differs
                    console.log(`Found unescaped marker for ${key}`);
                }
            }

            if (startIdx !== -1) {
                // Adjust startIdx to skip the marker itself
                // We need to know WHICH marker matched. 
                // Let's stick to the double-escaped expectation from the view_file output:
                // "body": "{\n      \"3.1\": \"### ...

                // Constructing the marker exactly as it appears in the JS string of the body
                // The body string `s` contains literal characters. 
                // In the file it looks like: "body": "{\n      \"3.1\": \"
                // So `s` starts with: {\n      "3.1": "

                const keyStr = `"${key}": "`;
                startIdx = s.indexOf(keyStr);

                if (startIdx !== -1) {
                    startIdx += keyStr.length;

                    let endIdx = -1;
                    if (nextKey) {
                        const nextKeyStr = `",\n      "${nextKey}": "`;
                        const nextKeyStrAlt = `", "${nextKey}": "`; // compacted?
                        endIdx = s.indexOf(nextKeyStr, startIdx);
                        if (endIdx === -1) endIdx = s.indexOf(nextKeyStrAlt, startIdx);
                    } else {
                        // Last key, look for closing brace
                        // It ends with: \n    }
                        const endStr = `"\n    }`;
                        endIdx = s.indexOf(endStr, startIdx);
                        if (endIdx === -1) endIdx = s.lastIndexOf('"'); // Fallback to last quote
                    }

                    if (endIdx !== -1) {
                        let val = s.substring(startIdx, endIdx);
                        // Unescape the content
                        // The content inside has: \\n for newlines, \\" for quotes
                        val = val.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                        extractedBody[key] = val;
                    }
                }
            }
        });

        if (Object.keys(extractedBody).length > 0) {
            data.content.body = extractedBody;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Successfully extracted ${Object.keys(extractedBody).length} keys and saved chapters_b2_ch3.json`);
        } else {
            console.error("Extraction failed to find any keys.");
            console.log("Sample of body string:", s.substring(0, 200));
        }
    } else {
        console.log("Body is already an object or not found.");
    }
} catch (err) {
    console.error(`Error:`, err.message);
}
