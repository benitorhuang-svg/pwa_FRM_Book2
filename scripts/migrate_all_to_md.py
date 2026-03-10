import json
import os
import re

# Source JSON folders
modular_json_base_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data\modular"
# Target MD folders
content_base_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\src\content"

def format_svg_tags(match):
    # This tries to prettify the 1-liner SVG back to readable multi-line code for the MD file
    svg = match.group(0)
    svg = svg.replace("<svg", "\n<svg")
    svg = svg.replace("<defs>", "\n  <defs>")
    svg = svg.replace("</defs>", "\n  </defs>")
    svg = svg.replace("<path", "\n  <path")
    svg = svg.replace("<text", "\n  <text")
    svg = svg.replace("<rect", "\n  <rect")
    svg = svg.replace("<circle", "\n  <circle")
    svg = svg.replace("<linear", "\n    <linear")
    svg = svg.replace("<stop", "\n      <stop")
    svg = svg.replace("</linear", "\n    </linear")
    svg = svg.replace("<marker", "\n    <marker")
    svg = svg.replace("</marker", "\n    </marker")
    svg = svg.replace("</svg>", "\n</svg>")
    svg = svg.replace("</div>", "\n</div>\n")
    return svg

def extract_all():
    print("Starting sweeping migration from Modular JSON back to src/content/ Markdown...")
    
    if not os.path.exists(modular_json_base_dir):
        print("Modular directory not found. Nothing to migrate.")
        return
        
    for chapter_folder in os.listdir(modular_json_base_dir):
        chapter_dir = os.path.join(modular_json_base_dir, chapter_folder)
        if not os.path.isdir(chapter_dir):
            continue
            
        # create target folder src/content/b2_chXX
        target_ch_dir = os.path.join(content_base_dir, chapter_folder)
        os.makedirs(target_ch_dir, exist_ok=True)
        
        migrated_count = 0
        for json_file in os.listdir(chapter_dir):
            if not json_file.endswith(".json"):
                continue
                
            json_path = os.path.join(chapter_dir, json_file)
            
            with open(json_path, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                except Exception as e:
                    print(f"Failed to load {json_path}: {e}")
                    continue
            
            content = data.get("content", "")
            if not content:
                continue
                
            # Expand SVG spacing for human readability
            content = re.sub(r'<div class="payoff-diagram-container"[\s\S]*?</div>', format_svg_tags, content)
            
            # Unescape markdown newlines if they're literally '\n' in the text
            if "\\n" in content:
                content = content.replace("\\n", "\n")
                
            # Name processing: 1.1.json -> 1.1.md
            md_filename = json_file.replace(".json", ".md")
            md_path = os.path.join(target_ch_dir, md_filename)
            
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(content)
                
            migrated_count += 1
            
        print(f"Migrated {migrated_count} files for {chapter_folder}")
            
    print("✅ Full migration complete. All JSON content has been backed up to src/content/!")

if __name__ == "__main__":
    extract_all()
