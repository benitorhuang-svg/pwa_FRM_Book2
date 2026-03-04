import json
ch = json.load(open('public/data/chapters_b2_ch9.json','r',encoding='utf-8'))
for ex in ch['content']['examples']:
    fn = ex['filename']
    print(f'=== {fn} ===')
    lines = ex['code'].split('\n')
    for i, l in enumerate(lines[:50]):
        if l.strip():
            print(f'  {i+1}: {l}')
    print()
