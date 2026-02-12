import sys
import json
from pathlib import Path

p = Path('public/data/chapters_b2_ch3.json')
s = p.read_text(encoding='utf-8')

out = []
in_string = False
i = 0
L = len(s)

def is_escaped(s, pos):
    # Count preceding backslashes
    cnt = 0
    j = pos - 1
    while j >= 0 and s[j] == '\\':
        cnt += 1
        j -= 1
    return (cnt % 2) == 1

while i < L:
    ch = s[i]
    if ch == '"' and not is_escaped(s, i):
        out.append(ch)
        in_string = not in_string
        i += 1
        continue
    if in_string:
        if ch == '\n':
            out.append('\\n')
            i += 1
            continue
        if ch == '\r':
            out.append('\\r')
            i += 1
            continue
        if ch == '"' and is_escaped(s, i):
            out.append('\\"')
            i += 1
            continue
        out.append(ch)
        i += 1
    else:
        out.append(ch)
        i += 1

fixed = ''.join(out)
# Validate
try:
    json.loads(fixed)
    backup = p.with_suffix('.json.bak')
    p.rename(backup)
    p.write_text(fixed, encoding='utf-8')
    print('Sanitization successful. Original backed up to', backup)
except Exception as e:
    print('Sanitization failed:', e)
    # write diagnostic file
    diag = p.with_name(p.stem + '.fixed.debug.json')
    diag.write_text(fixed, encoding='utf-8')
    print('Wrote diagnostic output to', diag)
    sys.exit(1)
