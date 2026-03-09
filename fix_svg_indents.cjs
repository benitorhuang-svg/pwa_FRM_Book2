const fs = require('fs');

function fixSvg(filePath) {
    let file = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Find everything between <div style="width:100%; overflow-x:auto... and </div>
    // Replace newlines and spaces.
    let content = file.content;

    let regex = /<div style="width:100%; overflow-x:auto;[^>]*>[\s\S]*?<\/div>/g;

    content = content.replace(regex, (match) => {
        // Remove all blank lines and remove leading spaces to prevent markdown code block parsing
        let lines = match.split('\n');
        lines = lines.filter(line => line.trim().length > 0);
        lines = lines.map(line => line.trim());
        return lines.join('\n');
    });

    file.content = content;
    fs.writeFileSync(filePath, JSON.stringify(file, null, 4));
    console.log("Fixed", filePath);
}

fixSvg('public/data/modular/b2_ch5/5.2.json');
fixSvg('public/data/modular/b2_ch5/5.3.json');
fixSvg('public/data/modular/b2_ch5/5.4.json');
