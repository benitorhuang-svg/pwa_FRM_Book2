#!/usr/bin/env python3
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parent.parent
data_root = root / 'public' / 'data'
if not data_root.exists():
    print(f"Data directory not found: {data_root}")
    sys.exit(1)

pattern = re.compile(r"\\begin\\{aligned\\}")
files_with_issues = []

def is_within_dollars(text, start, end):
    # find last $$ before start
    left = text.rfind('$$', 0, start)
    if left == -1:
        return False
    right = text.find('$$', left + 2)
    if right == -1:
        return False
    return right >= end

for p in sorted(data_root.rglob('*.json')):
    if p.suffix == '.bak':
        continue
    txt = p.read_text(encoding='utf-8')
    for m in pattern.finditer(txt):
        start = m.start()
        # try to find \end{aligned}
        endm = re.search(r"\\end\\{aligned\\}", txt[m.end():])
        if not endm:
            files_with_issues.append((p, start, 'no_end'))
            continue
        end = m.end() + endm.end()
        if not is_within_dollars(txt, start, end):
            files_with_issues.append((p, start, 'unwrapped'))

if not files_with_issues:
    print('OK: all \begin{aligned} occurrences are inside $$...$$ where an end exists')
    sys.exit(0)

print('Found occurrences needing attention:')
for f, pos, kind in files_with_issues:
    print(f"- {f.relative_to(root)}: pos={pos} issue={kind}")

sys.exit(2)
