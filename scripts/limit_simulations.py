#!/usr/bin/env python3
"""Scan example scripts and JSON-embedded code, and add runtime guards
to limit heavy Monte Carlo / simulation counts.

This script creates .bak backups before modifying files.
It looks for common variables: MC_num, MC_sim_num, sim_num, sim_steps,
and MC_num_list and inserts a small guard after each definition.
"""

import re
import json
from pathlib import Path

# configurable cap
CAP = 1000

PY_GLOBS = [
    "**/Book2_Python_Code/**/*.py",
    "pwa_Book2_python/dist/data/*.json",
    "pwa_Book2_python/dist/data/modular/**/*.json",
]

VAR_PATTERNS = [
    r"^(\s*)(MC_num)\s*=\s*(\d+)",
    r"^(\s*)(MC_sim_num)\s*=\s*(\d+)",
    r"^(\s*)(sim_num)\s*=\s*(\d+)",
    r"^(\s*)(sim_steps)\s*=\s*(\d+)",
    r"^(\s*)(MC_sim_num)\s*=\s*(\d+)",
    r"^(\s*)(MC_num_list)\s*=\s*(\[.*\])",
]

GUARD_TEMPLATE = (
    "{indent}# --- added by limit_simulations.py: apply cap {cap}\n"
    "{indent}__SIM_CAP = {cap}\n"
    "{indent}try:\n"
    "{indent}    if {var} > __SIM_CAP:\n"
    "{indent}        print('Reducing {var} from', {var}, 'to', __SIM_CAP, 'to avoid heavy computation.')\n"
    "{indent}        {var} = __SIM_CAP\n"
    "{indent}except Exception:\n"
    "{indent}    pass\n"
)

LIST_GUARD_TEMPLATE = (
    "{indent}# --- added by limit_simulations.py: cap list values\n"
    "{indent}__SIM_CAP = {cap}\n"
    "{indent}try:\n"
    "{indent}    {var} = [min(int(x), __SIM_CAP) if isinstance(x, (int, float)) else x for x in {var}]\n"
    "{indent}except Exception:\n"
    "{indent}    pass\n"
)


def process_text(text: str) -> (str, int):
    """Return modified text and number of insertions made."""
    lines = text.splitlines()
    out = []
    inserts = 0
    for i, line in enumerate(lines):
        out.append(line)
        for pat in VAR_PATTERNS:
            m = re.match(pat, line)
            if not m:
                continue
            indent = m.group(1) or ""
            var = m.group(2)
            # choose list or scalar template
            if var.endswith("list"):
                guard = LIST_GUARD_TEMPLATE.format(indent=indent, var=var, cap=CAP)
            else:
                guard = GUARD_TEMPLATE.format(indent=indent, var=var, cap=CAP)
            out.append(guard)
            inserts += 1
            break
    return "\n".join(out) + ("\n" if text and not text.endswith("\n") else ""), inserts


def main():
    total = 0
    for g in PY_GLOBS:
        for p in Path(".").glob(g):
            if p.is_dir():
                continue
            try:
                if p.suffix.lower() == ".json":
                    # parse JSON and process string fields that look like code
                    j = json.loads(p.read_text(encoding="utf-8"))
                    modified = False

                    def walk(obj):
                        nonlocal modified
                        if isinstance(obj, dict):
                            for k, v in obj.items():
                                if isinstance(v, str) and any(
                                    token in v
                                    for token in [
                                        "MC_num",
                                        "MC_sim_num",
                                        "sim_num",
                                        "sim_steps",
                                        "sim_num_list",
                                    ]
                                ):
                                    new_v, inserts = process_text(v)
                                    if inserts:
                                        obj[k] = new_v
                                        modified = True
                                else:
                                    walk(v)
                        elif isinstance(obj, list):
                            for i, item in enumerate(obj):
                                if isinstance(item, str) and any(
                                    token in item
                                    for token in [
                                        "MC_num",
                                        "MC_sim_num",
                                        "sim_num",
                                        "sim_steps",
                                        "MC_num_list",
                                    ]
                                ):
                                    new_item, inserts = process_text(item)
                                    if inserts:
                                        obj[i] = new_item
                                        modified = True
                                else:
                                    walk(item)

                    walk(j)
                    if modified:
                        bak = p.with_suffix(".json.bak")
                        p.rename(bak)
                        p.write_text(
                            json.dumps(j, ensure_ascii=False, indent=2),
                            encoding="utf-8",
                        )
                        print(
                            f"Updated {p} — inserted guards into JSON code fields; backup: {bak}"
                        )
                        total += 1
                else:
                    text = p.read_text(encoding="utf-8")
                    new_text, inserts = process_text(text)
                    if inserts:
                        bak = p.with_suffix(p.suffix + ".bak")
                        p.rename(bak)
                        p.write_text(new_text, encoding="utf-8")
                        print(
                            f"Updated {p} — inserted {inserts} guard(s); backup: {bak}"
                        )
                        total += inserts
            except Exception:
                continue
    print(f"Done. Total guards inserted: {total}")


if __name__ == "__main__":
    main()
