#!/usr/bin/env python3
from pathlib import Path
import re
import sys


def is_within_dollars(text: str, start: int, end: int) -> bool:
    # Find last $$ before start
    left = text.rfind('$$', 0, start)
    if left == -1:
        return False
    # Find next $$ after left
    right = text.find('$$', left + 2)
    if right == -1:
        return False
    return right >= end


def main():
    root = Path('pwa_Book2_python/public/data')
    if not root.exists():
        print(f"Directory {root} not found.")
        sys.exit(1)

    pattern = re.compile(r"\\begin\{aligned\}")
    any_unwrapped = 0
    for p in sorted(root.rglob('*.json')):
        if p.suffix == '.bak':
            continue
        text = p.read_text(encoding='utf-8')
        for m in pattern.finditer(text):
            start = m.start()
            # find matching end
            endm = re.search(r"\\end\{aligned\}", text[m.end():])
            if not endm:
                print(f"{p}: found begin without end at {start}")
                any_unwrapped += 1
                continue
            end = m.end() + endm.end()
            if not is_within_dollars(text, start, end):
                print(f"UNWRAPPED: {p} at pos {start}-{end}")
                any_unwrapped += 1

    if any_unwrapped == 0:
        print("OK: all \begin{aligned} are inside $$...$$")
        return 0
    else:
        print(f"Found {any_unwrapped} unwrapped occurrences.")
        return 2


if __name__ == '__main__':
    sys.exit(main())
