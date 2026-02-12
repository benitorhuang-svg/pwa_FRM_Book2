---
description: Review project structure, clean up temporary debris, and optimize documentation
---

1. **Review Project Structure**:
   - List the root and `public/data` directories to identify redundant files.
   - Look for `.bak`, `audit_result.json`, or one-time fix scripts.

2. **Clean Up Debris**:
// turbo
   - Run the following command to clear common temporary files and caches:
   ```powershell
   Remove-Item -Path public/data/*.bak -ErrorAction SilentlyContinue; 
   Remove-Item -Path audit_result.json -ErrorAction SilentlyContinue; 
   Get-ChildItem -Path . -Recurse -Directory -Filter __pycache__ | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue;
   Get-ChildItem -Path . -Recurse -Directory -Filter .ruff_cache | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
   ```

3. **Optimize Documentation**:
   - Check `.agent/skills` to ensure they are concise and reference specialized files instead of duplicating content.
   - Verify all links to localized `.md` files are correct.

4. **Verify and Push**:
// turbo
   - Use the verified push workflow to synchronize changes:
   ```powershell
   python scripts/run_format_checks.py; if ($LASTEXITCODE -eq 0) { $st = git status --porcelain; if ($st) { git add -A; git commit -m "chore(cleanup): optimize repo structure and documentation" }; git push }
   ```
