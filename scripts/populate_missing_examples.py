import os
import json
import re

DATA_DIR = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data"
SOURCE_BASE_DIR = r"c:\Users\benit\Desktop\FRM MATLAB\Python\Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇\Book2_Python_Code"

def parse_scenarios_table(markdown_table):
    """
    Parses the markdown table in 'scenarios' to get a dict mapping filename -> description.
    """
    mapping = {}
    if not markdown_table:
        return mapping
        
    lines = markdown_table.split('\n')
    for line in lines:
        # Match lines like | **B2_Ch2_1.py** | Description... |
        match = re.search(r'\|\s*\*\*([^\*]+)\*\*\s*\|\s*(.+?)\s*\|', line)
        if match:
            filename = match.group(1).strip()
            # Clean up description: remove markdown bold/formatting if simple
            description = match.group(2).strip()
            # Remove **[Core]** or similar if present, just keep text
            description = description.replace('**', '') 
            mapping[filename] = description
    return mapping

def populate_chapter(chapter_id, folder_name):
    json_path = os.path.join(DATA_DIR, f"chapters_{chapter_id}.json")
    source_dir = os.path.join(SOURCE_BASE_DIR, folder_name)
    
    if not os.path.exists(json_path):
        print(f"JSON file not found: {json_path}")
        return
        
    if not os.path.exists(source_dir):
        print(f"Source directory not found: {source_dir}")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Get title mapping from scenarios
    scenarios = data.get("content", {}).get("intro", {}).get("implementation", {}).get("scenarios", "")
    title_map = parse_scenarios_table(scenarios)
    
    examples = []
    
    # List all py files in source dir
    files = [f for f in os.listdir(source_dir) if f.endswith('.py')]
    
    # Sort files naturally? or just by name. The user wants numerical sorting in UI, 
    # but let's try to put them in numerical order in JSON too for neatness.
    def sort_key(f):
        # Extract number parts B2_Ch2_1 -> (2, 1)
        m = re.match(r'B2_Ch(\d+)_(\d+)', f)
        if m:
            return (int(m.group(1)), int(m.group(2)))
        return (0, 0)
        
    files.sort(key=sort_key)
    
    for i, filename in enumerate(files):
        source_path = os.path.join(source_dir, filename)
        with open(source_path, 'r', encoding='utf-8') as f:
            code_content = f.read()
            
        description = title_map.get(filename, filename)
        
        # Construct example object
        example = {
            "id": f"ex{i+1}",
            "title": f"{folder_name.replace('B2_Ch', '')}.{i+1} {description}", # Construct a title like "2.1 Description"
            "filename": filename,
            "code": code_content
        }
        examples.append(example)
        
    # Update JSON
    if "content" not in data:
        data["content"] = {}
        
    data["content"]["examples"] = examples
    
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print(f"Updated {chapter_id} with {len(examples)} examples.")

if __name__ == "__main__":
    populate_chapter("b2_ch2", "B2_Ch2")
    populate_chapter("b2_ch3", "B2_Ch3")
