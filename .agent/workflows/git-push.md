---
description: Check for changes, commit if any, and push to remote
---

// turbo
1. Run the following command to check status, commit, and push:
```powershell
$st = git status --porcelain; if ($st) { git add -A; git commit -m "docs: update DDD with recent implementation changes" } ; git push
```