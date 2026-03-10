import json
import os
import re
import glob

print("Starting Markdown-to-JSON Compilation for Modular Content...")

content_base_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\src\content"
output_base_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data\modular"

def flatten_svg(match):
    """
    Compresses an SVG block into a single line to prevent Markdown parsers (like marked.js) 
    from interpreting newlines as paragraph breaks (<p> tags), which destroys the SVG.
    """
    svg_content = match.group(0)
    # Remove all newlines and multiple spaces
    svg_content = re.sub(r'\r?\n', ' ', svg_content)
    svg_content = re.sub(r'\s+', ' ', svg_content)
    return svg_content

def compile_chapter(chapter_folder_name):
    content_dir = os.path.join(content_base_dir, chapter_folder_name)
    output_dir = os.path.join(output_base_dir, chapter_folder_name)
    
    if not os.path.exists(content_dir):
        print(f"Directory {content_dir} does not exist. Skipping.")
        return

    os.makedirs(output_dir, exist_ok=True)
    
    md_files = glob.glob(os.path.join(content_dir, "*.md"))
    
    for md_path in md_files:
        filename = os.path.basename(md_path)
        # Extract "1.1" from "1.1_Returns.md" or "1.1" from "1.1.md"
        match = re.search(r'^(\d+\.\d+)', filename)
        if not match:
            print(f"Skipping {filename} - doesn't match pattern 'X.Y'")
            continue
            
        section_id = match.group(1)
        
        with open(md_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
            
        # 1. Flatten SVGs so they render perfectly through marked.js
        md_content = re.sub(r'<div class="payoff-diagram-container".*?</div>', flatten_svg, md_content, flags=re.DOTALL)
        
        # The previous attempt to manually replace "\\\\" with "\\\\\\\\" breaks KaTeX
        # because the original markdown already has properly formatted `\\begin{aligned}`.
        # When reading from MD, `\\begin` is literally `\` `\` `b` `e` `g` `i` `n`.
        # json.dump automatically escapes strings natively so they are valid JSON.
        # We DO NOT need to manually add backslashes here.
        # md_content = md_content.replace("\\", "\\\\")  # <- This breaks KaTeX!
        
        # Prepare output JSON
        output_data = {
            "content": md_content
        }
        
        json_filename = f"{section_id}.json"
        json_path = os.path.join(output_dir, json_filename)
        
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
            
        print(f"Compiled {filename} -> {json_filename}")


if __name__ == "__main__":
    if not os.path.exists(content_base_dir):
        print("No src/content directory found.")
    else:
        for item in os.listdir(content_base_dir):
            if os.path.isdir(os.path.join(content_base_dir, item)):
                compile_chapter(item)
    print("\n✅ Markdown-First Workflow Compilation Complete!")
