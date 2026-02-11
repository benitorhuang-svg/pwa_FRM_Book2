---
name: educational-content-writer
description: A skill to generate high-depth, educational content for financial risk management chapters.
license: MIT
version: 1.3.3
---

# Educational Content Writer Skill (Senior Practitioner Edition)

This skill transforms technical summaries into **Enterprise-Grade** educational playbooks using an **Assertive Tone**, **Strong QA**, and **Explicit Templates**.

## Writing Standards (v1.3.3)

### 1. Assertive Delivery
Avoid all hesitant phrasing. State facts and conclusions directly. 
- *Correct*: "We implement EWMA because it excels at capturing short-term volatility bursts."
- *Incorrect*: "We might want to use EWMA because it could be better at capturing spikes."

### 2. Decision Matrices & Action Checklists
Every section must include a comparative table (Matrix) and a professional set of Action Items (Checklist).

### 3. Syntactic Integrity (JSON Escaping)
All LaTeX backslashes MUST be double-escaped: `\\`.

---

## [GOLD STANDARD] Writing Template
Use this exact structure for every modular JSON file. Copy and adapt:

```json
{
  "content": "### {Section ID} {Title}: {Professional Hook}\n{Assertive introductory paragraph explaining the 'Why' for a senior practitioner.}\n\n#### {Decision Matrix Title}\n| Dimension | Option A | Option B |\n| :--- | :--- | :--- |\n| **Key Metric** | Metric A | Metric B |\n| **Best For** | Scenario A | Scenario B |\n\n#### {Technical Analysis Title}\n{Deep dive into the logic with aligned math.}\n\n$$\n\\begin{aligned}\n  \\text{Step 1} &= \\text{Formula 1} \\\\\n  \\text{Step 2} &= \\text{Formula 2}\n\\end{aligned}\n$$\n\n> [!IMPORTANT]\n> Tech Stack Instruction: Use **NumPy** or **Pandas** vectorized operations to ensure O(N) efficiency in production.\n\n#### {Section ID} Senior Practitioner Action Items\n- **Criterion A**: Mandatory validation step.\n- **Criterion B**: Production stability check.\n\n#### Core Technical Conclusion\n{Closing authoritative statement summarizing the strategic takeaway.}"
}
```

---

## Modular Workflow
1.  **Draft**: Use `public/data/modular/`. Follow the **[GOLD STANDARD]** template.
2.  **Merge & Lint**: `python skills/educational-content-writer/scripts/merge_bodies.py <chapter_id>`
3.  **Validate**: `python skills/educational-content-writer/scripts/validate_chapter.py <path_to_main_json>`

## Scripts
- **`merge_bodies.py`**: Mandatory JSON syntax check before merging.
- **`validate_chapter.py`**: Automated metric monitoring (Tables, Math, Checklists).
