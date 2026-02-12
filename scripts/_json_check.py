import json
p='public/data/chapters_b2_ch3.json'
with open(p,'r',encoding='utf-8') as f:
    s=f.read()
try:
    json.loads(s)
    print('OK')
except Exception as e:
    print('EXC:', type(e).__name__, e)
    msg=str(e)
    # Try to show line/column context
    try:
        import re
        m=re.search(r"line (\d+) column (\d+)", msg)
        if m:
            line=int(m.group(1))
            col=int(m.group(2))
            lines=s.splitlines()
            start=max(0,line-4)
            end=min(len(lines), line+3)
            print('\n--- File lines around error ---')
            for i in range(start, end):
                prefix = '>' if i+1==line else ' '
                print(f"{prefix} {i+1:4}: {lines[i]}")
            # Show the exact character at column (1-based)
            if 1 <= col <= len(lines[line-1]):
                context_line = lines[line-1]
                idx = col-1
                snippet_start = max(0, idx-20)
                snippet_end = min(len(context_line), idx+20)
                print('\n--- Column context ---')
                print(context_line[snippet_start:snippet_end])
                print(' ' * (min(20, idx - snippet_start)) + '^')
    except Exception:
        pass
    # If exception mentions char index, show raw context around that char
    try:
        import re
        m2=re.search(r"char (\d+)", msg)
        if m2:
            ch=int(m2.group(1))
            start=max(0,ch-60)
            end=min(len(s), ch+60)
            print('\n--- Raw context around char %d ---' % ch)
            snippet = s[start:end]
            # show with visible escapes
            print(snippet.replace('\n','\\n'))
    except Exception:
        pass
