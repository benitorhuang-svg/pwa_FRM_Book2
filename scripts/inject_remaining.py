import json
import os
import re

# Paths
DATA_DIR = os.path.join("public", "data")
SOURCE_BASE = os.path.join(
    "..", "Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇", "Book2_Python_Code"
)

# Files to inject
MISSING_EXAMPLES = {"b2_ch2": ["B2_Ch2_10.py"]}


def get_source_dir(ch_id):
    ch_num = ch_id.replace("b2_ch", "")
    return os.path.join(SOURCE_BASE, f"B2_Ch{ch_num}")


def extract_example_number(filename):
    match = re.search(r"_(\d+)\.py$", filename)
    return int(match.group(1)) if match else 999


def make_title(ch_id, filename):
    ch_num = ch_id.replace("b2_ch", "")
    ex_num = extract_example_number(filename)
    return f"{ch_num}.{ex_num} 範例程式"


def inject_remaining():
    for ch_id, filenames in MISSING_EXAMPLES.items():
        json_path = os.path.join(DATA_DIR, f"chapters_{ch_id}.json")
        source_dir = get_source_dir(ch_id)

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        examples = data["content"].get("examples", [])
        existing_filenames = {ex.get("filename") for ex in examples}

        for filename in filenames:
            if filename in existing_filenames:
                continue

            source_path = os.path.join(source_dir, filename)
            if not os.path.exists(source_path):
                print(f"Source not found: {source_path}")
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
            print(f"Injected {filename}")

        # Sort and reindex
        examples.sort(key=lambda ex: extract_example_number(ex.get("filename", "")))
        for i, ex in enumerate(examples):
            ex["id"] = f"ex{i + 1}"

        data["content"]["examples"] = examples

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    inject_remaining()
