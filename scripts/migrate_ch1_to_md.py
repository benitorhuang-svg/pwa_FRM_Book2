import json
import os
import re

# Source JSON files
json_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data\modular\b2_ch1"
# Target MD files
md_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\src\content\b2_ch1"
os.makedirs(md_dir, exist_ok=True)

# Helper config to map 1.1 -> 1.1_Returns.md etc for better readability
name_map = {
    "1.1": "1.1_Returns.md",
    "1.2": "1.2_Historical_Volatility.md",
    "1.3": "1.3_Moving_Average_EWMA.md",
    "1.4": "1.4_ARCH.md",
    "1.5": "1.5_GARCH.md",
    "1.6": "1.6_Volatility_Forecasting.md",
    "1.7": "1.7_Implied_Volatility.md"
}

def unescape_backslash(text):
    # JSON has \\ln or \\begin, when parsed by python json it becomes \ln or \begin
    # We want to write out \\ln or \\begin to `.md` because our builder script will escape them back later if needed, 
    # Actually wait: The JS JSON has `\\\\ln`, so Python loads `\\ln`. Writing `\\ln` to markdown is correct!
    return text

def format_svg_tags(match):
    # This tries to prettify the 1-liner SVG back to readable multi-line code for the MD file
    svg = match.group(0)
    # Simple replacement to add newlines before major tags
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

def extract():
    for i in range(1, 8):
        file_base = f"1.{i}"
        json_path = os.path.join(json_dir, f"{file_base}.json")
        if not os.path.exists(json_path):
            continue
            
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        content = data.get("content", "")
        # Expand SVG spacing for human readability
        content = re.sub(r'<div class="payoff-diagram-container"[\s\S]*?</div>', format_svg_tags, content)
        
        # Unescape markdown newlines if they're literally '\n' in the text
        if "\\n" in content:
            content = content.replace("\\n", "\n")
            
        md_filename = name_map.get(file_base, f"{file_base}.md")
        md_path = os.path.join(md_dir, md_filename)
        
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Migrated {json_path} -> {md_filename}")

if __name__ == "__main__":
    extract()
