import json
import os
import sys
import subprocess

def lint_json(file_path):
    """Lints a JSON file using python's json.tool logic."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            json.load(f)
        return True, ""
    except Exception as e:
        return False, str(e)

def merge_chapter_bodies(chapter_id):
    main_json_path = f"public/data/chapters_{chapter_id}.json"
    modular_dir = f"public/data/modular/{chapter_id}"
    
    if not os.path.exists(main_json_path):
        print(f"Main JSON file {main_json_path} not found.")
        return
    
    if not os.path.exists(modular_dir):
        print(f"Modular directory {modular_dir} not found.")
        return
        
    # Load modular parts
    body_updates = {}
    error_found = False
    
    for file_name in sorted(os.listdir(modular_dir)):
        if file_name.endswith(".json"):
            key = file_name.replace(".json", "")
            file_path = os.path.join(modular_dir, file_name)
            
            # LINT CHECK
            is_valid, err_msg = lint_json(file_path)
            if not is_valid:
                print(f"[ERROR] Syntax error in {file_path}: {err_msg}")
                error_found = True
                continue

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content_data = json.load(f)
                    body_updates[key] = content_data.get("content", "")
            except Exception as e:
                print(f"Error loading {file_path}: {e}")

    if error_found:
        print("[FAILED] Merge aborted due to syntax errors in modular files.")
        sys.exit(1)

    # Load main JSON and update
    try:
        with open(main_json_path, 'r', encoding='utf-8') as f:
            chapter_data = json.load(f)
            
        chapter_data["content"]["intro"]["body"] = body_updates
        
        with open(main_json_path, 'w', encoding='utf-8') as f:
            json.dump(chapter_data, f, ensure_ascii=False, indent=2)
            
        print(f"[SUCCESS] Updated {main_json_path} with {len(body_updates)} modular sections.")
    except Exception as e:
        print(f"Error updating {main_json_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python merge_bodies.py <chapter_id> (e.g., b2_ch1)")
    else:
        merge_chapter_bodies(sys.argv[1])
