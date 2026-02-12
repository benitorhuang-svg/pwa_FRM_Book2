
import json
import os
import re

files_to_repair = [
    r'c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data\chapters_b2_ch2.json',
    r'c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data\chapters_b2_ch5.json',
    r'c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data\chapters_b2_ch6.json'
]

def repair_content(content):
    if isinstance(content, str):
        # Replace literal \n with real newline
        content = content.replace('\\n', '\n')
        # Fix double-escaped backslashes in LaTeX (heuristic)
        # e.g. \\\\sigma -> \\sigma
        # We look for 4 backslashes followed by a word character
        content = re.sub(r'\\\\\\\\([a-zA-Z])', r'\\\\\1', content)
        # Also handle common 2 backslashes that should be 1 if they were doubled by mistake
        # But be careful not to break valid double backslashes which are needed in JSON for literal backslashes
        # Actually, in Chapter 5 I saw: "sigma": "$\\sigma$" (correct)
        # But in body: "### 5.1 ...\\n在衍生品...\\n...\\n...凸性 (Convexity)"
        # Wait, if I replace \\n with \n, the string inside the object will have real newlines.
        return content
    elif isinstance(content, dict):
        return {k: repair_content(v) for k, v in content.items()}
    elif isinstance(content, list):
        return [repair_content(i) for i in content]
    return content

for file_path in files_to_repair:
    print(f"Repairing {file_path}...")
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
        
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Repair the "content" subtree
        if 'content' in data:
            data['content'] = repair_content(data['content'])
            
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Done.")
    except Exception as e:
        print(f"Error repairing {file_path}: {e}")
