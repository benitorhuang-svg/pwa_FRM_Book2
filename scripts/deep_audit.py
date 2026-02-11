import os
import json
import re

# Paths
BASE_DIR = os.getcwd()
DATA_DIR = os.path.join(BASE_DIR, "public", "data")
SOURCE_BASE = os.path.join(
    os.path.dirname(BASE_DIR),
    "Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇",
    "Book2_Python_Code",
)


def deep_audit():
    print(f"Scanning source directory: {SOURCE_BASE}")

    if not os.path.exists(SOURCE_BASE):
        print(f"[ERROR] Source directory not found: {SOURCE_BASE}")
        return

    # 1. Map all source files: filename -> absolute path
    source_map = {}

    for root, dirs, files in os.walk(SOURCE_BASE):
        for file in files:
            if file.endswith(".py") and file.startswith("B2_Ch"):
                source_map[file] = os.path.join(root, file)

    # 2. Check against each JSON
    # First, identify which chapters we have source files for
    source_chapters = {}
    for filename in source_map.keys():
        match = re.match(r"(B2_Ch(\d+))_\d+\.py", filename)
        if match:
            ch_num = match.group(2)
            ch_id = f"b2_ch{ch_num}"
            if ch_id not in source_chapters:
                source_chapters[ch_id] = []
            source_chapters[ch_id].append(filename)

    missing_report = {}

    for ch_id, files in source_chapters.items():
        json_path = os.path.join(DATA_DIR, f"chapters_{ch_id}.json")

        if not os.path.exists(json_path):
            print(f"[WARN] JSON for {ch_id} not found at {json_path}")
            missing_report[ch_id] = files
            continue

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Get examples
        examples = data.get("content", {}).get("examples", [])
        if not examples:
            examples = data.get("examples", [])

        existing_filenames = {ex.get("filename") for ex in examples}

        missing = [f for f in files if f not in existing_filenames]

        if missing:
            missing_report[ch_id] = {f: source_map[f] for f in missing}
            print(
                f"[FAIL] {ch_id}: Missing {len(missing)} examples "
                "locally present in source."
            )
            for m in missing:
                print(f"  - {m}")

    with open("audit_result.json", "w", encoding="utf-8") as f:
        json.dump(missing_report, f, indent=2, ensure_ascii=False)

    print(f"Audit complete. Found missing examples in {len(missing_report)} chapters.")
    print("Results saved to audit_result.json")


if __name__ == "__main__":
    deep_audit()
