import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const outDir = path.resolve(process.cwd(), 'public');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.resolve(__dirname, '..', '..', 'Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇');

const files = [
  {
    src: path.join(srcRoot, 'FRM_Python_科學管控財金風險_實戰篇.jpg'),
    dest: path.join(outDir, 'welcome.jpg'),
  },
  {
    src: path.join(srcRoot, '手術刀般精準的FRM用Python科學管控財金風險_實戰篇.md'),
    dest: path.join(outDir, 'welcome.md'),
  },
];

for (const f of files) {
  try {
    if (!fs.existsSync(f.src)) {
      console.warn(`source not found: ${f.src}`);
      continue;
    }
    fs.copyFileSync(f.src, f.dest);
    console.log(`copied ${f.src} -> ${f.dest}`);
  } catch (err) {
    console.error('failed to copy', f.src, err);
    process.exitCode = 2;
  }
}

// success
process.exitCode = 0;
