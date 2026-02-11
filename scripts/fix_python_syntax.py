import os
import re
from pathlib import Path


def fix_python_files(code_dir):
    pattern = re.compile(r"^(B2_Ch\d+_\d+_[A-Z]\.py\s*)$", re.MULTILINE)

    count = 0
    for root, dirs, files in os.walk(code_dir):
        for file in files:
            if file.endswith(".py"):
                file_path = Path(root) / file
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                new_content = pattern.sub(r"# \1", content)

                if new_content != content:
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Fixed: {file_path.relative_to(code_dir)}")
                    count += 1

    return count


if __name__ == "__main__":
    code_dir = (
        r"c:\Users\benit\Desktop\FRM MATLAB\Python\Book2_手術刀般精準的FRM"
        r"用Python科學管控"
        r"財金風險_實戰篇\Book2_Python_Code"
    )
    print(f"Starting to fix files in: {code_dir}")
    fixed_count = fix_python_files(code_dir)
    print(f"Finished. Fixed {fixed_count} files.")
