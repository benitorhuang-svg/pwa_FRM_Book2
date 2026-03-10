from __future__ import annotations

import argparse
import re
from pathlib import Path


CHAPTER_META = {
    2: {
        "scene_title": "把市場動態寫成可推演的機率路徑",
        "role_scene": "建構隨機模型或衍生品定價引擎",
        "chapter_goal": "後續 Markov、Itô 與 GBM 的建模判斷",
        "concept": "市場狀態如何隨時間演化",
        "decision": "把抽象隨機性轉成可計算的路徑假設",
        "accent": "#14b8a6",
        "accent_soft": "#ccfbf1",
    },
    3: {
        "scene_title": "讓沒有解析解的問題仍然可以被定價",
        "role_scene": "為路徑相依商品建立模擬流程",
        "chapter_goal": "抽樣設計、收斂控制與數值定價決策",
        "concept": "把複雜問題轉成抽樣與平均",
        "decision": "在精度、速度與樣本量之間做工程取捨",
        "accent": "#60a5fa",
        "accent_soft": "#dbeafe",
    },
    4: {
        "scene_title": "把資料關係轉成可驗證的統計模型",
        "role_scene": "校驗因子、報酬與違約機率的關係",
        "chapter_goal": "模型選型、診斷與解釋性溝通",
        "concept": "變數之間的線性與非線性聯動",
        "decision": "把資料訊號整理成可檢驗的回歸結論",
        "accent": "#f59e0b",
        "accent_soft": "#fef3c7",
    },
    5: {
        "scene_title": "在離散樹狀世界裡逆推出公允價格",
        "role_scene": "用樹模型為選擇權定價與風險拆解",
        "chapter_goal": "節點估值、收斂性與提前行權決策",
        "concept": "把連續風險壓縮成可回推的離散節點",
        "decision": "確認定價、對沖與行權規則是否一致",
        "accent": "#f97316",
        "accent_soft": "#ffedd5",
    },
    6: {
        "scene_title": "用封閉解快速對照市場價格與理論價格",
        "role_scene": "用 BSM 家族模型對照市場報價",
        "chapter_goal": "參數校準、報價比較與模型適用性檢查",
        "concept": "價格、波動率與時間價值的封閉式關係",
        "decision": "判斷理論價格能否支撐交易與估值流程",
        "accent": "#ef4444",
        "accent_soft": "#fee2e2",
    },
    7: {
        "scene_title": "用敏感度儀表板拆解持倉風險",
        "role_scene": "管理選擇權簿冊的動態對沖",
        "chapter_goal": "對沖頻率、風險轉移與成本控制",
        "concept": "持倉價格對市場變數的敏感度",
        "decision": "把風險暴露拆成可監控的 Greeks 指標",
        "accent": "#a855f7",
        "accent_soft": "#f3e8ff",
    },
    8: {
        "scene_title": "在損失分佈中找出真正的尾部風險",
        "role_scene": "設計交易部位的市場風險限額",
        "chapter_goal": "限額設定、壓力測試與監管口徑比較",
        "concept": "損失分佈、信賴水準與尾部事件",
        "decision": "用可落地的風險指標支持監管與風控決策",
        "accent": "#22c55e",
        "accent_soft": "#dcfce7",
    },
    9: {
        "scene_title": "從違約資料中萃取可落地的信用訊號",
        "role_scene": "建立授信與評分流程",
        "chapter_goal": "PD、LGD、EAD 估計與信用監控",
        "concept": "違約機率、損失率與信用遷移結構",
        "decision": "把信用事件轉成可量化的風險參數",
        "accent": "#06b6d4",
        "accent_soft": "#cffafe",
    },
    10: {
        "scene_title": "把交易對手曝露轉成可定價的信用成本",
        "role_scene": "計算衍生品對手方的信用曝露",
        "chapter_goal": "EE、PFE、CVA 與錯向風險控制",
        "concept": "未來曝露路徑與對手方品質的交互作用",
        "decision": "讓 CCR 度量真正進入定價與限額管理",
        "accent": "#38bdf8",
        "accent_soft": "#e0f2fe",
    },
    11: {
        "scene_title": "在報酬與變異之間找出可行邊界",
        "role_scene": "規劃多資產組合的風險分散",
        "chapter_goal": "有效前緣定位與投組優化",
        "concept": "期望報酬、變異數與共變異結構",
        "decision": "找到每單位風險下更有效率的組合配置",
        "accent": "#8b5cf6",
        "accent_soft": "#ede9fe",
    },
    12: {
        "scene_title": "把風險承受度轉成最終資本配置",
        "role_scene": "將無風險資產與風險資產做資本配置",
        "chapter_goal": "最佳完全投組與 CAPM 直覺",
        "concept": "效用、夏普比率與資本市場線",
        "decision": "把投資偏好落成可執行的資產配置方案",
        "accent": "#ec4899",
        "accent_soft": "#fce7f3",
    },
}


