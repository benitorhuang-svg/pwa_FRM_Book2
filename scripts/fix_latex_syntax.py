import os
import json
import re

# Base directory relative to where script is run
# Assuming running from project root
BASE_DIR = os.getcwd()
MODULAR_DATA_DIR = os.path.join(BASE_DIR, "public", "data", "modular")


def fix_latex_content(content):
    """
    Scans the content string for regex matches and replaces them.
    Returns the modified content and a boolean indicating if changes were made.
    """
    original_content = content

    # Pattern: Look for \begin{aligned} ... \end{aligned} wrapped in SINGLE $
    # We want to replace single $ with double $$

    # Regex logic:
    # (?<!\$)\$             : Match a single $ not preceded by $
    # (\s*)                 : Capture optional whitespace (group 1)
    # (\\begin\{aligned\}.*?\\end\{aligned\}) : Capture the aligned block (group 2)
    # (\s*)                 : Capture optional whitespace (group 3)
    # \$(?!\$)              : Match a single $ not followed by $

    pattern = r"(?<!\$)\$(\s*)(\\begin\{aligned\}.*?\\end\{aligned\})(\s*)\$(?!\$)"

    def replacement(match):
        # We only need the aligned block (group 2)
        g2 = match.group(2)

        # Force double dollars and cleaner spacing
        return f"\n$$\n{g2}\n$$\n"

    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    return new_content, new_content != original_content


def process_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        changed = False

        if (
            isinstance(data, dict)
            and "content" in data
            and isinstance(data["content"], str)
        ):
            new_content, was_modified = fix_latex_content(data["content"])
            if was_modified:
                data["content"] = new_content
                changed = True
                print(f"[FIXING] {os.path.basename(filepath)}")

        if changed:
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            return True

    except Exception as e:
        print(f"[ERROR] Failed to process {filepath}: {e}")
        return False


def main():
    if not os.path.exists(MODULAR_DATA_DIR):
        print(f"Directory not found: {MODULAR_DATA_DIR}")
        print(f"Current working directory: {os.getcwd()}")
        return

    print(
        f"Scanning {MODULAR_DATA_DIR} and subdirectories for single-$ aligned blocks..."
    )

    count = 0
    fixed_count = 0

    for root, dirs, files in os.walk(MODULAR_DATA_DIR):
        for file in files:
            if file.endswith(".json"):
                filepath = os.path.join(root, file)
                if process_file(filepath):
                    fixed_count += 1
                count += 1

    print(f"Scan complete. Checked {count} files. Fixed {fixed_count} files.")


if __name__ == "__main__":
    main()
