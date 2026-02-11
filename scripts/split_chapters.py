import json
import os

data_dir = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data"
input_file = os.path.join(data_dir, "chapters.json")

if os.path.exists(input_file):
    with open(input_file, "r", encoding="utf-8") as f:
        chapters = json.load(f)

    for chapter in chapters:
        chapter_id = chapter.get("id")  # e.g., "b2_ch1"
        if chapter_id and chapter_id.startswith("b2_ch"):
            # Extract the number part
            ch_num = chapter_id.replace("b2_ch", "")
            filename = f"chapters_b2_ch{ch_num}.json"
            filepath = os.path.join(data_dir, filename)

            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(chapter, f, ensure_ascii=False, indent=2)
            print(f"Restored: {filename}")
else:
    print(f"Error: {input_file} not found.")
