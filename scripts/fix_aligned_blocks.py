#!/usr/bin/env python3
"""
Scan JSON files under pwa_Book2_python/public/data and wrap any
\begin{aligned}...\end{aligned} blocks with $$...$$ if they are
not already inside a $$...$$ block. Create a .bak backup for changed files.

Usage: python scripts/fix_aligned_blocks.py
"""
from pathlib import Path
import re
import sys


def wrap_aligned(content: str) -> (str, int):
    # Returns (new_content, number_of_replacements)
    begin_pat = re.compile(r"\\begin\{aligned\}")
    end_pat = re.compile(r"\\end\{aligned\}")

    pos = 0
    changed = 0
    while True:
        m = begin_pat.search(content, pos)
        if not m:
            break
        b_start = m.start()
        # find matching end
        me = end_pat.search(content, m.end())
        if not me:
            # no matching end; stop
            break
        b_end = me.end()

        # quick checks whether already wrapped by $$ immediately
        before = content[b_start-2:b_start] if b_start >= 2 else ""
        after = content[b_end:b_end+2] if b_end+2 <= len(content) else ""
        if before == '$$' and after == '$$':
            pos = b_end
            continue

        # remove single $ surrounding if present (to avoid $...$$ conflicts)
        # check one char before begin
        remove_left_single = False
        if b_start >= 1 and content[b_start-1] == '$' and (b_start < 2 or content[b_start-2] != '$'):
            remove_left_single = True
        remove_right_single = False
        if b_end < len(content) and content[b_end] == '$' and (b_end+1 >= len(content) or content[b_end+1] != '$'):
            remove_right_single = True

        prefix = content[:b_start - (1 if remove_left_single else 0)]
        block = content[b_start:b_end]
        suffix = content[b_end + (1 if remove_right_single else 0):]

        new_block = "$$\n" + block + "\n$$"
        content = prefix + new_block + suffix
        changed += 1

        # continue after the newly inserted block
        pos = len(prefix) + len(new_block)

    return content, changed


def process_file(path: Path) -> int:
    txt = path.read_text(encoding='utf-8')
    new_txt, n = wrap_aligned(txt)
    if n > 0:
        bak = path.with_suffix(path.suffix + '.bak')
        bak.write_text(txt, encoding='utf-8')
        path.write_text(new_txt, encoding='utf-8')
        print(f"Updated {path} — wrapped {n} aligned block(s); backup: {bak}")
    return n


def main():
    root = Path('pwa_Book2_python/public/data')
    if not root.exists():
        print(f"Directory {root} not found.")
        sys.exit(1)

    total = 0
    for p in root.rglob('*.json'):
        try:
            n = process_file(p)
            total += n
        except Exception as e:
            print(f"Failed processing {p}: {e}")

    print(f"Done. Total aligned blocks wrapped: {total}")


if __name__ == '__main__':
    main()
