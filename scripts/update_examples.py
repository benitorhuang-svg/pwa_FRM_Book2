import os
import json
import re

# Paths
SOURCE_BASE_DIR = r"c:\Users\benit\Desktop\FRM MATLAB\Python\Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇\Book2_Python_Code"
TARGET_DATA_DIR = (
    r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data"
)


def get_source_file_path(filename):
    """
    Constructs the full path to the source Python file.
    Assumes filename format: B2_Ch{Chapter}_{Example}.py
    Example: B2_Ch12_1.py -> .../B2_Ch12/B2_Ch12_1.py
    """
    # Extract the folder name (e.g., B2_Ch12) from the filename
    match = re.match(r"(B2_Ch\d+)_", filename)
    if match:
        folder_name = match.group(1)
        return os.path.join(SOURCE_BASE_DIR, folder_name, filename)
    return None


def update_json_files():
    print(f"Scanning {TARGET_DATA_DIR} for chapter JSON files...")

    files_updated = 0
    examples_updated = 0

    for filename in os.listdir(TARGET_DATA_DIR):
        if filename.startswith("chapters_b2_ch") and filename.endswith(".json"):
            json_path = os.path.join(TARGET_DATA_DIR, filename)

            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)

                modified = False
                if "content" in data and "examples" in data["content"]:
                    for example in data["content"]["examples"]:
                        script_filename = example.get("filename")
                        if script_filename:
                            source_path = get_source_file_path(script_filename)

                            if source_path and os.path.exists(source_path):
                                try:
                                    with open(
                                        source_path, "r", encoding="utf-8"
                                    ) as src_file:
                                        code_content = src_file.read()

                                    # Update the code field
                                    if example.get("code") != code_content:
                                        example["code"] = code_content
                                        modified = True
                                        examples_updated += 1
                                        print(
                                            f"Updated code for {script_filename} in {filename}"
                                        )
                                    else:
                                        print(
                                            f"Code for {script_filename} already up to date."
                                        )
                                except Exception as e:
                                    print(
                                        f"Error reading source file {source_path}: {e}"
                                    )
                            else:
                                print(f"Source file not found: {source_path}")

                if modified:
                    with open(json_path, "w", encoding="utf-8") as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    files_updated += 1
                    print(f"Saved updates to {filename}")

            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print(f"\nSummary: Updated {examples_updated} examples in {files_updated} files.")


if __name__ == "__main__":
    update_json_files()
