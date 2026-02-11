#!/usr/bin/env python3
"""
將 Book2 的 Python 程式碼轉換為 PWA 可用的 JSON 格式
"""

import json
from pathlib import Path
import re

# 章節標題對應
CHAPTER_TITLES = {
    "B2_Ch1": "第1章：波動性",
    "B2_Ch2": "第2章：隨機過程",
    "B2_Ch3": "第3章：蒙地卡羅模擬",
    "B2_Ch4": "第4章：回歸分析",
    "B2_Ch5": "第5章：選擇權二元樹",
    "B2_Ch6": "第6章：BSM選擇權定價",
    "B2_Ch7": "第7章：希臘字母",
    "B2_Ch8": "第8章：市場風險",
    "B2_Ch9": "第9章：信用風險",
    "B2_Ch10": "第10章：交易對手信用風險",
    "B2_Ch11": "第11章：投資組合理論Ⅰ",
    "B2_Ch12": "第12章：投資組合理論Ⅱ",
}


def extract_title_from_code(code):
    """從程式碼註解中提取標題"""
    lines = code.split("\n")
    for line in lines[:20]:  # 只檢查前20行
        line = line.strip()
        if line.startswith("#") and not line.startswith("###"):
            # 移除 # 符號和空白
            title = line.lstrip("#").strip()
            if (
                title
                and not title.startswith("Prepared by")
                and not title.startswith("Book")
            ):
                return title
    return None


def natural_sort_key(path):
    """
    提供給 sorted() 使用的自然排序 key
    如果是章節目錄 (B2_Ch1, B2_Ch10)，提取數字排序
    如果是範例檔案 (B2_Ch1_1.py, B2_Ch1_10.py)，提取最後的數字排序
    """
    name = path.name
    # 處理章節目錄 B1_Ch{N}
    if "B2_Ch" in name and "_" not in name.replace("B2_Ch", ""):
        try:
            return int(re.search(r"B2_Ch(\d+)", name).group(1))
        except Exception:
            return name

    # 處理範例檔案 .*_(\d+).py
    try:
        # 提取檔名最後的數字 (排除副檔名)
        last_part = path.stem.split("_")[-1]
        return int(last_part)
    except Exception:
        return name


def build_chapters_json():
    """建立章節 JSON 資料"""

    # 找到 Book2 的程式碼目錄
    base_path = Path(__file__).parent.parent
    # 找到 Markdown 目錄
    book_name = "Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇"
    markdown_dir = base_path.parent / book_name / "Chapter_Markdowns"
    # 找到 Book2 的程式碼目錄
    code_dir = base_path.parent / book_name / "Book2_Python_Code"

    if not code_dir.exists():
        print(f"錯誤：找不到目錄 {code_dir}")
        return

    chapters = []

    # 遍歷所有章節目錄
    for chapter_dir in sorted(code_dir.glob("B2_Ch*"), key=natural_sort_key):
        if not chapter_dir.is_dir():
            continue

        chapter_id = chapter_dir.name
        chapter_title = CHAPTER_TITLES.get(chapter_id, chapter_id)

        print(f"處理 {chapter_id}...")

        # 嘗試讀取 Markdown 內容
        content = {}
        md_file = markdown_dir / f"{chapter_id}_Detail.md"
        if md_file.exists():
            try:
                with open(md_file, "r", encoding="utf-8") as f:
                    content["intro"] = f.read()
                print(f"  ✓ 找到 Markdown 內容: {md_file.name}")
            except Exception as e:
                print(f"  ⚠ 無法讀取 Markdown: {e}")
        else:
            print(f"  ⚠ 找不到 Markdown 檔案: {md_file.name}")

        examples = []

        # 遍歷該章節的所有 Python 檔案
        for py_file in sorted(chapter_dir.glob("*.py"), key=natural_sort_key):
            # 跳過 Detail 檔案
            if "Detail" in py_file.name:
                continue

            try:
                # 讀取程式碼
                with open(py_file, "r", encoding="utf-8") as f:
                    code = f.read()

                # 提取範例編號
                example_num = py_file.stem.split("_")[-1]

                # 嘗試從程式碼中提取標題
                code_title = extract_title_from_code(code)
                example_title = f"{chapter_id.replace('B2_Ch', '')}.{example_num}"
                if code_title:
                    example_title += f" {code_title}"

                examples.append(
                    {
                        "id": f"ex{example_num}",
                        "title": example_title,
                        "filename": py_file.name,
                        "code": code,
                    }
                )

            except Exception as e:
                print(f"  警告：無法處理 {py_file.name}: {e}")

        if examples or content:
            # 提取章節數字
            try:
                chapter_num = int(re.search(r"B2_Ch(\d+)", chapter_id).group(1))
            except Exception:
                chapter_num = 0

            chapters.append(
                {
                    "id": chapter_id.lower(),
                    "title": chapter_title,
                    "number": chapter_num,
                    "content": content,
                    "examples": examples,
                }
            )
            print(f"  ✓ 已處理 {len(examples)} 個範例")

    # 輸出 JSON
    output_dir = base_path / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)

    def sanitize_strings(obj):
        """
        Recursively walk a data structure and escape single backslashes in strings.
        This avoids producing JSON with raw unescaped backslashes (e.g. LaTeX commands)
        which can break JS JSON parsers when embedded or transferred.
        """
        if isinstance(obj, str):
            # Replace single backslash with double-backslash
            return obj.replace("\\", "\\\\")
        elif isinstance(obj, dict):
            return {k: sanitize_strings(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [sanitize_strings(v) for v in obj]
        else:
            return obj

    output_file = output_dir / "chapters.json"
    sanitized = sanitize_strings(chapters)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(sanitized, f, ensure_ascii=False, indent=2)

    # Also write per-chapter files and an index for per-chapter editing
    index = []
    for ch in chapters:
        # filename pattern: chapters_<id>.json (id already lowercased)
        fname = f"chapters_{ch['id']}.json"
        fpath = output_dir / fname
        with open(fpath, "w", encoding="utf-8") as cf:
            json.dump(sanitize_strings(ch), cf, ensure_ascii=False, indent=2)
        index.append(
            {
                "id": ch["id"],
                "title": ch.get("title", ""),
                "number": ch.get("number", 0),
                "file": fname,
            }
        )

    # write index file
    index_file = output_dir / "chapters_index.json"
    with open(index_file, "w", encoding="utf-8") as jf:
        json.dump(index, jf, ensure_ascii=False, indent=2)

    print(f"\n✓ 成功建立 {output_file}")
    print(f"  另存為各章節檔案及索引: {index_file.name}")
    print(f"  總共 {len(chapters)} 個章節")
    print(f"  總共 {sum(len(ch['examples']) for ch in chapters)} 個範例")


if __name__ == "__main__":
    build_chapters_json()
