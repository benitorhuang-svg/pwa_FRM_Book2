import json
import os
import re

DATA_DIR = os.path.join("public", "data")


def extract_filenames_from_markdown_table(markdown_table):
    """
    Parses a markdown table to extract filenames (e.g., B2_ChX_Y.py).
    Assumes the first column contains the script name.
    """
    filenames = []
    if not markdown_table:
        return []

    lines = markdown_table.split("\n")
    for line in lines:
        if "|" in line and ".py" in line:
            parts = line.split("|")
            if len(parts) >= 3:
                # Find the part that looks like a filename
                for part in parts:
                    match = re.search(r"B2_Ch\d+_\d+\.py", part)
                    if match:
                        filenames.append(match.group(0))
                        break
    return filenames


def audit_chapter(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        chapter_title = data.get("title", "Unknown")
        chapter_id = data.get("id", os.path.basename(filepath))

        # Navigate to scenarios table
        # Path: content -> intro -> implementation -> scenarios
        scenarios_md = ""
        content = data.get("content", {})

        if isinstance(content, dict):
            intro = content.get("intro", {})
            if isinstance(intro, dict):
                impl = intro.get("implementation", {})
                if isinstance(impl, dict):
                    scenarios_md = impl.get("scenarios", "")
            elif isinstance(intro, str):
                # Try to parse markdown table from raw string if possible, but it's hard
                pass

        if not scenarios_md:
            # Maybe it's directly in content if flatten? No, likely missing structure.
            print(f"[SKIP] {chapter_id}: No structured scenarios table found.")
            return

        expected_files = extract_filenames_from_markdown_table(scenarios_md)

        # Get actual examples
        examples = data.get("content", {}).get("examples", [])
        if not examples:
            examples = data.get("examples", [])

        actual_files = [ex.get("filename") for ex in examples] if examples else []

        missing = [f for f in expected_files if f not in actual_files]

        if missing:
            print(f"[FAIL-MISSING] {chapter_id} ({chapter_title}): Missing {len(missing)} examples.")
            for m in missing:
                print(f"  - {m}")
        elif not expected_files:
            print(f"[WARN] {chapter_id}: No expected files found in table.")
        
        # Check for empty code
        empty_code = []
        for ex in examples:
            code = ex.get("code", "")
            if not code or len(code.strip()) < 20: # Arbitrary threshold for "too short"
                empty_code.append(ex.get("filename", "Unknown"))
        
        if empty_code:
            print(f"[FAIL-EMPTY] {chapter_id}: Found {len(empty_code)} examples with empty/short code.")
            for e in empty_code:
                print(f"  - {e}")

        if not missing and not empty_code and expected_files:
            print(f"[PASS] {chapter_id}: All {len(expected_files)} examples present and populated.")

    except Exception as e:
        print(f"[ERROR] {filepath}: {e}")


def main():
    print("Auditing Chapter Examples...")
    if not os.path.exists(DATA_DIR):
        print(f"Data dir not found: {DATA_DIR}")
        return

    files = sorted(
        [
            f
            for f in os.listdir(DATA_DIR)
            if f.startswith("chapters_b2_ch") and f.endswith(".json")
        ]
    )

    for f in files:
        audit_chapter(os.path.join(DATA_DIR, f))


if __name__ == "__main__":
    main()
