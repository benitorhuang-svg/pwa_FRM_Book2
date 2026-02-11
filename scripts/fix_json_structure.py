import json
import os
import re

DATA_DIR = os.path.join("public", "data")


def fix_chapter(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        modified = False

        # Fix 1: Remove content.intro.body
        content = data.get("content", {})
        if isinstance(content, dict):
            intro = content.get("intro", {})
            if isinstance(intro, dict):
                if "body" in intro:
                    print(
                        f"Removing content.intro.body from {os.path.basename(filepath)}"
                    )
                    del intro["body"]
                    modified = True

        # Fix 2: Merge root examples into content.examples
        root_examples = data.get("examples")
        if root_examples:
            print(f"Found root examples in {os.path.basename(filepath)}. Merging...")
            if "content" not in data:
                data["content"] = {}

            content_examples = data["content"].get("examples", [])

            # Map existing by filename
            existing_map = {ex.get("filename"): ex for ex in content_examples}

            for ex in root_examples:
                fname = ex.get("filename")
                # Overwrite or Add
                existing_map[fname] = ex

            # Reconstruct list
            new_list = list(existing_map.values())

            def sort_key(ex):
                # extract number from exX or B2_ChX_Y
                fname = ex.get("filename", "")
                match = re.search(r"_(\d+)\.py$", fname)
                if match:
                    return int(match.group(1))
                return 999

            new_list.sort(key=sort_key)

            data["content"]["examples"] = new_list
            del data["examples"]
            modified = True
            print(
                "Merged root examples into content.examples for "
                f"{os.path.basename(filepath)}"
            )

        if modified:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Saved {os.path.basename(filepath)}")
        else:
            print(f"[OK] {os.path.basename(filepath)}")

    except Exception as e:
        print(f"[ERROR] {filepath}: {e}")


def main():
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
        fix_chapter(os.path.join(DATA_DIR, f))


if __name__ == "__main__":
    main()
