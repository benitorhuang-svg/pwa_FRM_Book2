import os
import glob

content_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\src\content\b2_ch1"
files = glob.glob(os.path.join(content_dir, "*.md"))

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # The JSON extraction left an extra layer of backslashes.
    # Replace every "\\" (two backslashes) with "\" (one backslash).
    # Thus, "\\begin" becomes "\begin" and "\\\\" becomes "\\"
    clean_content = content.replace("\\\\", "\\")
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(clean_content)

print(f"Cleaned backslashes in {len(files)} markdown files in {content_dir}!")
