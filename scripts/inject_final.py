import json
import os
import re

# Paths
DATA_DIR = os.path.join("public", "data")

# Final missing example with absolute path
MISSING = {
    "b2_ch2": {
        "B2_Ch2_10.py": (
            "C:\\Users\\benit\\Desktop\\FRM MATLAB\\Python\\Book2_手術刀般"
            "精準的FRM用Python科學管控"
            "財金風險_實戰篇\\Book2_Python_Code\\B2_Ch3\\B2_Ch2_10.py"
        )
    }
}


def extract_example_number(filename):
    match = re.search(r"_(\d+)\.py$", filename)
    return int(match.group(1)) if match else 999


def make_title(ch_id, filename):
    ch_num = ch_id.replace("b2_ch", "")
    ex_num = extract_example_number(filename)
    return f"{ch_num}.{ex_num} 範例程式"


def inject_final():
    for ch_id, files in MISSING.items():
        json_path = os.path.join(DATA_DIR, f"chapters_{ch_id}.json")

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if "content" not in data:
            data["content"] = {}
        examples = data["content"].get("examples", [])

        existing_filenames = {ex.get("filename") for ex in examples}

        for filename, source_path in files.items():
            if filename in existing_filenames:
                print(f"  [SKIP] {filename} already exists")
                continue

            if not os.path.exists(source_path):
                print(f"  [ERROR] Source not found: {source_path}")
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
            print(f"  [ADD] {filename} to {ch_id}")

        # Sort and reindex
        examples.sort(key=lambda ex: extract_example_number(ex.get("filename", "")))
        for i, ex in enumerate(examples):
            ex["id"] = f"ex{i + 1}"

        data["content"]["examples"] = examples

        # Consistent JSON cleanup (remove root examples if any)
        if "examples" in data:
            del data["examples"]

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"[SUCCESS] Updated {json_path}")


if __name__ == "__main__":
    inject_final()
