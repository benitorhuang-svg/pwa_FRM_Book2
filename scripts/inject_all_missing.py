"""
Comprehensive script to inject ALL missing examples into chapter JSON files.
Reads actual Python source code from the Book2_Python_Code directory.
"""

import json
import os
import re

# Paths
DATA_DIR = os.path.join("public", "data")
SOURCE_BASE = os.path.join(
    "..", "Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇", "Book2_Python_Code"
)

# Missing examples per chapter (chapter_id -> list of filenames)
MISSING_EXAMPLES = {
    "b2_ch2": ["B2_Ch2_6.py", "B2_Ch2_7.py", "B2_Ch2_8.py", "B2_Ch2_9.py"],
    "b2_ch6": [
        "B2_Ch6_2.py",
        "B2_Ch6_3.py",
        "B2_Ch6_4.py",
        "B2_Ch6_6.py",
        "B2_Ch6_7.py",
        "B2_Ch6_8.py",
        "B2_Ch6_9.py",
        "B2_Ch6_10.py",
    ],
    "b2_ch7": ["B2_Ch7_3.py", "B2_Ch7_4.py", "B2_Ch7_5.py"],
    "b2_ch12": ["B2_Ch12_2.py", "B2_Ch12_3.py"],
}


def get_source_dir(ch_id):
    """Get source directory for a chapter."""
    ch_num = ch_id.replace("b2_ch", "")
    return os.path.join(SOURCE_BASE, f"B2_Ch{ch_num}")


def extract_example_number(filename):
    """Extract the example number from filename like B2_Ch6_10.py -> 10"""
    match = re.search(r"_(\d+)\.py$", filename)
    return int(match.group(1)) if match else 999


def make_title(ch_id, filename):
    """Generate a title for the example based on chapter and number."""
    ch_num = ch_id.replace("b2_ch", "")
    ex_num = extract_example_number(filename)
    return f"{ch_num}.{ex_num} 範例程式"


def inject_examples():
    total_injected = 0

    for ch_id, filenames in MISSING_EXAMPLES.items():
        json_path = os.path.join(DATA_DIR, f"chapters_{ch_id}.json")
        source_dir = get_source_dir(ch_id)

        if not os.path.exists(json_path):
            print(f"[ERROR] {json_path} not found!")
            continue

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Get existing examples from content.examples
        if "content" not in data:
            data["content"] = {}
        examples = data["content"].get("examples", [])

        existing_filenames = {ex.get("filename") for ex in examples}
        injected = 0

        for filename in filenames:
            if filename in existing_filenames:
                print(f"  [SKIP] {filename} already exists in {ch_id}")
                continue

            # Read source code
            source_path = os.path.join(source_dir, filename)
            if not os.path.exists(source_path):
                print(f"  [WARN] Source file not found: {source_path}")
                continue

            with open(source_path, "r", encoding="utf-8") as sf:
                code = sf.read()

            ex_num = extract_example_number(filename)
            new_example = {
                "id": f"ex{ex_num}",
                "title": make_title(ch_id, filename),
                "filename": filename,
                "code": code,
            }

            examples.append(new_example)
            injected += 1
            print(f"  [ADD] {filename} -> {ch_id}")

        if injected > 0:
            # Sort by example number
            examples.sort(key=lambda ex: extract_example_number(ex.get("filename", "")))

            # Re-assign proper IDs
            for i, ex in enumerate(examples):
                ex["id"] = f"ex{i + 1}"

            data["content"]["examples"] = examples

            # Also remove root-level examples if any still exist
            if "examples" in data:
                del data["examples"]

            def sanitize_strings(obj):
                """
                Recursively escape single backslashes in strings to produce
                JSON-safe output (prevents malformed escapes from LaTeX etc.).
                """
                if isinstance(obj, str):
                    return obj.replace("\\", "\\\\")
                elif isinstance(obj, dict):
                    return {k: sanitize_strings(v) for k, v in obj.items()}
                elif isinstance(obj, list):
                    return [sanitize_strings(v) for v in obj]
                else:
                    return obj

            sanitized = sanitize_strings(data)
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(sanitized, f, indent=2, ensure_ascii=False)

            print(
                f"[UPDATED] {ch_id}: Injected {injected} examples "
                f"(total: {len(examples)})"
            )
            total_injected += injected
        else:
            print(f"[OK] {ch_id}: No new examples needed")

    print(f"\nTotal injected: {total_injected} examples")


if __name__ == "__main__":
    inject_examples()
