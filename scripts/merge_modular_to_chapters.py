import os
import json

# Paths
BASE_DIR = os.getcwd()
DATA_DIR = os.path.join(BASE_DIR, "public", "data")
MODULAR_DIR = os.path.join(DATA_DIR, "modular")


def merge_modular_content():
    # Iterate over all chapters in public/data
    chapter_files = sorted(
        [
            f
            for f in os.listdir(DATA_DIR)
            if f.startswith("chapters_b2_ch") and f.endswith(".json")
        ]
    )

    count = 0
    for ch_file in chapter_files:
        ch_path = os.path.join(DATA_DIR, ch_file)

        try:
            with open(ch_path, "r", encoding="utf-8") as f:
                ch_data = json.load(f)

            ch_id = ch_data.get("id")
            if not ch_id:
                print(f"[SKIP] {ch_file}: No ID found.")
                continue

            # Look for modular directory
            modular_ch_dir = os.path.join(MODULAR_DIR, ch_id)
            if not os.path.exists(modular_ch_dir):
                print(f"[SKIP] {ch_file}: No modular directory {modular_ch_dir} found.")
                continue

            print(f"Merging content for {ch_id}...")
            changes_made = False

            # Iterate over modular files
            # Expected filenames: "1.1.json", "10.2.json", etc.
            # These map to content.body["1.1"] etc.

            # Ensure body exists
            if "content" not in ch_data:
                ch_data["content"] = {}
            if "body" not in ch_data["content"]:
                ch_data["content"]["body"] = {}

            for mod_file in os.listdir(modular_ch_dir):
                if not mod_file.endswith(".json"):
                    continue

                section_key = mod_file.replace(".json", "")
                mod_path = os.path.join(modular_ch_dir, mod_file)

                with open(mod_path, "r", encoding="utf-8") as mf:
                    mod_data = json.load(mf)

                if "content" in mod_data:
                    new_text = mod_data["content"]

                    # Update body
                    # Check if different
                    old_text = ch_data["content"]["body"].get(section_key, "")
                    if old_text != new_text:
                        ch_data["content"]["body"][section_key] = new_text
                        changes_made = True
                        # print(f"  Updated section {section_key}")

            if changes_made:
                with open(ch_path, "w", encoding="utf-8") as f:
                    json.dump(ch_data, f, indent=2, ensure_ascii=False)
                print(f"[UPDATED] {ch_file}")
                count += 1
            else:
                print(f"[OK] {ch_file} (Up to date)")

        except Exception as e:
            print(f"[ERROR] Failed to process {ch_file}: {e}")

    print(f"Merge complete. Updated {count} chapters.")


if __name__ == "__main__":
    merge_modular_content()
