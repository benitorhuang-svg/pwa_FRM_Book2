#!/usr/bin/env python3
"""Combined audit tool

Modes:
  - examples : run the lightweight examples audit (checks scenarios table vs examples)
  - deep     : run deep audit comparing source files under Book2_Python_Code vs public/data JSON
  - all      : run both (examples then deep)

Usage: python scripts/audit.py --mode all
"""

import argparse
import json
import os
import re
from pathlib import Path


def extract_filenames_from_markdown_table(markdown_table):
    filenames = []
    if not markdown_table:
        return []

    lines = markdown_table.split("\n")
    for line in lines:
        if "|" in line and ".py" in line:
            parts = line.split("|")
            if len(parts) >= 3:
                for part in parts:
                    match = re.search(r"B2_Ch\d+_\d+\.py", part)
                    if match:
                        filenames.append(match.group(0))
                        break
    return filenames


def audit_examples(data_dir: Path):
    print("Running examples audit...")
    files = sorted(
        [
            f
            for f in os.listdir(data_dir)
            if f.startswith("chapters_b2_ch") and f.endswith(".json")
        ]
    )

    for f in files:
        path = data_dir / f
        try:
            with open(path, "r", encoding="utf-8") as fh:
                data = json.load(fh)

            chapter_title = data.get("title", "Unknown")
            chapter_id = data.get("id", f)

            scenarios_md = ""
            content = data.get("content", {})
            if isinstance(content, dict):
                intro = content.get("intro", {})
                if isinstance(intro, dict):
                    impl = intro.get("implementation", {})
                    if isinstance(impl, dict):
                        scenarios_md = impl.get("scenarios", "")
                elif isinstance(intro, str):
                    # fallback: nothing
                    pass

            expected_files = extract_filenames_from_markdown_table(scenarios_md)

            examples = data.get("content", {}).get("examples", [])
            if not examples:
                examples = data.get("examples", [])

            actual_files = [ex.get("filename") for ex in examples] if examples else []

            missing = [x for x in expected_files if x not in actual_files]

            if missing:
                print(
                    f"[FAIL-MISSING] {chapter_id} ({chapter_title}): Missing {len(missing)} examples"
                )
                for m in missing:
                    print(f"  - {m}")
            elif not expected_files:
                # not necessarily an error
                print(
                    f"[WARN] {chapter_id}: No expected files found in scenarios table."
                )

            empty_code = []
            for ex in examples or []:
                code = ex.get("code", "")
                if not code or len(code.strip()) < 20:
                    empty_code.append(ex.get("filename", "Unknown"))

            if empty_code:
                print(
                    f"[FAIL-EMPTY] {chapter_id}: Found {len(empty_code)} examples with empty/short code."
                )
                for e in empty_code:
                    print(f"  - {e}")

            if not missing and not empty_code and expected_files:
                print(
                    f"[PASS] {chapter_id}: All {len(expected_files)} examples present and populated."
                )

        except Exception as e:
            print(f"[ERROR] {path}: {e}")


def deep_audit(
    base_dir: Path, data_dir: Path, out_file: Path, source_override: str = None
):
    print("Running deep audit (source -> JSON)...")

    # Resolve source directory with priority: CLI override -> env BOOK2_SOURCE -> default sibling location -> common absolute from update_examples.py  # noqa: E501
    if source_override:
        SOURCE_BASE = Path(source_override)
    elif os.environ.get("BOOK2_SOURCE"):
        SOURCE_BASE = Path(os.environ.get("BOOK2_SOURCE"))
    else:
        SOURCE_BASE = (
            base_dir
            / "Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇"
            / "Book2_Python_Code"
        )

    # fallback common absolute path used elsewhere in scripts
    if not SOURCE_BASE.exists():
        fallback = Path(
            r"c:\Users\benit\Desktop\FRM MATLAB\Python\Book2_手術刀般精準的FRM用Python科學管控財金風險_實戰篇\Book2_Python_Code"  # noqa: E501
        )
        if fallback.exists():
            SOURCE_BASE = fallback

    if not SOURCE_BASE.exists():
        print(f"[ERROR] Source directory not found: {SOURCE_BASE}")
        return

    source_map = {}
    for root, _, files in os.walk(SOURCE_BASE):
        for file in files:
            if file.endswith(".py") and file.startswith("B2_Ch"):
                source_map[file] = os.path.join(root, file)

    source_chapters = {}
    for filename in source_map.keys():
        m = re.match(r"(B2_Ch(\d+))_\d+\.py", filename)
        if m:
            ch_num = m.group(2)
            ch_id = f"b2_ch{ch_num}"
            source_chapters.setdefault(ch_id, []).append(filename)

    missing_report = {}

    for ch_id, files in source_chapters.items():
        json_path = data_dir / f"chapters_{ch_id}.json"
        if not json_path.exists():
            print(f"[WARN] JSON for {ch_id} not found at {json_path}")
            missing_report[ch_id] = {f: source_map[f] for f in files}
            continue

        with open(json_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)

        examples = data.get("content", {}).get("examples", [])
        if not examples:
            examples = data.get("examples", [])

        existing_filenames = {ex.get("filename") for ex in examples}
        missing = [f for f in files if f not in existing_filenames]
        if missing:
            missing_report[ch_id] = {f: source_map[f] for f in missing}
            print(
                f"[FAIL] {ch_id}: Missing {len(missing)} examples locally present in source."
            )
            for m in missing:
                print(f"  - {m}")

    with open(out_file, "w", encoding="utf-8") as of:
        json.dump(missing_report, of, indent=2, ensure_ascii=False)

    print(f"Deep audit complete. Results saved to {out_file}")


def main():
    parser = argparse.ArgumentParser(description="Combined audit for pwa_Book2_python")
    parser.add_argument("--mode", choices=["examples", "deep", "all"], default="all")
    parser.add_argument(
        "--source", help="Path to Book2_Python_Code directory (overrides defaults)"
    )
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    data_dir = project_root / "public" / "data"

    if args.mode in ("examples", "all"):
        audit_examples(data_dir)

    if args.mode in ("deep", "all"):
        out_file = project_root / "audit_result.json"
        deep_audit(project_root, data_dir, out_file, source_override=args.source)


if __name__ == "__main__":
    main()
