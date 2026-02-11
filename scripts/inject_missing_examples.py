import json
import os
import re

# Base paths
BASE_DIR = os.getcwd()  # c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python
SOURCE_BASE = os.path.join(
    BASE_DIR,
    "..",
    "Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇",
    "Book2_Python_Code",
)
TARGET_DIR = os.path.join(BASE_DIR, "public", "data")

# Missing examples configuration
MISSING_EXAMPLES = {
    "b2_ch8": [
        {"id": "ex2", "filename": "B2_Ch8_2.py", "title": "8.2 VaR 計算與統計對比"},
        {
            "id": "ex4",
            "filename": "B2_Ch8_4.py",
            "title": "8.4 收益率分佈與 VaR 統計推斷",
        },
    ],
    "b2_ch9": [
        {
            "id": "ex2",
            "filename": "B2_Ch9_2.py",
            "title": "9.2 信用資產數據基礎統計分析",
        }
    ],
    "b2_ch10": [
        {
            "id": "ex2",
            "filename": "B2_Ch10_2.py",
            "title": "10.2 多子圖佈局與風險數據對比",
        },
        {
            "id": "ex3",
            "filename": "B2_Ch10_3.py",
            "title": "10.3 基礎風險因子統計分佈曲線",
        },
        {"id": "ex4", "filename": "B2_Ch10_4.py", "title": "10.4 數據直方圖與擬合優度"},
        {
            "id": "ex6",
            "filename": "B2_Ch10_6.py",
            "title": "10.6 偏態與峰態對風險分佈的影響",
        },
    ],
    "b2_ch11": [
        {
            "id": "ex2",
            "filename": "B2_Ch11_2.py",
            "title": "11.2 最小變異數投資組合 (GMVP) 解析解",
        },
        {"id": "ex4", "filename": "B2_Ch11_4.py", "title": "11.4 有效前緣連續視覺化"},
        {"id": "ex5", "filename": "B2_Ch11_5.py", "title": "11.5 不可賣空約束投資組合"},
        {"id": "ex6", "filename": "B2_Ch11_6.py", "title": "11.6 複雜約束數值求解"},
    ],
}


def inject_examples():
    for ch_id, examples_to_add in MISSING_EXAMPLES.items():
        json_path = os.path.join(TARGET_DIR, f"chapters_{ch_id}.json")
        ch_num = ch_id.replace("b2_ch", "")
        source_dir = os.path.join(SOURCE_BASE, f"B2_Ch{ch_num}")

        print(f"Processing {ch_id}...")

        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            existing_examples = data.get("examples", [])
            # Create a map of existing filenames to avoid duplicates
            existing_filenames = {ex.get("filename") for ex in existing_examples}

            added_count = 0
            for ex_info in examples_to_add:
                filename = ex_info["filename"]
                if filename in existing_filenames:
                    print(f"  [SKIP] {filename} already exists.")
                    continue

                # specific source path
                source_path = os.path.join(source_dir, filename)
                if not os.path.exists(source_path):
                    print(f"  [FAIL] Source file {source_path} not found.")
                    continue

                with open(source_path, "r", encoding="utf-8") as src:
                    code_content = src.read()

                new_entry = {
                    "id": ex_info["id"],
                    "title": ex_info["title"],
                    "filename": filename,
                    "code": code_content,
                }

                existing_examples.append(new_entry)
                added_count += 1
                print(f"  [ADDED] {filename}")

            # Sort examples by id or filename naturally
            # Assuming id ex1, ex2...
            def sort_key(ex):
                # extract number from exX or B2_ChX_Y
                fname = ex.get("filename", "")
                match = re.search(r"_(\d+)\.py$", fname)
                if match:
                    return int(match.group(1))
                return 999

            existing_examples.sort(key=sort_key)
            data["examples"] = existing_examples

            if added_count > 0:
                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"  Saved {json_path} with {added_count} new examples.")
            else:
                print(f"  No changes for {ch_id}.")

        except Exception as e:
            print(f"  [ERROR] {e}")


if __name__ == "__main__":
    inject_examples()