ACTION_ITEMS_RE = re.compile(r"^####\s+\d+\.\d+.*Action Items\)", re.MULTILINE)


def detect_newline(text: str) -> str:
    return "\r\n" if "\r\n" in text else "\n"


def section_heading(text: str) -> str:
    for line in text.splitlines():
        if line.startswith("### "):
            return line[4:].strip()
    raise ValueError("Missing section heading")


def section_id_from_heading(heading: str) -> str:
    return heading.split(" ", 1)[0]


def short_focus(heading: str) -> str:
    title = re.sub(r"^\d+\.\d+\s+", "", heading)
    title = title.split("：", 1)[0].split(":", 1)[0]
    title = re.sub(r"\s*\([^)]*\)", "", title).strip()
    return title


def make_story(heading: str, meta: dict[str, str]) -> str:
    focus = short_focus(heading)
    return (
        f"> **📖 實戰場景 (Story Guide)：{meta['scene_title']}**\n"
        f"> 當你在{meta['role_scene']}時，{focus}不是孤立的術語，而是整條決策鏈上的一個節點。"
        f"本節會先說清楚它回應的風險問題，再把公式、假設與資料條件放回業務場景，最後連到{meta['chapter_goal']}，"
        f"讓你知道這個工具在整章中的角色與使用邊界。"
    )


def make_svg(heading: str, meta: dict[str, str]) -> str:
    sid = section_id_from_heading(heading).replace(".", "_")
    focus = short_focus(heading)
    accent = meta["accent"]
    accent_soft = meta["accent_soft"]
    return f'''<div class="payoff-diagram-container" style="background:#0f172a; padding:20px; border-radius:10px; margin: 15px 0; border: 1px solid #1e293b;">
<svg viewBox="0 0 760 240" class="section-map-svg" role="img" aria-labelledby="title-{sid} desc-{sid}">
  <defs>
    <linearGradient id="grad-{sid}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="{accent_soft}" stop-opacity="0.08" />
    </linearGradient>
    <marker id="arrow-{sid}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
    </marker>
  </defs>
  <title id="title-{sid}">{heading} 的概念流程圖</title>
  <desc id="desc-{sid}">從風險問題、模型橋接到決策輸出的三段式學習路徑。</desc>
  <text x="34" y="34" font-size="18" font-weight="700" fill="#e2e8f0">Section Map: {section_id_from_heading(heading)} {focus}</text>
  <text x="34" y="54" font-size="11" fill="#94a3b8">先釐清問題，再接上模型，最後回到可執行的金融判斷</text>
  <rect x="28" y="78" width="704" height="112" rx="18" fill="url(#grad-{sid})" stroke="#1e293b" />
  <rect x="54" y="100" width="182" height="70" rx="14" fill="#111827" stroke="{accent}" stroke-width="1.5" />
  <text x="73" y="124" font-size="13" font-weight="700" fill="{accent_soft}">風險問題</text>
  <text x="73" y="145" font-size="12" fill="#e5e7eb">{meta['concept']}</text>
  <text x="73" y="161" font-size="10" fill="#94a3b8">先界定這一節到底要處理什麼不確定性</text>
  <path d="M 236 135 L 292 135" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow-{sid})" />
  <rect x="292" y="100" width="182" height="70" rx="14" fill="#111827" stroke="{accent}" stroke-width="1.5" />
  <text x="311" y="124" font-size="13" font-weight="700" fill="{accent_soft}">本節模型</text>
  <text x="311" y="145" font-size="12" fill="#e5e7eb">{focus}</text>
  <text x="311" y="161" font-size="10" fill="#94a3b8">把概念轉成可推導、可估計或可模擬的工具</text>
  <path d="M 474 135 L 530 135" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow-{sid})" />
  <rect x="530" y="100" width="176" height="70" rx="14" fill="#111827" stroke="{accent}" stroke-width="1.5" />
  <text x="549" y="124" font-size="13" font-weight="700" fill="{accent_soft}">決策輸出</text>
  <text x="549" y="145" font-size="12" fill="#e5e7eb">{meta['decision']}</text>
  <text x="549" y="161" font-size="10" fill="#94a3b8">把模型結果放回交易、風控或配置判斷</text>
  <text x="34" y="214" font-size="10" fill="#94a3b8">{meta['chapter_goal']}</text>
</svg>
</div>'''


