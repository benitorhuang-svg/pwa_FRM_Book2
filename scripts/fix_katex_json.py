#!/usr/bin/env python3
"""
Targeted repairs for corrupted KaTeX delimiters inside JSON files.

This script scans `public/data` JSON files and applies conservative fixes:
- remove stray backslashes immediately before `$$` ("\\$$" -> "$$")
- collapse multiple adjacent `$$` into a single `$$` pair where obvious

Backups are created with the `.bak` suffix before writing.
"""
from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent
data_root = root / 'public' / 'data'
if not data_root.exists():
    print(f"Data directory not found: {data_root}")
    raise SystemExit(1)

patterns = [
    # stray backslash before $$
    (re.compile(r"\\\\\$\$"), "$$"),
    # stray backslash before a single $ followed by another $ on next char (rare)
    (re.compile(r"\\\\\$"), "\$"),
    # collapse sequences of more than two $ into two
    (re.compile(r"\${3,}"), "$$"),
    # remove isolated "\\$$\n" patterns (backslash then $$ then newline)
    (re.compile(r"\\\\\$\$\s*\n"), "$$\n"),
]

def process_file(p: Path) -> int:
    txt = p.read_text(encoding='utf-8')
    orig = txt
    for pat, repl in patterns:
        txt = pat.sub(repl, txt)

    if txt != orig:
        bak = p.with_suffix(p.suffix + '.bak')
        p.rename(bak)
        p.write_text(txt, encoding='utf-8')
        print(f"Patched {p.relative_to(root)} (backup: {bak.name})")
        return 1
    return 0

total = 0
for p in sorted(data_root.rglob('*.json')):
    if p.suffix == '.bak':
        continue
    try:
        total += process_file(p)
    except Exception as e:
        print(f"Failed {p}: {e}")

print(f"Done. Patched {total} files.")
