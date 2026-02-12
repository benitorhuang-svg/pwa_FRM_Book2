description: Run format/lint checks and push to remote only if they pass
---

// turbo
1. Run the following command to perform a verified push:
```powershell
python scripts/run_format_checks.py; if ($LASTEXITCODE -eq 0) { $st = git status --porcelain; if ($st) { git add -A; git commit -m "**{type}({scope})**: **{subject}**" }; git push } else { Write-Host "Lint/Format checks failed. Push aborted." -ForegroundColor Red }
```

- **type**: feat, fix, docs, style, refactor, perf, test, chore
- **scope**: The area of the change (e.g., chapters, style, core)
- **subject**: Concise description of the changes
