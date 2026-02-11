#!/usr/bin/env python3
"""Enrich per-chapter JSON files by ensuring `content.intro` contains
structured sections: Roadmap, Value, Implementation, and Body. Insert
chapter-specific KaTeX examples where applicable.

This is conservative: it will not overwrite if the section headings
already exist. Run before `build-chapters.py` to regenerate merged JSON.
"""

import json
import glob
import os

BASE = os.path.join(os.path.dirname(__file__), "..", "public", "data")

CHUNK_TEMPLATES = {
    "default": {
        "roadmap": "### Roadmap\n\n- 闡述本章節學習路徑與重點。",
        "value": "### Value\n\n- 實務價值與主要應用情境。",
        "implementation": (
            "### Implementation\n\n- 在 Python 中的實作要點與註記"
            "（含套件建議：numpy, pandas, matplotlib）。"
        ),
    },
    "b2_ch2": {
        "roadmap": "### Roadmap\n\n- 建構維納過程、理解伊藤引理，練習 GBM 模擬。",
        "value": "### Value\n\n- 用於資產價格模擬、風險情境與蒙地卡羅定價。",
        "implementation": (
            "### Implementation\n\n- 關鍵公式：幾何布朗運動與伊藤引理，"
            "示範離散化與蒙地卡羅。"
        ),
        "katex": (
            "$$dS_t = \\mu S_t dt + \\sigma S_t dW_t\\\\n"
            "S_{t+\\Delta t}=S_t\\exp\\left((\\mu-\\tfrac{1}{2}\\sigma^2)\\Delta t+"
            "\\sigma\\sqrt{\\Delta t}Z\\right)$$"
        ),
    },
}


def enrich_file(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    intro_md = data.get("content", {}).get("intro", "")
    # If intro already contains '### Roadmap' assume structured enough
    if "### Roadmap" in intro_md or "## Roadmap" in intro_md:
        return False

    # choose template
    key = data.get("id", "").lower()
    tpl = CHUNK_TEMPLATES.get(key, CHUNK_TEMPLATES["default"])

    parts = []
    parts.append("# " + data.get("title", ""))
    parts.append("")
    parts.append(tpl.get("roadmap"))
    parts.append("")
    parts.append(tpl.get("value"))
    parts.append("")
    parts.append(tpl.get("implementation"))
    parts.append("")
    if "katex" in tpl:
        parts.append("#### 關鍵公式")
        parts.append("")
        parts.append(tpl["katex"])
        parts.append("")

    parts.append("---")
    parts.append("")
    parts.append("## 詳細內容")
    parts.append("")
    # keep original intro as 'body' to preserve existing details
    parts.append(intro_md)

    new_intro = "\n".join(parts)

    data["content"]["intro"] = new_intro

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return True


def main():
    pattern = os.path.join(BASE, "chapters_b2_ch*.json")
    files = sorted(glob.glob(pattern))
    if not files:
        print("No chapter files found in", BASE)
        return

    updated = 0
    for p in files:
        ok = enrich_file(p)
        if ok:
            print("Enriched", os.path.basename(p))
            updated += 1
        else:
            print("Skipped (already structured):", os.path.basename(p))

    print("\nTotal enriched:", updated, "of", len(files))


if __name__ == "__main__":
    main()
