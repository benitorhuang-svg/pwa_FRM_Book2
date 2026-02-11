import json
import sys
import re
import os

def validate_json_structure(file_path):
    print(f"--- Validating: {os.path.basename(file_path)} ---")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"[ERROR] Invalid JSON: {e}")
        return False

    success = True

    # 1. Check for Structured Body format
    body = data.get("content", {}).get("intro", {}).get("body", {})
    if not isinstance(body, dict):
        print("[ERROR] 'content.intro.body' must be an object (Structured Body).")
        success = False
    
    # 2. Check for Math Rigor (LaTeX)
    roadmap = data.get("content", {}).get("intro", {}).get("roadmap", {})
    topics = roadmap.get("topics", "")
    topic_count = len(re.findall(r'^\s*\*\s+', topics, re.MULTILINE))
    
    if success:
        print(f"[INFO] Found {len(body)} sections in body.")
        
        # Metrics for Rick Content (v1.3.0)
        total_chars = 0
        math_count = 0
        table_count = 0
        alert_count = 0
        aligned_math_count = 0
        checklist_count = 0
        tech_stack_mention = 0

        for key, content in body.items():
            total_chars += len(content)
            math_count += len(re.findall(r'\$\$|\$', content))
            table_count += len(re.findall(r'\|.*\|', content))
            alert_count += len(re.findall(r'>\s*\[!', content))
            aligned_math_count += len(re.findall(r'\\begin\{aligned\}', content))
            checklist_count += len(re.findall(r'☐|\[ \]', content))
            tech_stack_mention += len(re.findall(r'NumPy|Pandas|arch|Scipy|statsmodels', content, re.IGNORECASE))
            
            if len(content) < 400: # Increased threshold for v1.3.0
                print(f"[WARNING] Section {key} might be too short ({len(content)} chars). Senior depth might be insufficient.")

        print(f"[INFO] Total content characters: {total_chars}")
        print(f"[INFO] LaTeX math markers found: {math_count}")
        print(f"[INFO] Tables (Decision Matrices) found: {table_count // 2 if table_count > 0 else 0}")
        print(f"[INFO] Educational alerts found: {alert_count}")
        print(f"[INFO] Aligned derivations found: {aligned_math_count}")
        print(f"[INFO] Validation checklist items: {checklist_count}")
        print(f"[INFO] Tech stack keywords mentioned: {tech_stack_mention}")
        
        # Rigor Checks (v1.3.0)
        if math_count < len(body) * 2:
             print("[WARNING] Low math density. Skill standard (v1.3.0) suggests higher density.")
        if table_count == 0:
             print("[WARNING] No decision matrices. Skill standard (v1.3.0) mandates comparison tables.")
        if checklist_count == 0:
             print("[WARNING] No validation checklists found. Senior practitioners must define success criteria.")
        if tech_stack_mention == 0:
             print("[WARNING] No tech stack mentions. Link theory to Python tools (NumPy, arch, etc.).")

    if success:
        print("[SUCCESS] Content structure is sound.")
    else:
        print("[FAILED] Integrity checks failed.")
    
    return success

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate_chapter.py <path_to_chapter_json>")
    else:
        validate_json_structure(sys.argv[1])