def make_conclusion(heading: str, meta: dict[str, str]) -> str:
    focus = short_focus(heading)
    return (
        "#### 核心技術結論\n"
        f"{focus}的價值，在於把{meta['concept']}整理成可驗證、可比較、可落地的量化輸出。"
        f"當你知道它如何支撐{meta['chapter_goal']}時，這一節的公式與流程才真正轉化為可執行的金融判斷。"
    )


def first_paragraph_end(lines: list[str]) -> int:
    idx = 1
    while idx < len(lines) and not lines[idx].strip():
        idx += 1
    while idx < len(lines) and lines[idx].strip():
        idx += 1
    return idx


def story_block_end(lines: list[str]) -> int | None:
    for idx, line in enumerate(lines):
        if "Story Guide" in line:
            end = idx + 1
            while end < len(lines) and (lines[end].startswith(">") or not lines[end].strip()):
                end += 1
            return end
    return None


def insert_block(lines: list[str], index: int, block: str) -> list[str]:
    block_lines = block.splitlines()
    prefix_blank = index > 0 and lines[index - 1].strip()
    suffix_blank = index < len(lines) and lines[index].strip() if index < len(lines) else False
    new_lines = lines[:index]
    if prefix_blank:
        new_lines.append("")
    new_lines.extend(block_lines)
    if suffix_blank:
        new_lines.append("")
    new_lines.extend(lines[index:])
    return new_lines


def add_story_and_svg(text: str, heading: str, meta: dict[str, str]) -> str:
    has_story = "Story Guide" in text
    has_svg = "<svg" in text
    if has_story and has_svg:
        return text

    lines = text.splitlines()
    if has_story:
        insert_at = story_block_end(lines)
        if insert_at is None:
            return text
        block = make_svg(heading, meta)
    else:
        insert_at = first_paragraph_end(lines)
        block = make_story(heading, meta)
        if not has_svg:
            block = f"{block}\n\n{make_svg(heading, meta)}"

    updated = insert_block(lines, insert_at, block)
    return "\n".join(updated)


def add_conclusion(text: str, heading: str, meta: dict[str, str]) -> str:
    if "#### 核心技術結論" in text:
        return text

    match = ACTION_ITEMS_RE.search(text)
    if not match:
        return text

    newline = detect_newline(text)
    lines = text.splitlines()
    action_heading = match.group(0)
    for idx, line in enumerate(lines):
        if line == action_heading:
            lines = insert_block(lines, idx, make_conclusion(heading, meta))
            return newline.join(lines)
    return text


def process_file(path: Path) -> bool:
    chapter = int(path.parent.name.replace("b2_ch", ""))
    meta = CHAPTER_META[chapter]
    original = path.read_text(encoding="utf-8")
    newline = detect_newline(original)
    heading = section_heading(original)

    updated = add_story_and_svg(original, heading, meta)
    updated = add_conclusion(updated, heading, meta)
    updated = updated.replace("\n", newline)

    if updated != original:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def iter_target_files(chapters: list[int]) -> list[Path]:
    files: list[Path] = []
    root = Path("src/content")
    for chapter in chapters:
        files.extend(sorted((root / f"b2_ch{chapter}").glob("*.md")))
    return files


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--chapters", nargs="*", type=int, default=list(range(2, 13)))
    args = parser.parse_args()

    updated_files = []
    for path in iter_target_files(args.chapters):
        if process_file(path):
            updated_files.append(path)

    print(f"updated {len(updated_files)} files")
    for path in updated_files:
        print(path.as_posix())


if __name__ == "__main__":
    main()