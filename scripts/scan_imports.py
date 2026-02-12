import os
import json
import re

DATA_DIR = r"c:\Users\benit\Desktop\FRM MATLAB\Python\pwa_Book2_python\public\data"


def scan_imports():
    imports = set()

    for filename in os.listdir(DATA_DIR):
        if filename.startswith("chapters_b2_ch") and filename.endswith(".json"):
            filepath = os.path.join(DATA_DIR, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)

                if "content" in data and "examples" in data["content"]:
                    for example in data["content"]["examples"]:
                        code = example.get("code", "")
                        # Regex for 'import X' and 'from X import Y'
                        # Capture group 1: import X
                        # Capture group 2: from X
                        matches = re.findall(
                            r"^\s*import\s+([\w\.]+)|^\s*from\s+([\w\.]+)\s+import",
                            code,
                            re.MULTILINE,
                        )

                        for m in matches:
                            # m is a tuple like ('numpy', '') or ('', 'pandas')
                            pkg = m[0] if m[0] else m[1]
                            if pkg:
                                # Get the top-level package name
                                top_level = pkg.split(".")[0]
                                imports.add(top_level)
            except Exception as e:
                print(f"Error reading {filename}: {e}")

    return sorted(list(imports))


if __name__ == "__main__":
    all_imports = scan_imports()
    print("Found imports:")
    for i in all_imports:
        print(f"- {i}")

    # Attempt to update src/App.jsx MODULE_MAPPING automatically
    try:
        from pathlib import Path

        proj_root = Path(__file__).resolve().parent.parent
        app_path = proj_root / "src" / "App.jsx"
        if app_path.exists():
            app_text = app_path.read_text(encoding="utf-8")

            # Find existing MODULE_MAPPING block
            import re

            m = re.search(
                r"const\s+MODULE_MAPPING\s*=\s*\{(.*?)\}\s*\n", app_text, re.S
            )
            existing_map = {}
            if m:
                body = m.group(1)
                # find 'key': 'value' pairs
                for kv in re.finditer(
                    r"['\"]([A-Za-z0-9_\-]+)['\"]\s*:\s*['\"]([^'\"]+)['\"]", body
                ):
                    k = kv.group(1)
                    v = kv.group(2)
                    existing_map[k] = v

            # preferred overrides for some common mappings
            overrides = {
                "sklearn": "scikit-learn",
                "scikit_learn": "scikit-learn",
                "pylab": "matplotlib",
                "mpl_toolkits": "matplotlib",
            }

            # Merge: keep existing_map, add new imports -> map to itself or override
            merged = dict(existing_map)
            for pkg in all_imports:
                if pkg in merged:
                    continue
                target = overrides.get(pkg, pkg)
                merged[pkg] = target

            # Build formatted mapping string (sorted keys)
            lines = []
            lines.append("const MODULE_MAPPING = {")
            for k in sorted(merged.keys()):
                v = merged[k]
                lines.append(f"  '{k}': '{v}',")
            lines.append("}")
            new_mapping_block = "\n".join(lines) + "\n\n"

            # Replace the old block if present, otherwise insert near top after the comment
            if m:
                new_app_text = (
                    app_text[: m.start()] + new_mapping_block + app_text[m.end() :]
                )
            else:
                # fallback: insert after the Module mapping comment if present
                insert_after = re.search(
                    r"// Module to package/wheel mapping for lazy loading", app_text
                )
                if insert_after:
                    idx = insert_after.end()
                    new_app_text = (
                        app_text[:idx] + "\n\n" + new_mapping_block + app_text[idx:]
                    )
                else:
                    new_app_text = new_mapping_block + app_text

            # Backup and write
            bak = app_path.with_suffix(".jsx.bak")
            app_path.replace(bak)
            app_path.write_text(new_app_text, encoding="utf-8")
            print(f"Updated MODULE_MAPPING in {app_path} (backup: {bak.name})")
        else:
            print(f"App.jsx not found at expected path: {app_path}")
    except Exception as e:
        print(f"Failed to update App.jsx MODULE_MAPPING: {e}")
