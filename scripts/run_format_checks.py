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


def main():
    if not git_has_changes():
        print("No modified files detected — skipping eslint and ruff.")
        return 0

    # ESLint (use npx to avoid global deps)
    eslint_cmd = ["npx", "eslint", "--ext", ".js,.jsx", "."]
    code = run_cmd(eslint_cmd)

    # Ruff via uv wrapper (project uses `uv run ruff` convention)
    ruff_cmd = ["uv", "run", "ruff"]
    code2 = run_cmd(ruff_cmd)

    if code != 0 or code2 != 0:
        print("One or more format/lint checks failed.")
        return 1

    print("All format/lint checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
