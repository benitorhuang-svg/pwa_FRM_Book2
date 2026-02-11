import json
import os


def consolidate_all():
    output_dir = "public/data"
    all_chapters = []

    # We want to maintain order 1 to 12
    for i in range(1, 13):
        fname = f"chapters_b2_ch{i}.json"
        fpath = os.path.join(output_dir, fname)

        if os.path.exists(fpath):
            with open(fpath, "r", encoding="utf-8") as f:
                ch_data = json.load(f)
                all_chapters.append(ch_data)
                print(f"[INFO] Loaded {fname}")
        else:
            print(f"[WARNING] {fname} not found, skipping...")

    # Monolithic chapters.json generation REMOVED for performance
    # master_file = os.path.join(output_dir, "chapters.json")
    # with open(master_file, 'w', encoding='utf-8') as f:
    #     json.dump(all_chapters, f, ensure_ascii=False, indent=2)

    # Also update chapters_index.json for consistency
    index = []
    for ch in all_chapters:
        index.append(
            {
                "id": ch["id"],
                "title": ch.get("title", ""),
                "number": ch.get("number", 0),
                "file": f"chapters_{ch['id']}.json",
            }
        )

    index_file = os.path.join(output_dir, "chapters_index.json")
    with open(index_file, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"\n[SUCCESS] Chapter Index generated: {index_file}")
    print(f"Total chapters: {len(all_chapters)}")


if __name__ == "__main__":
    consolidate_all()
