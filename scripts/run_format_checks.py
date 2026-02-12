#!/usr/bin/env python3
"""
Run ESLint and `uv run ruff` only when the repo has modified files.

Usage:
  python scripts/run_format_checks.py

This script checks `git status --porcelain` for any modified/added files
and will execute ESLint (via npx) and `uv run ruff` when changes are present.
"""

import subprocess
import sys
import shutil
import os


def git_has_changes():
    try:
        out = subprocess.check_output(["git", "status", "--porcelain"], text=True)
        return bool(out.strip())
    except Exception as e:
        print("Failed to check git status:", e)
        return True  # conservative: assume changes so checks run


def run_cmd(cmd):
    print("Running:", " ".join(cmd))
    try:
        subprocess.check_call(cmd)
        return 0
    except subprocess.CalledProcessError as e:
        print(f"Command failed (exit {e.returncode}):", " ".join(cmd))
        return e.returncode
    except FileNotFoundError as e:
        print(f"Command not found: {cmd[0]} — skipping: {e}")
        return 127


def main():
    if not git_has_changes():
        print("No modified files detected — skipping eslint and ruff.")
        return 0

    # ESLint: prefer local node_modules/.bin, then npx, then global eslint
    eslint_cmd = None
    local_eslint = os.path.join("node_modules", ".bin", "eslint")
    if os.name == "nt":
        local_eslint = local_eslint + ".cmd"

    if os.path.isfile(local_eslint):
        eslint_cmd = [local_eslint, "--ext", ".js,.jsx", "."]
    elif shutil.which("npx"):
        eslint_cmd = ["npx", "eslint", "--ext", ".js,.jsx", "."]
    elif shutil.which("eslint"):
        eslint_cmd = ["eslint", "--ext", ".js,.jsx", "."]
    else:
        print(
            "eslint not available (no npx/eslint in PATH, and no local node_modules/.bin). Skipping eslint."
        )

    code = 0
    if eslint_cmd:
        code = run_cmd(eslint_cmd)

    # Ruff: prefer `ruff` CLI with a check command, then `uv run ruff`, then `python -m ruff`
    ruff_cmd = None
    if shutil.which("ruff"):
        ruff_cmd = ["ruff", "check", "."]
    elif shutil.which("uv"):
        ruff_cmd = ["uv", "run", "ruff", "check", "."]
    else:
        # try as module
        ruff_cmd = [sys.executable, "-m", "ruff", "check", "."]

    code2 = run_cmd(ruff_cmd)

    if code != 0 or code2 != 0:
        print("One or more format/lint checks failed.")
        return 1

    print("All format/lint checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
