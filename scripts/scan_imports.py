import os
import json
import re

DATA_DIR = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data"

def scan_imports():
    imports = set()
    
    for filename in os.listdir(DATA_DIR):
        if filename.startswith("chapters_b2_ch") and filename.endswith(".json"):
            filepath = os.path.join(DATA_DIR, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                if "content" in data and "examples" in data["content"]:
                    for example in data["content"]["examples"]:
                        code = example.get("code", "")
                        # Regex for 'import X' and 'from X import Y'
                        # Capture group 1: import X
                        # Capture group 2: from X
                        matches = re.findall(r"^\s*import\s+([\w\.]+)|^\s*from\s+([\w\.]+)\s+import", code, re.MULTILINE)
                        
                        for m in matches:
                            # m is a tuple like ('numpy', '') or ('', 'pandas')
                            pkg = m[0] if m[0] else m[1]
                            if pkg:
                                # Get the top-level package name
                                top_level = pkg.split('.')[0]
                                imports.add(top_level)
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                
    return sorted(list(imports))

if __name__ == "__main__":
    all_imports = scan_imports()
    print("Found imports:")
    for i in all_imports:
        print(f"- {i}")
