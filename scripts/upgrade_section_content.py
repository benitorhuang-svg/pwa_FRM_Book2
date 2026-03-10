"""
upgrade_section_content.py
--------------------------
Replace templated Story Guide, SVG three-column text, and conclusion
with **per-section unique** content for all non-opener files.

Usage:
    python scripts/upgrade_section_content.py                  # dry-run
    python scripts/upgrade_section_content.py --apply          # apply changes
    python scripts/upgrade_section_content.py --apply --ch 7   # only chapter 7
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path

# ---------------------------------------------------------------------------
# Per-section metadata.  Every key is "X.Y" and contains:
#   story   – unique Story Guide text (after the > **📖 ...** intro line)
#   risk    – SVG left column: specific risk question for THIS section
#   model   – SVG center 12px label (≤12 chars)
#   output  – SVG right column: concrete decision output
#   sub     – SVG y=54 subtitle: unique learning angle
#   ref     – SVG y=214 footer: what follows / applications
#   concl   – unique conclusion paragraph (must cite a formula or model)
# ---------------------------------------------------------------------------

SECTION_META: dict[str, dict[str, str]] = {
    # ========== Ch2: Stochastic Processes ==========
    "2.2": {
        "story": (
            "在量化部門的晨會上，交易主管問：「這批利率路徑模擬結果要不要考慮兩天前的狀態？」"
            "Markov 性質給出了簡潔的回答——未來只取決於現在，歷史已被「價格」本身充分壓縮。"
            "本節解釋為什麼 Markov 假設讓龐大的路徑模擬瞬間變得可計算，也點出它在哪些現實情境下會失效。"
        ),
        "risk": "路徑模擬是否需要完整歷史資訊",
        "model": "Markov 性質",
        "output": "判斷模型能否只存一步狀態而非全路徑",
        "sub": "無記憶性如何簡化隨機動態模擬",
        "ref": "2.3 馬丁格爾與公平賭局、2.5 Wiener Process",
        "concl": (
            "Markov 性質 $P(X_{t+s} | X_t, X_{t-1}, \\ldots) = P(X_{t+s} | X_t)$ 讓建模者可以用單一狀態取代整條路徑歷史，"
            "大幅降低蒙地卡羅模擬的記憶體需求與計算量。不過，波動率叢聚等現象暗示實務資料可能違反此假設，"
            "這正是 2.5 節 Wiener Process 與 GARCH 家族各自承擔的角色。"
        ),
    },
    "2.3": {
        "story": (
            "風控長在看一組衍生品估值模擬：「為什麼風險中性定價能直接用期望值？」"
            "答案藏在 Martingale 裡——如果折現後的資產價格是一場公平賭局，期望值就等於今天的價格。"
            "本節帶你從賭局直覺出發，系統理解等價鞅測度如何讓定價公式成立。"
        ),
        "risk": "折現資產價格是否為公平賭局",
        "model": "Martingale 理論",
        "output": "確認風險中性定價的理論基礎是否成立",
        "sub": "從公平賭局到等價鞅測度的橋樑",
        "ref": "2.4 Random Walk 與離散對應、BSM 定價的底層假設",
        "concl": (
            "Martingale 條件 $E[X_{t+1} | \\mathcal{F}_t] = X_t$ 確保折現後資產價格沒有系統性漂移，"
            "這是風險中性定價 $C = e^{-rT} E^Q[\\max(S_T - K, 0)]$ 得以成立的核心前提。"
            "下一節 Random Walk 將展示離散世界中的 Martingale 如何具體被建構。"
        ),
    },
    "2.4": {
        "story": (
            "量化研究員在回測引擎中發現，日收盤價序列的一階差分幾乎不可預測——這正是 Random Walk 的特徵。"
            "但「幾乎不可預測」到底意味什麼？本節從對稱硬幣遊戲出發，證明 Random Walk 是 Wiener Process 的離散骨架，"
            "也是 GBM 定價模型最直觀的起點。"
        ),
        "risk": "離散價格步進的統計結構",
        "model": "隨機漫步",
        "output": "決定離散取樣間隔是否能逼近連續假設",
        "sub": "離散硬幣遊戲到連續布朗運動的過渡",
        "ref": "2.5 Wiener Process 連續推廣、3.4 Price Path Simulation",
        "concl": (
            "Random Walk $S_t = S_{t-1} + \\epsilon_t$ 的獨立增量結構暗示市場效率假說的弱式成立；"
            "當步數 $n \\to \\infty$ 且步幅 $\\to 0$ 時，它收斂為 Wiener Process，"
            "下一節即銜接此連續極限。"
        ),
    },
    "2.5": {
        "story": (
            "結構師在建立利率模型時，第一個問題就是：布朗運動到底怎麼產生「平滑但處處不可微」的價格路徑？"
            "本節拆解 Wiener Process 的三大建構性質——連續路徑、獨立增量、常態分佈增量，"
            "並解釋為什麼幾乎所有連續隨機微分方程都從它出發。"
        ),
        "risk": "連續路徑的增量結構與可微性",
        "model": "Wiener Process",
        "output": "為 Itô 微積分提供驅動噪音的數學基礎",
        "sub": "連續、獨立、常態——三性質如何定義布朗運動",
        "ref": "2.6 Itô's Lemma 與隨機微分、3.4 路徑模擬離散化",
        "concl": (
            "Wiener Process 滿足 $W(t) - W(s) \\sim N(0, t-s)$ 的獨立常態增量，"
            "使其成為 Itô SDE $dS = \\mu S\\,dt + \\sigma S\\,dW$ 的標準驅動源。"
            "下一節 Itô's Lemma 正是在此基礎上推導非線性函數的隨機微分法則。"
        ),
    },
    "2.6": {
        "story": (
            "定量分析師寫下 $f(S_t) = \\ln S_t$ 想求對數價格的動態，卻發現普通微積分的鏈鎖律多了一項 $-\\frac12 \\sigma^2 dt$。"
            "Itô's Lemma 就是隨機微積分的鏈鎖律——它告訴你在波動不斷的世界裡，函數的變化率比你想的還多一塊。"
            "掌握它，才能從 GBM 走到 BSM，從 SDE 走到封閉解。"
        ),
        "risk": "隨機變數的函數如何寫出正確的微分",
        "model": "Itô's Lemma",
        "output": "推導任意衍生品價格的 SDE 表達",
        "sub": "隨機微積分的鏈鎖律：多出的二階項從哪來",
        "ref": "2.7 GBM 封閉解推導、6.1 BSM 公式推導",
        "concl": (
            "Itô's Lemma $df = f'\\,dS + \\frac{1}{2} f'' (dS)^2$ 中的二階項來自 $(dW)^2 = dt$ 的特殊性質，"
            "這使得 $\\ln S$ 的漂移項從 $\\mu$ 修正為 $\\mu - \\frac12 \\sigma^2$。"
            "下一節 GBM 將直接應用此結果得到指數型價格路徑的封閉解。"
        ),
    },
    "2.7": {
        "story": (
            "資產管理人想預測未來一年的價格分佈：GBM 告訴他價格永遠為正且呈對數常態，"
            "但同時也警告他——固定波動率假設在尾端事件中可能嚴重低估風險。"
            "本節推導 GBM 的封閉解 $S_T = S_0 e^{(\\mu - \\sigma^2/2)T + \\sigma W_T}$，並討論其實務邊界。"
        ),
        "risk": "資產價格的長期分佈形狀",
        "model": "GBM 封閉解",
        "output": "生成對數常態價格情境供 VaR 與定價使用",
        "sub": "從 Itô's Lemma 到指數型價格封閉解",
        "ref": "3.4 GBM 路徑模擬實作、6.1 BSM 封閉解定價",
        "concl": (
            "GBM 封閉解 $S_T = S_0 \\exp\\bigl[(\\mu - \\tfrac12\\sigma^2)T + \\sigma W_T\\bigr]$ "
            "保證股價永遠為正，且終端分佈為對數常態。"
            "然而固定 $\\sigma$ 的假設在肥尾市場中可能失真，Ch8 的 VaR 方法將進一步處理分佈偏離的影響。"
        ),
    },
    # ========== Ch3: Monte Carlo Simulation ==========
    "3.2": {
        "story": (
            "當解析解不存在時，數值積分是最後的武器。風控團隊需要計算一個路徑相依商品的期望值，"
            "本質上就是一道高維定積分。本節從最基本的梯形法與 Simpson 法則出發，"
            "解釋為什麼當維度超過 3 時，傳統數值積分會敗給蒙地卡羅。"
        ),
        "risk": "高維積分的精度與計算量平衡",
        "model": "數值積分法",
        "output": "選擇積分方法：確定性格點 vs. 隨機抽樣",
        "sub": "梯形法、Simpson 到 Monte Carlo 的維度轉折",
        "ref": "3.3 用圓周率演示收斂速度、3.6 期望值定價",
        "concl": (
            "梯形法的誤差隨維度 $d$ 指數惡化（$O(N^{-2/d})$），而 Monte Carlo 的 $O(N^{-1/2})$ 收斂速度與維度無關，"
            "這解釋了為什麼金融工程中一旦超過三個風險因子，幾乎一律轉向隨機抽樣。"
        ),
    },
    "3.3": {
        "story": (
            "在培訓新人時，資深量化師用一個經典殿堂問題開場：「隨機撒針就能算出 π？」"
            "Buffon 投針與圓面積比的 Monte Carlo 演示把抽象概率轉成可觀測的收斂過程，"
            "讓新人直覺感受到大數法則如何把隨機雜訊壓縮成確定答案。"
        ),
        "risk": "隨機估計量的收斂行為",
        "model": "MC 估算圓周率",
        "output": "理解 $1/\\sqrt{N}$ 收斂速度與樣本量選擇",
        "sub": "用幾何機率直覺理解 Monte Carlo 的收斂本質",
        "ref": "3.4 路徑模擬中的樣本量決策、3.8 MCMC 進階抽樣",
        "concl": (
            "MC 估計值 $\\hat\\pi = 4 \\times (\\text{圓內點數}/N)$ 的標準誤為 $O(1/\\sqrt{N})$，"
            "意味著精度每提升一位小數需要 100 倍樣本量。"
            "這個收斂速度限制同樣出現在後續 3.6 節的期權定價模擬中。"
        ),
    },
    "3.4": {
        "story": (
            "交易台要在收盤前重新估算一組路徑相依選擇權：每條模擬路徑都要沿時間軸一步步走完。"
            "本節把 GBM 離散化為 Euler-Maruyama 步進，示範如何把連續 SDE 變成可迭代的 Python 迴圈，"
            "並深入討論時間步數 $\\Delta t$ 對路徑品質與定價精度的影響。"
        ),
        "risk": "離散化步幅對路徑精度的影響",
        "model": "GBM 路徑模擬",
        "output": "決定時間步數與樣本量以達目標精度",
        "sub": "把連續 SDE 變成 for-loop 的離散化策略",
        "ref": "3.5 相關性路徑、3.6 歐式選擇權 MC 定價",
        "concl": (
            "Euler-Maruyama 離散化 $S_{t+\\Delta t} = S_t \\exp[(\\mu - \\sigma^2/2)\\Delta t + \\sigma\\sqrt{\\Delta t}\\,Z]$ "
            "在 $\\Delta t \\to 0$ 時收斂至 GBM 精確解，但實務上必須在步數與執行時間之間權衡，"
            "這直接決定了 3.6 節定價模擬的效率。"
        ),
    },
    "3.5": {
        "story": (
            "投組經理需要同時模擬五支股票的價格路徑，但它們彼此相關——如何確保模擬路徑之間的相關結構"
            "與歷史觀測一致？本節用 Cholesky 分解把獨立常態隨機數轉成具有指定相關矩陣的聯合路徑，"
            "這是多資產定價與風險彙總的必要一步。"
        ),
        "risk": "多資產路徑間的相關結構保持",
        "model": "Cholesky 分解",
        "output": "生成具指定相關矩陣的聯合價格路徑",
        "sub": "用 Cholesky 把獨立噪音轉成有相關的路徑",
        "ref": "3.6 多資產歐式定價、11.1 共變異數結構",
        "concl": (
            "Cholesky 分解 $\\Sigma = LL^\\top$ 讓我們將 $n$ 個獨立 $Z$ 向量轉成相關向量 $\\tilde Z = LZ$，"
            "保證模擬路徑的相關結構精確匹配輸入矩陣。"
            "當相關矩陣非正定時必須先做近半正定修正，否則分解會失敗。"
        ),
    },
    "3.6": {
        "story": (
            "定價團隊面對一張非標歐式選擇權：沒有解析解，只能靠 Monte Carlo。"
            "本節整合路徑模擬 → 到期收益計算 → 折現平均，完成一次完整的 MC 定價流程，"
            "並引入控制變量法 (Control Variate) 來壓縮估計的標準誤。"
        ),
        "risk": "無解析解歐式商品的公允價格估計",
        "model": "MC 歐式定價",
        "output": "產出價格估計值與信賴區間",
        "sub": "從路徑模擬到折現期望值的完整定價流程",
        "ref": "3.7 Asian 路徑相依擴展、5.3 二元樹替代方案",
        "concl": (
            "MC 定價公式 $\\hat C = e^{-rT} \\frac{1}{N}\\sum_{i=1}^{N} \\max(S_T^{(i)} - K, 0)$ "
            "的標準誤可透過控制變量法降低 30-50%，但路徑數 $N$ 仍是精度與速度的主要取捨。"
            "下一節 Asian Options 將展示路徑相依收益如何讓問題更複雜。"
        ),
    },
    "3.7": {
        "story": (
            "企業財務長想買一張以季均價結算的亞式選擇權來對沖原料成本——這類路徑相依選擇權沒有簡單封閉解，"
            "正是 Monte Carlo 方法的典型應用場景。本節示範算術平均與幾何平均的差異，"
            "並探討為何幾何平均有近似解析解而算術平均只能靠模擬。"
        ),
        "risk": "路徑均值型選擇權的定價差異",
        "model": "亞式選擇權",
        "output": "在算術均價與幾何均價之間選擇定價方法",
        "sub": "算術平均 vs. 幾何平均：解析解為何只存在一半",
        "ref": "3.8 MCMC 更複雜分佈抽樣、5.3 歐式二元樹對照",
        "concl": (
            "幾何亞式選擇權可用 $\\ln(\\bar S_{\\text{geo}}) \\sim N(\\cdot)$ 導出近似封閉解，"
            "但算術亞式選擇權因 $\\bar S_{\\text{arith}}$ 非對數常態，必須依賴 Monte Carlo。"
            "此差異凸顯了路徑相依性對定價方法選擇的決定性影響。"
        ),
    },
    "3.8": {
        "story": (
            "風險建模師需要從一個非標準後驗分佈中抽樣——常見的反轉法無法處理這種沒有封閉 CDF 的分佈。"
            "Markov Chain Monte Carlo (MCMC) 透過精心設計的接受-拒絕步驟，讓隨機漫步「走到」目標分佈，"
            "本節介紹 Metropolis-Hastings 演算法的核心邏輯與收斂診斷。"
        ),
        "risk": "從複雜後驗分佈中抽取代表性樣本",
        "model": "MCMC 抽樣",
        "output": "判斷鏈是否已收斂、抽樣是否可信",
        "sub": "當反轉法失效時，讓隨機漫步找到目標分佈",
        "ref": "貝式風險模型推斷、信用評級遷移分析",
        "concl": (
            "Metropolis-Hastings 的接受機率 $\\alpha = \\min(1, \\frac{\\pi(x')q(x|x')}{\\pi(x)q(x'|x)})$ "
            "保證鏈的平衡分佈就是目標 $\\pi$，但收斂速度取決於提案分佈 $q$ 的設計。"
            "Burn-in 樣本必須丟棄，否則初始位置偏差會汙染估計。"
        ),
    },
    # ========== Ch4: Regression ==========
    "4.2": {
        "story": (
            "分析師剛跑完一組多因子回歸，$R^2$ 高達 0.93，但外樣本預測卻慘不忍睹。"
            "問題出在模型診斷：殘差是否獨立？共線性是否膨脹了係數？"
            "本節系統介紹回歸模型的評估工具——殘差圖、VIF、AIC/BIC——幫你區分「擬合好」與「真正有用」。"
        ),
        "risk": "高 R² 模型是否真的有預測力",
        "model": "模型診斷工具",
        "output": "決定模型是否可部署或需要重新選型",
        "sub": "從殘差圖到 AIC：區分過擬合與真實訊號",
        "ref": "4.3 OLS 估計、4.6 Ridge 正則化處理共線性",
        "concl": (
            "Adjusted $R^2$ 修正了變數膨脹效應，而 VIF > 10 是高共線性的警示閾值。"
            "僅看 $R^2$ 而不做殘差分析，是回歸建模最常見的過擬合陷阱。"
            "後續 4.6 Ridge 與 4.7 Lasso 正是針對此問題的正則化解方案。"
        ),
    },
    "4.3": {
        "story": (
            "信用分析師要用企業財報因子預測違約損失率 (LGD)——他的第一直覺是線性回歸。"
            "OLS 把離差平方和最小化，但前提是殘差要獨立、同分佈、常態。"
            "本節推導 Normal Equation $\\hat\\beta = (X^\\top X)^{-1}X^\\top y$ 並解釋每個假設在金融資料中如何被違反。"
        ),
        "risk": "因子與目標變數的線性關係強度",
        "model": "OLS 線性回歸",
        "output": "估計係數方向與顯著性以做因子篩選",
        "sub": "Normal Equation 的推導與 OLS 四大假設",
        "ref": "4.4 Logistic 處理二元目標、4.5 Polynomial 處理非線性",
        "concl": (
            "OLS 估計 $\\hat\\beta = (X^\\top X)^{-1} X^\\top y$ 在 Gauss-Markov 條件下是 BLUE，"
            "但金融資料常見的異質變異與自相關會使標準誤偏低、t 統計量膨脹。"
            "下一節 Logistic 回歸將處理目標變數為二元（違約 / 非違約）的情境。"
        ),
    },
    "4.4": {
        "story": (
            "授信部門需要一個模型回答「該客戶是否會在 12 個月內違約」——這是 0/1 二元問題，不適合直接用 OLS。"
            "Logistic Regression 用 Sigmoid 函數把線性組合壓進 [0,1] 區間，"
            "本節推導對數勝算比 (log-odds) 並說明如何用 MLE 估計係數。"
        ),
        "risk": "二元結果（違約/正常）的機率估計",
        "model": "Logistic Regression",
        "output": "輸出客戶違約機率並設定核准門檻",
        "sub": "Sigmoid 如何把線性分數壓成機率",
        "ref": "9.4 Scorecard Model 實務延伸、4.5 非線性擴展",
        "concl": (
            "Logistic 模型 $\\ln\\frac{p}{1-p} = X\\beta$ 將線性組合映射為機率，MLE 透過 Newton-Raphson 迭代求解。"
            "模型的 Hosmer-Lemeshow 檢定與 ROC-AUC 是評估違約預測品質的兩大關鍵指標。"
        ),
    },
    "4.5": {
        "story": (
            "交易策略研究員發現，收益率與波動率之間的關係不是直線而是 U 型曲線。"
            "Polynomial Regression 透過加入 $x^2, x^3$ 等高次項捕捉非線性，"
            "但次數太高就會過擬合。本節探討偏差-方差取捨與交叉驗證選階策略。"
        ),
        "risk": "非線性因子關係的建模精度",
        "model": "多項式回歸",
        "output": "選擇多項式階數以平衡偏差與方差",
        "sub": "偏差-方差取捨：高次項到底該加幾個",
        "ref": "4.6 Ridge 控制膨脹係數、4.7 Lasso 做變數篩選",
        "concl": (
            "Polynomial Regression 的訓練 MSE 隨階數單調下降，但測試 MSE 在最佳階數後反轉上升，"
            "這是偏差-方差取捨 (bias-variance tradeoff) 的經典演示。"
            "交叉驗證 (Cross-Validation) 是決定最佳階數的實務標準做法。"
        ),
    },
    "4.6": {
        "story": (
            "多因子風險模型中十幾個經濟指標高度共線，OLS 係數的方向與大小隨樣本劇烈搖擺。"
            "Ridge Regression 在損失函數中加入 $\\lambda \\|\\beta\\|^2$ 懲罰項，把不穩定的大係數壓縮回可控範圍，"
            "本節解釋正則化如何同時改善預測與解釋性。"
        ),
        "risk": "高共線性因子導致的估計不穩定",
        "model": "Ridge Regression",
        "output": "選擇正則化強度 $\\lambda$ 以穩定係數估計",
        "sub": "L2 懲罰如何壓縮膨脹的回歸係數",
        "ref": "4.7 Lasso 的變數篩選替代、交叉驗證選 λ",
        "concl": (
            "Ridge 解 $\\hat\\beta_{\\text{ridge}} = (X^\\top X + \\lambda I)^{-1} X^\\top y$ "
            "透過 $\\lambda$ 控制偏差-方差取捨，但不會將任何係數壓至零。"
            "若需要自動變數篩選，下一節 Lasso 的 L1 懲罰是更合適的選擇。"
        ),
    },
    "4.7": {
        "story": (
            "投組分析師面對 200 個候選因子，但真正有效的可能不到 10 個——如何讓模型自己挑因子？"
            "Lasso 的 L1 懲罰 $\\lambda \\|\\beta\\|_1$ 能把無關因子的係數壓到精確的零，"
            "本節對比 Ridge 與 Lasso 的幾何直覺，並說明 Elastic Net 如何結合兩者的優點。"
        ),
        "risk": "高維因子空間中的可解釋因子篩選",
        "model": "Lasso Regression",
        "output": "自動篩選有效因子並輸出稀疏模型",
        "sub": "L1 懲罰為什麼會產生精確的零係數",
        "ref": "Elastic Net 與 Ch9 信用因子篩選實務",
        "concl": (
            "Lasso 的 L1 正則化 $\\min \\|y - X\\beta\\|^2 + \\lambda\\|\\beta\\|_1$ "
            "讓部分係數恰好為零，實現變數篩選。"
            "但當因子間相關性高時，Lasso 傾向只保留一個代表，Elastic Net 透過 $\\alpha L_1 + (1-\\alpha) L_2$ 混合可改善此問題。"
        ),
    },
    # ========== Ch5: Binomial Trees ==========
    "5.2": {
        "story": (
            "量化新人第一次看到二元樹時常覺得太簡單：「股價每步只上或下，能定什麼價？」"
            "但正是這個簡潔結構讓風險中性機率 $p = \\frac{e^{r\\Delta t} - d}{u - d}$ 自然浮現。"
            "本節建構單步與多步資產樹，展示離散化如何逼近連續定價。"
        ),
        "risk": "離散節點能否正確複製連續價格動態",
        "model": "CRR 資產樹",
        "output": "確定上漲/下跌因子 u, d 與風險中性機率",
        "sub": "從 CRR 參數到風險中性機率的導出",
        "ref": "5.3 歐式回推定價、5.5 步數與收斂性",
        "concl": (
            "CRR 樹的 $u = e^{\\sigma\\sqrt{\\Delta t}},\\ d = 1/u$ 設定讓離散模型在步數增加時收斂至 BSM。"
            "風險中性機率 $p$ 不是真實上漲機率，而是使折現期望等於現價的權重。"
        ),
    },
    "5.3": {
        "story": (
            "交易員收到一份結構化產品報價，想快速驗算歐式看漲的理論價。"
            "二元樹的回推定價法——從到期節點的收益往回折現——是最直觀的無套利定價實作。"
            "本節完整示範單步到多步的回推流程，並與 BSM 解析值做交叉驗證。"
        ),
        "risk": "歐式選擇權的無套利理論價格",
        "model": "二元樹回推定價",
        "output": "產出期權理論價與 BSM 驗證差異",
        "sub": "從到期收益一步步折現回今天的定價邏輯",
        "ref": "5.4 美式提前行權判斷、6.1 BSM 封閉解對照",
        "concl": (
            "歐式選擇權價格 $C = e^{-r\\Delta t}[pC_u + (1-p)C_d]$ 在每個節點遞推，"
            "多步樹的結果隨步數增加收斂至 BSM $C = S_0 N(d_1) - Ke^{-rT}N(d_2)$。"
            "下一節探討美式選擇權在每個節點額外加入提前行權判斷的擴展。"
        ),
    },
    "5.4": {
        "story": (
            "客戶持有一張美式看跌選擇權，當標的價格跌破某水平時，提前行權可能比等到到期更有利。"
            "二元樹在每個節點加上 $\\max(K - S, \\text{持有價值})$ 的比較，就能定價美式選擇權。"
            "本節拆解提前行權決策的經濟直覺。"
        ),
        "risk": "美式選擇權的最佳行權時機",
        "model": "提前行權判斷",
        "output": "識別提前行權邊界與行權溢價",
        "sub": "每個節點的行權 vs. 持有決策",
        "ref": "5.5 步數對提前行權邊界的收斂、5.7 Greeks 二元樹",
        "concl": (
            "美式定價在每個節點取 $\\max(\\text{intrinsic}, e^{-r\\Delta t}[pV_u+(1-p)V_d])$，"
            "這使得定價必須逐節點回推而無法向量化——"
            "計算成本是歐式的數倍，也是 Longstaff-Schwartz MC 方法被提出的動機。"
        ),
    },
    "5.5": {
        "story": (
            "模型開發者必須回答一個工程問題：二元樹要設幾步才夠精確？"
            "100 步跟 500 步的價格差異是否在可接受範圍？本節用收斂性分析說明，"
            "CRR 樹的振盪收斂現象以及偶數步偏差問題，並介紹 Richardson 外推加速收斂。"
        ),
        "risk": "二元樹步數對定價精度的影響",
        "model": "收斂性分析",
        "output": "決定最少步數以達到目標精度",
        "sub": "CRR 振盪收斂與 Richardson 外推加速",
        "ref": "5.6 替代樹模型改善收斂、6.1 BSM 精確基準",
        "concl": (
            "CRR 樹在偶數與奇數步之間的價格交替振盪可用 Richardson Extrapolation "
            "$C^* \\approx 2C_n - C_{n/2}$ 加速收斂。"
            "實務上 200–500 步通常足以讓歐式價格收斂至 BSM 的 0.01 以內。"
        ),
    },
    "5.6": {
        "story": (
            "CRR 在處理股利、障礙條件或非標資產時可能收斂太慢。"
            "Jarrow-Rudd、Tian、Leisen-Reimer 等變體各自在不同情境下有收斂優勢。"
            "本節對比主流二元樹變體的參數選擇邏輯與適用場景。"
        ),
        "risk": "特殊結構下的二元樹收斂品質",
        "model": "二元樹變體",
        "output": "根據產品特性選擇最適樹型",
        "sub": "JR、Tian、LR 等變體的參數與收斂特性比較",
        "ref": "5.7 Greeks 精度依賴樹型選擇",
        "concl": (
            "Leisen-Reimer 樹透過 Peizer-Pratt 反轉讓 $N$ 步定價的中心節直接對齊執行價，"
            "消除 CRR 的振盪問題，僅需約 50 步即可達到高精度。"
            "樹型選擇直接影響下一節 Greeks 有限差分的穩定性。"
        ),
    },
    "5.7": {
        "story": (
            "交易台不只要知道選擇權價格，還要知道 Delta、Gamma 來管理對沖。"
            "二元樹上的 Greeks 透過有限差分計算：$\\Delta \\approx (C_u - C_d)/(S_u - S_d)$。"
            "本節示範如何從同一棵樹提取 Delta、Gamma、Theta，並討論精度限制。"
        ),
        "risk": "離散樹上 Greeks 的精度與穩定性",
        "model": "二元樹 Greeks",
        "output": "產出可用於對沖的 Delta/Gamma/Theta",
        "sub": "有限差分如何從定價樹萃取敏感度",
        "ref": "7.2–7.6 連續模型 Greeks 對照",
        "concl": (
            "二元樹 Delta $\\Delta = \\frac{f_u - f_d}{S_0(u-d)}$ 的精度依賴步數，"
            "Gamma 需要三個節點的二階差分，對步數更敏感。"
            "連續模型的解析 Greeks（Ch7）在精度上優於二元樹，但二元樹在美式選擇權上無可替代。"
        ),
    },
    "5.8": {
        "story": (
            "選擇權做市商看到報價中的 IV 曲面呈現微笑形狀——ATM 的隱含波動率最低，"
            "深度 OTM 的看跌選擇權卻有更高的 IV。這暗示市場不相信 BSM 的常數波動率假設。"
            "本節從市場報價反推 IV，並用 Newton-Raphson 數值解說明 Volatility Smile 的經濟意涵。"
        ),
        "risk": "常數波動率假設與市場報價的偏離",
        "model": "隱含波動率反推",
        "output": "校準 IV 曲面以供定價與對沖使用",
        "sub": "從 BSM 反推 IV：Newton-Raphson 數值解法",
        "ref": "6.1 BSM 公式的波動率參數、7.5 Vega 風險",
        "concl": (
            "隱含波動率由 BSM 反函數 $\\sigma_{\\text{imp}} = \\text{BSM}^{-1}(C_{\\text{mkt}})$ 定義，"
            "Newton-Raphson 利用 Vega $\\partial C / \\partial \\sigma$ 快速收斂。"
            "Smile 現象揭示了市場對尾部風險的額外定價，挑戰 BSM 的核心假設。"
        ),
    },
    # ========== Ch6: BSM Family ==========
    "6.2": {
        "story": (
            "新手交易員問：「為什麼同一支股票的看漲期權，深度價內的比 ATM 的更貴，但漲幅空間更小？」"
            "答案在於時間價值——ATM 選擇權有最多的「彩券成分」。"
            "本節拆解 $C = \\text{Intrinsic} + \\text{Time Value}$，並分析時間、波動率如何獨立影響這兩部分。"
        ),
        "risk": "選擇權價格中內含價值與時間價值的拆分",
        "model": "時間 vs. 內含價值",
        "output": "判斷選擇權是否被高估或低估於其時間價值",
        "sub": "為什麼 ATM 的時間價值最大",
        "ref": "7.4 Theta 時間衰減量化、5.8 IV 校準",
        "concl": (
            "$C - \\max(S-K, 0)$ 即為時間價值，它在 ATM 達到極大值且隨到期日逼近而加速衰減。"
            "這個分解是 Theta 風險（Ch7.4）的直覺基礎——賣方每天賺取的正是時間價值的消耗。"
        ),
    },
    "6.3": {
        "story": (
            "外匯交易台需要對一張 EUR/USD 選擇權報價：標的是匯率而非股票，兩邊都有利率。"
            "Garman-Kohlhagen 模型把 BSM 的股利率改成外幣無風險利率 $r_f$，"
            "本節推導公式與參數校準的實務要點。"
        ),
        "risk": "外匯選擇權的雙利率定價",
        "model": "Garman-Kohlhagen",
        "output": "對外匯選擇權報出具利率差的理論價",
        "sub": "把 BSM 的股利率替換為外幣利率的推導",
        "ref": "6.4 期貨選擇權 Black 76、7.6 Rho 利率風險",
        "concl": (
            "Garman-Kohlhagen 將 BSM 中的股利連續支付率 $q$ 替換為 $r_f$，"
            "得到 $C = Se^{-r_f T}N(d_1) - Ke^{-r_d T}N(d_2)$。"
            "利率差 $r_d - r_f$ 的變動同時影響 Delta 與 Rho，這是外匯選擇權獨有的雙重利率敏感度。"
        ),
    },
    "6.4": {
        "story": (
            "固收交易員持有一張國債期貨選擇權——標的只有期貨價格，沒有股利也沒有持有成本。"
            "Black 76 公式直接以期貨價格 $F$ 取代即期價格，"
            "本節說明期貨選擇權與債券選擇權如何套用 BSM 家族框架。"
        ),
        "risk": "期貨與債券選擇權的定價調整",
        "model": "Black 76 公式",
        "output": "正確使用期貨價格而非即期價格作為定價輸入",
        "sub": "期貨選擇權為何不需要折現標的",
        "ref": "6.5 Digital Options 二元結構、利率上下限定價",
        "concl": (
            "Black 76 公式 $C = e^{-rT}[FN(d_1) - KN(d_2)]$ 中 $F$ 已內含持有成本，"
            "因此不需再做 $e^{-qT}$ 或 $e^{-r_f T}$ 的折現調整。"
            "債券選擇權的挑戰在於波動率估計——必須區分 yield vol 與 price vol。"
        ),
    },
    "6.5": {
        "story": (
            "結構化產品部門要替一張「漲破 100 就拿 1000 元，否則歸零」的數位選擇權報價。"
            "Digital (Binary) Options 的不連續收益結構讓 Vega 風險極端集中在障礙附近，"
            "本節推導封閉解並討論對沖的特殊困難。"
        ),
        "risk": "不連續收益結構的對沖與定價",
        "model": "Digital Options",
        "output": "評估數位選擇權在障礙附近的極端 Greeks",
        "sub": "不連續 payoff 如何讓 Delta 趨向無窮",
        "ref": "7.2 Delta 對沖挑戰、障礙選擇權擴展",
        "concl": (
            "Cash-or-nothing Call 價格 $C_{\\text{dig}} = e^{-rT} N(d_2)$ 的 Delta 在障礙附近趨向脈衝函數，"
            "使得動態對沖在此區域幾乎不可能——做市商必須用靜態複製（bull spread 近似）來管理此風險。"
        ),
    },
    # ========== Ch7: Greeks ==========
    "7.2": {
        "story": (
            "交易台每小時推播一次 Delta 報告：部位的整體 Delta 是 +320 萬——意味著標的每漲 1 元，"
            "帳面就多賺 320 萬。但一旦 Gamma 夠大，這個線性近似可能在下一個小時就嚴重失準。"
            "本節先聚焦 Delta 的解析表達與動態對沖邏輯，然後點出線性近似的邊界在哪裡。"
        ),
        "risk": "標的價格移動時部位價值的一階變化",
        "model": "Delta 解析式",
        "output": "計算需要多少標的股來做 Delta Neutral",
        "sub": "一階偏導數：方向風險的精確量化",
        "ref": "7.3 Gamma 二階修正、5.7 二元樹 Delta 對照",
        "concl": (
            "Call Delta $\\Delta_C = e^{-qT}N(d_1)$ 介於 0 與 1 之間，隨標的上升而趨近 1。"
            "Delta Neutral 對沖需隨 $S$ 變動頻繁調整，調整成本恰好由下一節 Gamma 衡量。"
        ),
    },
    "7.3": {
        "story": (
            "做市商在到期前三天發現，ATM 看漲選擇權的 Delta 會因為微小的股價跳動而劇烈翻轉，"
            "對沖量一下正一下負——這就是 Gamma 爆炸的實戰場景。"
            "本節深入 Gamma 的解析公式、ATM 尖峰效應與到期日 Pin Risk 的經濟涵義。"
        ),
        "risk": "Delta 隨價格變化的加速度",
        "model": "Gamma 解析式",
        "output": "識別 Gamma 風險峰值區域並設定對沖頻率",
        "sub": "二階偏導數：Delta 的不穩定度有多大",
        "ref": "7.4 Theta 與 Gamma 的 P&L 鏡像、5.7 離散 Gamma",
        "concl": (
            "Gamma $\\Gamma = \\frac{e^{-qT}n(d_1)}{S\\sigma\\sqrt{T}}$ 在 ATM 處達峰值且隨到期日逼近而尖銳化，"
            "形成 Pin Risk——Delta 可能在到期日瞬間從 0 翻到 1。"
            "Theta 與 Gamma 之間的 P&L 鏡像關係將在下一節揭示。"
        ),
    },
    "7.4": {
        "story": (
            "選擇權賣方每天早晨發現帳面多了一筆「正收益」——那不是市場波動帶來的，而是 Theta 衰減的紅利。"
            "但這筆紅利的背後是 Gamma 風險的潛在虧損。"
            "本節展示 BSM PDE 中 Theta 與 Gamma 的嚴格對偶關係 $\\Theta + \\frac{1}{2}\\sigma^2 S^2 \\Gamma + rS\\Delta = rV$。"
        ),
        "risk": "時間流逝對期權價格的每日侵蝕量",
        "model": "Theta 解析式",
        "output": "計算時間衰減成本以評估持有策略",
        "sub": "BSM PDE 中 Theta 與 Gamma 的對偶關係",
        "ref": "7.5 Vega 波動率維度、6.2 時間價值分解",
        "concl": (
            "BSM PDE $\\Theta + \\frac{1}{2}\\sigma^2 S^2\\Gamma + rS\\Delta = rV$ 揭示："
            "在 Delta Neutral 下，$\\Theta \\approx -\\frac{1}{2}\\sigma^2 S^2\\Gamma$，"
            "即時間衰減的收益恰好補償 Gamma 的對沖成本——賣方賺 Theta 必須承擔 Gamma。"
        ),
    },
    "7.5": {
        "story": (
            "波動率交易員不做方向，專做波動率：他同時買入看漲與看跌維持 Delta Neutral，"
            "純粹押注 IV 的變動。Vega 就是他的損益驅動器。"
            "本節推導 Vega 的解析式，並說明為什麼 Vega 在長天期選擇權上特別巨大。"
        ),
        "risk": "隱含波動率變動對持倉價值的衝擊",
        "model": "Vega 解析式",
        "output": "計算部位對 IV 平移有多敏感",
        "sub": "波動率交易者的獨立損益來源",
        "ref": "5.8 隱含波動率微笑、7.6 Rho 利率敏感度",
        "concl": (
            "Vega $\\mathcal{V} = S e^{-qT} n(d_1) \\sqrt{T}$ 隨到期時間增加而變大，"
            "長天期選擇權的 Vega 風險遠超短天期——這解釋了為什麼波動率交易者偏好長天期 Straddle。"
            "Vega 不在 BSM 的原始參數內（$\\sigma$ 是常數），它衡量的是模型假設被違反的程度。"
        ),
    },
    "7.6": {
        "story": (
            "固收交易台在評估一批三年期選擇權的利率敏感度時，發現短天期選擇權對利率幾乎免疫，"
            "但長天期 LEAPS 的 Rho 卻大到不可忽略。本節推導 Rho 的解析式，"
            "並探討在利率劇烈波動的環境下如何量化與管理此風險。"
        ),
        "risk": "無風險利率變動對長天期選擇權的衝擊",
        "model": "Rho 解析式",
        "output": "判斷是否需要對沖利率風險（LEAPS vs. 短期）",
        "sub": "利率敏感度為何只在長天期選擇權上爆發",
        "ref": "6.3 Garman-Kohlhagen 雙利率、8.4 利率 VaR",
        "concl": (
            "Call Rho $\\rho_C = KTe^{-rT}N(d_2)$ 隨 $T$ 線性增長，短天期選擇權的 Rho 幾乎可忽略，"
            "但 2-3 年期 LEAPS 的 Rho 可達到與 Vega 相當的量級。"
            "在央行快速升降息週期中，忽視 Rho 可能造成不可解釋的 P&L 偏差。"
        ),
    },
    # ========== Ch8: Market Risk ==========
    "8.2": {
        "story": (
            "風控長在每日風險報告上看到兩個數字：VaR $-$23M 與 ES $-$34M。"
            "VaR 說「95% 的日子損失不會超過 23M」，但 ES 還告訴你「超過的那 5% 平均虧多少」。"
            "本節從損失分佈的尾部出發，定義 VaR 與 ES 並比較它們的監管角色。"
        ),
        "risk": "損失分佈的分位數與尾部期望值",
        "model": "VaR 與 ES 定義",
        "output": "選擇風險度量口徑（VaR vs. ES）以滿足監管",
        "sub": "分位數風險 vs. 尾部均值風險的監管取捨",
        "ref": "8.3 ES 深入、8.4-8.6 三種計算方法",
        "concl": (
            "VaR 定義為 $\\text{VaR}_\\alpha = -F^{-1}(1-\\alpha)$，$\\text{ES}_\\alpha = E[L | L > \\text{VaR}_\\alpha]$。"
            "Basel III 從 VaR 轉向 ES 正是因為 VaR 不是 coherent risk measure——它不滿足次可加性。"
            "後續三節分別用 Parametric、Historical、MC 方法來實際計算這兩個指標。"
        ),
    },
    "8.3": {
        "story": (
            "監管審查官質疑銀行的 VaR 報告：「你告訴我 99% 的日子虧損不超過 50M，"
            "但那剩下 1% 到底會虧多少？」Expected Shortfall 正是用來回答這個問題。"
            "本節深入 ES 的數學性質、子可加性證明與巴塞爾 III 的採用背景。"
        ),
        "risk": "VaR 之外的尾部損失嚴重程度",
        "model": "Expected Shortfall",
        "output": "產出 ES 值以滿足 FRTB 監管報告",
        "sub": "ES 為何是 coherent 而 VaR 不是",
        "ref": "8.4 Parametric ES 計算、8.5 Historical ES",
        "concl": (
            "ES 滿足 coherent risk measure 四公理（尤其是次可加性 $\\text{ES}(X+Y) \\le \\text{ES}(X) + \\text{ES}(Y)$），"
            "使得投組風險加總不會低估——這是 FRTB 強制採用 ES 取代 VaR 的數學理由。"
        ),
    },
    "8.4": {
        "story": (
            "量化分析師在假設收益率服從常態分佈時，VaR 只需要三個數字：部位值、波動率、z 分位數。"
            "Parametric Method 的運算極快，但它的致命假設——常態分佈——在肥尾市場中可能嚴重低估風險。"
            "本節推導公式並用 t 分佈替代做穩健性測試。"
        ),
        "risk": "分佈假設是否導致風險低估",
        "model": "Parametric VaR/ES",
        "output": "快速產出 VaR/ES 並識別分佈假設風險",
        "sub": "常態假設下三個數字就能算出的風險上限",
        "ref": "8.5 Historical 不做分佈假設、1.5 GARCH 波動率",
        "concl": (
            "Parametric VaR $= \\mu + z_\\alpha \\cdot \\sigma$ 在常態假設下計算速度 $O(1)$，"
            "但 2008 年金融危機的教訓表明常態尾部嚴重低估極端損失。"
            "使用 t 分佈（$\\nu=5$）可將 99% VaR 放大約 20-30%，更接近歷史實際。"
        ),
    },
    "8.5": {
        "story": (
            "風控團隊認為分佈假設不可靠，選擇直接用過去 500 天的實際損益排序來計算 VaR。"
            "Historical Simulation 不做分佈假設，但它假設「過去就是未來的好指引」——"
            "當市場結構發生斷裂時，這個假設也會失效。本節展示排序法、加權法與滾動窗口的實務操作。"
        ),
        "risk": "無分佈假設下的歷史損益排序風險",
        "model": "歷史模擬法",
        "output": "直接從歷史損益序列讀出 VaR/ES",
        "sub": "不做分佈假設的代價：數據窗口與結構斷裂",
        "ref": "8.6 MC 方法結合情境分佈、8.4 Parametric 對比",
        "concl": (
            "Historical VaR 直接取損益排序的第 $\\lfloor N(1-\\alpha) \\rfloor$ 個值，不依賴分佈假設，"
            "但 500 天窗口只有約 5 個觀測值落在 99% 尾巴——統計精度低且對窗口起點敏感。"
            "Exponentially weighted historical simulation 可緩解此問題但引入了衰減參數選擇。"
        ),
    },
    "8.6": {
        "story": (
            "投組包含非線性部位（選擇權、結構化產品），Parametric 的 Delta-Normal 近似不夠用，"
            "Historical 的窗口太短無法覆蓋極端情境。Monte Carlo VaR 的解方是："
            "模擬數萬條風險因子路徑，逐條重估投組價值，再從模擬損益分佈讀取 VaR/ES。"
        ),
        "risk": "非線性投組的完整損益分佈估計",
        "model": "MC VaR/ES",
        "output": "生成完整 P&L 分佈以支持非線性風險",
        "sub": "當 Delta-Normal 不夠用：完整重估的代價",
        "ref": "3.4 路徑模擬基礎、壓力測試情境設計",
        "concl": (
            "MC VaR 透過模擬 $N$ 條風險因子路徑，逐條重估 $V(\\omega_i)$ 得到完整 P&L 分佈，"
            "再取分位數。計算成本 $O(N \\times M)$（$M$ 為投組內商品數）遠高於 Parametric，"
            "但能正確處理 Gamma、Vega 等非線性效應。"
        ),
    },
    # ========== Ch9: Credit Risk ==========
    "9.2": {
        "story": (
            "信審專員每天盯著 PD、LGD、EAD 三個數字：「違約機率 2%，損失率 45%，曝險金額 1 億——"
            "期望損失就是 90 萬。」但哪個指標影響最大？本節拆解三大核心度量的估計來源、互動關係與常見誤區。"
        ),
        "risk": "信用損失三大驅動因子的拆分與估計",
        "model": "PD / LGD / EAD",
        "output": "計算期望損失 EL 並識別最敏感的因子",
        "sub": "EL = PD × LGD × EAD 的三因子拆解",
        "ref": "9.4 PD 評分卡估計、9.5 遷移矩陣長期 PD",
        "concl": (
            "$EL = PD \\times LGD \\times EAD$ 的三因子乘積結構看似簡單，"
            "但 PD 與 LGD 在經濟衰退中呈正相關（downturn LGD），使得真實損失遠超各自獨立估計的乘積。"
            "Basel IRB 因此要求使用 downturn LGD 而非長期平均值。"
        ),
    },
    "9.3": {
        "story": (
            "資料科學團隊拿到一批申貸資料：30% 的欄位是空值，連續變數的分佈偏態嚴重，"
            "類別變數有幾十個 level。在丟進模型之前，必須先做 WoE 編碼、遺漏值填補與異常值處理。"
            "本節聚焦信用風險建模獨有的資料前處理流程。"
        ),
        "risk": "資料品質對信用模型的隱性偏差",
        "model": "WoE / IV 篩選",
        "output": "輸出可直接送入 Logistic 的乾淨特徵集",
        "sub": "信用建模的資料前處理：WoE、IV 與遺漏值策略",
        "ref": "9.4 Scorecard 建模、4.4 Logistic Regression",
        "concl": (
            "Information Value $IV = \\sum (\\%\\text{Good}_i - \\%\\text{Bad}_i) \\times \\text{WoE}_i$ "
            "是因子篩選的行業標準：$IV < 0.02$ 的變數幾乎沒有預測力，$IV > 0.5$ 則可能有資料洩漏。"
            "完成 WoE 編碼後，下一節的 Scorecard 直接以此作為建模輸入。"
        ),
    },
    "9.4": {
        "story": (
            "消費金融公司需要把 Logistic 回歸的係數轉成行員容易理解的「評分卡分數」："
            "年齡 25-30 得 +12 分，收入低於 3 萬得 -8 分，總分低於 200 分就拒絕。"
            "Scorecard Model 把統計模型翻譯成可營運的信審工具，本節推導分數映射公式。"
        ),
        "risk": "違約機率到可操作信審分數的轉換",
        "model": "評分卡模型",
        "output": "產出分數切點與對應的核准/拒絕策略",
        "sub": "把 Logistic 係數翻譯成行員可用的分數",
        "ref": "9.5 遷移矩陣長期檢驗、4.4 Logistic 回歸",
        "concl": (
            "Scorecard 分數 $\\text{Score} = \\text{Offset} + \\text{Factor} \\times \\ln(\\text{odds})$ "
            "其中 Factor 與 Offset 由「基準分數對應的機率」反推而得。"
            "分數閾值 (cutoff) 的設定是商業決策——嚴格的 cutoff 降低違約率但也降低通過率。"
        ),
    },
    "9.5": {
        "story": (
            "評級機構需要估計：一家 BBB 級公司在未來 5 年內降級至 CCC 再違約的機率有多少？"
            "Migration Matrix 記錄所有評級之間的一年轉移機率，透過矩陣冪次 $M^n$ 即可算出多年遷移。"
            "本節介紹轉移矩陣的估計、穩定性測試與蒙地卡羅模擬。"
        ),
        "risk": "評級遷移路徑的長期機率估計",
        "model": "轉移矩陣",
        "output": "計算多年期遷移機率與升降級風險",
        "sub": "一年轉移矩陣如何推算多年違約路徑",
        "ref": "9.6 生存率自展、Merton 結構性模型",
        "concl": (
            "轉移矩陣的 $n$ 年遷移由 $M^n$ 給出，但前提是 Markov 假設成立（2.2 節）。"
            "實務中 Rating Momentum 效應暗示歷史評級變化方向會影響未來遷移，"
            "違反 Markov 假設時需使用更複雜的條件遷移模型。"
        ),
    },
    "9.6": {
        "story": (
            "結構師在定價 CDS 時需要把信用價差轉成每年的條件違約機率——這就是 Bootstrap 自展法的任務。"
            "從短天期 CDS 開始，逐步推導各年的邊際違約機率與存活率曲線。"
            "本節示範自展公式並討論回收率假設對結果的敏感度。"
        ),
        "risk": "從市場信用價差反推存活機率曲線",
        "model": "存活率自展法",
        "output": "產出期限結構化的存活率向量",
        "sub": "把 CDS 價差一層層剝成邊際違約機率",
        "ref": "9.7 Z-Score 結構性判斷、10.8 CVA 定價",
        "concl": (
            "自展公式 $h_n = \\frac{s_n \\sum_{i=1}^{n} \\Delta_i Q_{i-1}}{(1-R)\\sum_{i=1}^{n} \\Delta_i Q_{i-1}}$ "
            "的 $R$（回收率）通常假設為 40%，但此假設對短天期 CDS 的 hazard rate 影響超過 50%。"
            "敏感度分析是 CDS 定價的必要步驟。"
        ),
    },
    "9.7": {
        "story": (
            "銀行風控部收到一份企業財報，需要快速判斷破產風險——Altman Z-Score 用五個財報比率"
            "組合成一個分數，超過 2.99 安全，低於 1.81 危險。本節還原 Z-Score 的歷史與適用邊界。"
        ),
        "risk": "企業破產預警的結構性判別",
        "model": "Altman Z-Score",
        "output": "快速分類企業信用狀態（安全/灰色/危險）",
        "sub": "五個財報比率如何組合成破產預警分數",
        "ref": "Merton 模型的市場信息補充、9.4 行為評分對比",
        "concl": (
            "Z-Score $= 1.2X_1 + 1.4X_2 + 3.3X_3 + 0.6X_4 + 1.0X_5$ 中 $X_3$（EBIT/TA）的權重最大，"
            "反映獲利能力是破產預測的第一因子。"
            "作為 1968 年的模型，Z-Score 在新興產業與服務業的適用性需要重新校準。"
        ),
    },
    # ========== Ch10: Counterparty Credit Risk ==========
    "10.2": {
        "story": (
            "場外衍生品交易部門需要為每筆利率互換估算交易對手曝險——"
            "不只是今天的 MTM，而是未來每個時點的潛在正曝險 (PFE)。"
            "本節介紹 CCR 度量的核心框架：EE、EPE、PFE 與有效 EE 的定義與計算邏輯。"
        ),
        "risk": "未來曝險路徑的計量框架選擇",
        "model": "CCR 度量框架",
        "output": "選擇 EE/PFE 指標以滿足內部限額與監管",
        "sub": "從 MTM 快照到未來曝險路徑的概念跳躍",
        "ref": "10.3 EE & PFE 數值計算、10.8 CVA 定價",
        "concl": (
            "EE$(t) = E[\\max(V(t), 0)]$ 衡量平均正曝險，PFE$(t)$ 取 97.5% 分位數衡量最壞情況。"
            "有效 EE (Effective EE) 確保曝險概廓不會因路徑收斂而提前下降，"
            "這是 Basel 對 CCR 資本計提的基礎。"
        ),
    },
    "10.3": {
        "story": (
            "量化團隊需要把 EE 與 PFE 的定義變成可跑的程式：模擬 10,000 條風險因子路徑，"
            "在每個未來時點計算衍生品的 MTM，再取正值期望與分位數。"
            "本節示範完整的 EE/PFE 數值計算流程與 Profile 曲線的解讀。"
        ),
        "risk": "未來曝險概廓的數值穩定性",
        "model": "EE / PFE 計算",
        "output": "產出完整時間軸上的 EE 與 PFE 概廓",
        "sub": "從路徑模擬到曝險概廓的程式化流程",
        "ref": "10.4 遠期合約曝險特性、10.5 IRS 曝險特性",
        "concl": (
            "EE Profile 的形狀取決於商品特性：遠期合約的 EE 隨時間單調遞增，"
            "而利率互換的 EE 先升後降（diffusion vs. amortization effect）。"
            "準確的 Profile 是 CVA 定價（10.8 節）的必要輸入。"
        ),
    },
    "10.4": {
        "story": (
            "一筆 5 年期外匯遠期合約的曝險會怎麼演變？因為沒有中間現金流，"
            "MTM 的不確定性隨時間純擴散——曝險概廓呈現「越來越寬的扇形」。"
            "本節分析遠期合約特有的曝險動態，並與互換做對比。"
        ),
        "risk": "無中間現金流合約的曝險擴散模式",
        "model": "遠期曝險概廓",
        "output": "評估遠期合約的峰值曝險與限額使用",
        "sub": "純擴散效應：沒有 amortization 的曝險如何持續膨脹",
        "ref": "10.5 IRS 的擴散+攤還雙效應、10.7 Netting",
        "concl": (
            "遠期合約的 EE$(t) \\propto \\sigma\\sqrt{t}$ 純粹由擴散驅動，"
            "峰值曝險出現在到期日——這與利率互換的「先升後降」形成鮮明對比。"
            "限額管理上，遠期合約因峰值偏後而需要更長的覆蓋期。"
        ),
    },
    "10.5": {
        "story": (
            "利率互換的曝險不像遠期那樣一路膨脹——隨著每次淨額結算，"
            "「已經交換過的」現金流讓殘餘名目逐步縮小，曝險先升後降。"
            "本節拆解 IRS 的 diffusion effect 與 amortization effect 的拉鋸。"
        ),
        "risk": "利率互換特有的先升後降曝險動態",
        "model": "IRS 曝險概廓",
        "output": "識別曝險峰值時點以配置最佳擔保策略",
        "sub": "擴散與攤還的拉鋸戰：IRS 的弧形曝險",
        "ref": "10.6 貨幣互換加上匯率風險、10.8 CVA 輸入",
        "concl": (
            "IRS EE Profile 呈倒 U 形：前期以 diffusion 為主（曝險上升），"
            "中後期 amortization 開始壓制（曝險下降），峰值通常出現在合約期限的 30-40% 處。"
            "這個峰值位置決定了擔保品調撥的最佳時機。"
        ),
    },
    "10.6": {
        "story": (
            "貨幣互換有一個遠期合約沒有的特殊風險：到期日的本金交換。"
            "即使中間現金流抵銷了部分曝險，到期日一整筆本金重新暴露使得曝險「回彈」。"
            "本節分析匯率波動如何讓貨幣互換的曝險比 IRS 更高。"
        ),
        "risk": "到期本金交換造成的曝險二次峰值",
        "model": "貨幣互換曝險",
        "output": "量化匯率波動對 CCR 的額外貢獻",
        "sub": "本金交換讓曝險在到期日出現第二個峰值",
        "ref": "10.7 netting 與抵銷、10.4 遠期對比",
        "concl": (
            "貨幣互換的 EE Profile 呈「雙峰」：中段因攤還下降，到期因本金交換再次上升。"
            "這使得貨幣互換的 EPE 通常高於等值 IRS，"
            "在 CVA 計算中必須給予更高的信用成本。"
        ),
    },
    "10.7": {
        "story": (
            "銀行與同一交易對手有 50 筆衍生品——有些 MTM 為正，有些為負。"
            "Netting Agreement 允許在違約時以淨額結算，大幅降低曝險。"
            "本節分析 ISDA Master Agreement 下的 netting 效果與擔保品機制 (CSA)。"
        ),
        "risk": "多筆交易淨額結算後的剩餘曝險",
        "model": "Netting & CSA",
        "output": "量化 netting benefit 與擔保品覆蓋率",
        "sub": "從毛曝險到淨曝險：ISDA 框架的計量效果",
        "ref": "10.8 CVA 計算中的 netting 處理",
        "concl": (
            "Netting 將曝险從 $\\sum \\max(V_i, 0)$ 降至 $\\max(\\sum V_i, 0)$，"
            "兩者的差距即為 netting benefit——交易數越多、方向越分散，效果越大。"
            "CSA 中的 minimum transfer amount 與 threshold 決定了擔保品能覆蓋多少剩餘曝險。"
        ),
    },
    "10.8": {
        "story": (
            "定價團隊在衍生品報價中看到一個「CVA charge」——這不是手續費，"
            "而是對交易對手違約風險的市場化定價。本節推導 CVA 的離散化公式："
            "把 EE Profile 與違約機率段段相乘再折現。"
        ),
        "risk": "交易對手違約風險的公允價格",
        "model": "CVA 定價",
        "output": "計算 CVA 金額並嵌入衍生品報價",
        "sub": "把曝險概廓與違約機率逐段相乘的定價邏輯",
        "ref": "10.9 Wrong-Way Risk、9.6 CDS 存活率自展",
        "concl": (
            "$\\text{CVA} \\approx (1-R) \\sum_{i=1}^{n} EE(t_i) \\times [Q(t_{i-1}) - Q(t_i)]$ "
            "將曝險概廓與邊際違約機率逐段相乘。"
            "EE 來自 10.3 節的模擬，$Q$ 來自 9.6 節的 CDS 自展——CVA 是這兩條工作流的交匯點。"
        ),
    },
    "10.9": {
        "story": (
            "2008 年金融危機中，房貸相關衍生品的曝險恰好在交易對手最可能違約的時候最大——"
            "曝險與違約機率正相關，CVA 被嚴重低估。這就是 Wrong-Way Risk (WWR)。"
            "本節定義 Specific 與 General WWR 並討論建模策略。"
        ),
        "risk": "曝險與違約正相關時的低估風險",
        "model": "Wrong-Way Risk",
        "output": "識別 WWR 情境並調整 CVA 估計",
        "sub": "曝險與違約品質同時惡化的毒性交互",
        "ref": "壓力測試中的 WWR 情境、CCR 限額調整",
        "concl": (
            "General WWR 源於宏觀因子同時惡化曝險與信用品質，Specific WWR 則是特定對手的曝險結構直接掛鉤其信用。"
            "將 WWR 納入 CVA 需要聯合模擬曝險與違約強度，"
            "最簡單的做法是用 copula 將 $V(t)$ 與 $\\tau$ 的相關性參數化。"
        ),
    },
    # ========== Ch11: Portfolio Optimization ==========
    "11.2": {
        "story": (
            "投組最佳化問題是一道帶等式約束的極值問題：最小化 $\\sigma_p^2$，同時滿足 $\\sum w_i = 1$ 與 $\\sum w_i \\mu_i = \\mu_0$。"
            "Lagrange 乘數法是解這類約束優化的標準武器。本節推導對偶問題並解釋乘數 $\\lambda$ 的經濟意涵。"
        ),
        "risk": "帶約束投組優化的數學求解方法",
        "model": "Lagrange 乘數法",
        "output": "導出最佳權重向量的封閉解",
        "sub": "約束優化的對偶問題與乘數的經濟意涵",
        "ref": "11.3 全球最小變異數投組、11.4 有效前緣",
        "concl": (
            "Lagrangian $\\mathcal{L} = w^\\top \\Sigma w - \\lambda_1(w^\\top \\mathbf{1} - 1) - \\lambda_2(w^\\top \\mu - \\mu_0)$ "
            "的一階條件得出 $w^* = \\Sigma^{-1}(\\lambda_1 \\mathbf{1} + \\lambda_2 \\mu)$。"
            "乘數 $\\lambda_2$ 正是有效前緣上目標報酬的邊際風險成本——它連結數學與經濟直覺。"
        ),
    },
    "11.3": {
        "story": (
            "CIO 問分析師：「不管報酬率目標，能把組合波動率壓到最低的配置是什麼？」"
            "Global Minimum Variance Portfolio (GMVP) 正是有效前緣的最左端點。"
            "本節推導 GMVP 的封閉解並討論它在實務中為什麼常常壓過許多主動策略。"
        ),
        "risk": "投組波動率的理論下限",
        "model": "GMVP 封閉解",
        "output": "計算不設報酬目標時的最低風險配置",
        "sub": "有效前緣的最左端：純粹追求最低風險",
        "ref": "11.4 向上延伸有效前緣、11.6 禁止放空",
        "concl": (
            "GMVP 權重 $w_{\\text{gmv}} = \\frac{\\Sigma^{-1} \\mathbf{1}}{\\mathbf{1}^\\top \\Sigma^{-1} \\mathbf{1}}$ "
            "不需要報酬率估計——這是它實務上常勝的原因：避免了報酬率預測的巨大估計誤差。"
            "下一節將從 GMVP 向上延伸出完整的有效前緣。"
        ),
    },
    "11.4": {
        "story": (
            "投資委員會看到一張報酬-風險散佈圖：數百種投組組合中，只有一條上凸曲線是有效率的——"
            "同風險下報酬最高、同報酬下風險最低。本節推導 Efficient Frontier 的參數式，"
            "並展示它為什麼是一條雙曲線。"
        ),
        "risk": "所有可行投組中的最優風險-報酬邊界",
        "model": "有效前緣曲線",
        "output": "繪製有效前緣以供投資委員會決策",
        "sub": "報酬-風險空間中的效率邊界為何是雙曲線",
        "ref": "11.5 數據實例、12.1 加入無風險資產",
        "concl": (
            "有效前緣在 $(\\sigma_p, \\mu_p)$ 空間中為雙曲線的上半部，"
            "參數式 $\\sigma_p^2 = \\frac{C\\mu_p^2 - 2B\\mu_p + A}{AC - B^2}$ 中 $A, B, C$ 可從 $\\Sigma^{-1}$ 預計算。"
            "下一節將用真實資料繪製此曲線，驗證理論形狀。"
        ),
    },
    "11.5": {
        "story": (
            "分析師用 5 檔 ETF 2019-2024 的歷史報酬跑出有效前緣——結果發現某些「理論最佳」配置"
            "把 80% 資金押在單一資產上。本節用數據實例演示有效前緣的建構，"
            "並揭示輸入估計誤差如何讓「理論最佳」偏離「實務可行」。"
        ),
        "risk": "估計誤差對最佳投組的不穩定影響",
        "model": "前緣實例分析",
        "output": "判斷理論最佳投組在實務上是否穩健",
        "sub": "用真實資料暴露有效前緣的估計脆弱性",
        "ref": "11.6 禁止放空約束、12.2 最佳風險投組",
        "concl": (
            "當共變異數矩陣的估計樣本不足時，$\\Sigma^{-1}$ 中的極小特徵值會放大權重波動，"
            "導致 out-of-sample 績效遠遜於 in-sample 前緣。"
            "Shrinkage estimator（如 Ledoit-Wolf）可在估計風險與偏差之間取得平衡。"
        ),
    },
    "11.6": {
        "story": (
            "許多共同基金受法規限制不得放空——加入 $w_i \\ge 0$ 約束後，有效前緣會怎麼變？"
            "本節示範加入不等式約束如何讓前緣向內收縮、頂端截斷，"
            "並介紹用二次規劃 (QP) 求解的數值方法。"
        ),
        "risk": "禁止放空約束對前緣可行域的壓縮",
        "model": "No-Shorting 約束",
        "output": "在非負權重下找出最佳投組",
        "sub": "不等式約束如何壓縮有效前緣",
        "ref": "12.2 含無風險資產的最佳投組、pymoo 求解器",
        "concl": (
            "加入 $w_i \\ge 0$ 後，Lagrange 對偶不再給出封閉解，必須使用 QP solver（如 `scipy.optimize.minimize` + SLSQP）。"
            "禁止放空的前緣嚴格位於無約束前緣的下方（或重合），"
            "且報酬率上限受限於最高報酬資產的 $\\mu$。"
        ),
    },
    # ========== Ch12: Capital Allocation & CAPM ==========
    "12.2": {
        "story": (
            "投資委員會需要從有效前緣上挑出「唯一最佳」的風險投組——不是靠報酬率目標，"
            "而是靠 Sharpe Ratio 最大化。本節推導 Tangency Portfolio 如何從 CAL（資本配置線）"
            "與有效前緣的切點決定。"
        ),
        "risk": "有效前緣上哪個點是風險-報酬效率最高的",
        "model": "切線投組",
        "output": "識別 Sharpe Ratio 最大化的風險投組",
        "sub": "CAL 與有效前緣的切點如何決定唯一最佳",
        "ref": "12.3 效用函數選偏好、12.4 完全投組",
        "concl": (
            "切線投組 $w_T = \\frac{\\Sigma^{-1}(\\mu - r_f \\mathbf{1})}{\\mathbf{1}^\\top \\Sigma^{-1}(\\mu - r_f \\mathbf{1})}$ "
            "最大化 Sharpe Ratio $\\frac{\\mu_p - r_f}{\\sigma_p}$。"
            "所有理性投資者（不論風險偏好）都會選擇同一個切線投組，差別只在與無風險資產的配比——"
            "這是兩基金分離定理的核心。"
        ),
    },
    "12.3": {
        "story": (
            "兩位客戶都持有相同的切線投組，但一位是保守退休族、另一位是激進年輕人。"
            "效用函數 $U = \\mu_p - \\frac{1}{2}A\\sigma_p^2$ 中的風險厭惡係數 $A$ 決定了"
            "他們各自投多少比例在風險投組上。本節用無差異曲線匹配最佳配置。"
        ),
        "risk": "投資者風險厭惡度如何量化",
        "model": "效用 / 無差異曲線",
        "output": "根據 $A$ 決定無風險 vs. 風險資產的比例",
        "sub": "風險厭惡係數 A 如何把偏好變成配置",
        "ref": "12.4 最佳完全投組求解、行為金融偏差",
        "concl": (
            "無差異曲線 $\\mu_p = U_0 + \\frac{1}{2}A\\sigma_p^2$ 是 $\\sigma$-$\\mu$ 空間中斜率與 $A$ 成正比的拋物線。"
            "它與 CAL 的切點給出最佳完全投組的風險投組比例 $y^* = \\frac{\\mu_T - r_f}{A\\sigma_T^2}$——"
            "$A$ 越大，配置在風險投組上的比例越低。"
        ),
    },
    "12.4": {
        "story": (
            "顧問把所有環節串在一起：先算出切線投組（12.2），再用客戶的 $A$ 值算出風險部位比例（12.3），"
            "最後得到每檔資產的「最終錢數」——這就是 Optimal Complete Portfolio。"
            "本節整合前三節的結果，完成從理論到實際配置表的完整流程。"
        ),
        "risk": "從理論權重到可執行資產配置表的轉換",
        "model": "最佳完全投組",
        "output": "產出每檔資產的最終配置金額與比例",
        "sub": "把切線投組、效用偏好與資金限制整合為配置表",
        "ref": "12.5 CAPM 均衡推論、動態再平衡策略",
        "concl": (
            "完全投組權重 $w_{\\text{complete}} = y^* \\cdot w_T + (1-y^*) \\cdot \\text{risk-free}$，"
            "在實務中還必須考慮交易成本、流動性與再平衡頻率。"
            "當 $y^* > 1$，投資者透過借貸槓桿化切線投組——此槓桿比例要受風控限額約束。"
        ),
    },
    "12.5": {
        "story": (
            "如果所有投資者都按 Mean-Variance 配置，市場均衡價格會怎樣？"
            "CAPM 的答案是：每單位系統風險 $\\beta$ 都應獲得相同的超額報酬。"
            "本節從兩基金分離定理推導出 SML $E[R_i] - r_f = \\beta_i (E[R_M] - r_f)$，"
            "並討論 CAPM 在實務中的成就與侷限。"
        ),
        "risk": "資產預期報酬的均衡定價邏輯",
        "model": "CAPM / SML",
        "output": "判斷個別資產是否被市場正確定價",
        "sub": "從兩基金分離到 Security Market Line 的推導",
        "ref": "多因子模型延伸 (Fama-French)、風險預算",
        "concl": (
            "SML $E[R_i] = r_f + \\beta_i (E[R_M] - r_f)$ 中 $\\beta_i = \\text{Cov}(R_i, R_M) / \\text{Var}(R_M)$ "
            "是系統風險的唯一計量——超額報酬 (alpha) 的存在代表市場尚未均衡。"
            "但 CAPM 的單因子假設被 Fama-French 三因子與動量因子逐步擴展，"
            "反映了學術與實務對均衡模型持續修正的歷程。"
        ),
    },
}

# Chapter accent colors (same as expand_story_svg_sections.py)
CHAPTER_COLORS: dict[int, tuple[str, str]] = {
    1: ("#ef4444", "#fee2e2"),
    2: ("#14b8a6", "#ccfbf1"),
    3: ("#60a5fa", "#dbeafe"),
    4: ("#f59e0b", "#fef3c7"),
    5: ("#f97316", "#ffedd5"),
    6: ("#ef4444", "#fee2e2"),
    7: ("#a855f7", "#f3e8ff"),
    8: ("#22c55e", "#dcfce7"),
    9: ("#06b6d4", "#cffafe"),
    10: ("#38bdf8", "#e0f2fe"),
    11: ("#8b5cf6", "#ede9fe"),
    12: ("#ec4899", "#fce7f3"),
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

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
    title = heading.split(" ", 1)[1] if " " in heading else heading
    title = title.split("：", 1)[0].split(":", 1)[0]
    title = re.sub(r"\s*\([^)]*\)", "", title).strip()
    return title


# ---------------------------------------------------------------------------
# Replacement: Story Guide
# ---------------------------------------------------------------------------

STORY_RE = re.compile(
    r'> \*\*📖 實戰場景 \(Story Guide\)：[^\n]*\*\*\n(?:> [^\n]*\n?)*',
    re.MULTILINE,
)


def make_new_story(meta: dict[str, str], heading: str) -> str:
    focus = short_focus(heading)
    # Build unique title from first sentence
    first_sentence = meta["story"].split("。")[0] + "。" if "。" in meta["story"] else meta["story"][:20]
    # Use focus in title for uniqueness
    title_hint = focus if len(focus) <= 15 else focus[:15]
    return (
        f"> **📖 實戰場景 (Story Guide)：{title_hint}的實務決策場景**\n"
        f"> {meta['story']}"
    )


# ---------------------------------------------------------------------------
# Replacement: SVG Section Map
# ---------------------------------------------------------------------------

SVG_BLOCK_RE = re.compile(
    r'<div class="payoff-diagram-container"[^>]*>\s*\n?'
    r'<svg[^>]*class="section-map-svg"[^>]*>.*?</svg>\s*\n?'
    r'</div>',
    re.DOTALL,
)


def make_new_svg(sid: str, heading: str, meta: dict[str, str], accent: str, accent_soft: str) -> str:
    sid_safe = sid.replace(".", "_")
    focus = short_focus(heading)
    return f'''<div class="payoff-diagram-container" style="background:#0f172a; padding:20px; border-radius:10px; margin: 15px 0; border: 1px solid #1e293b;">
<svg viewBox="0 0 760 240" class="section-map-svg" role="img" aria-labelledby="title-{sid_safe} desc-{sid_safe}">
  <defs>
    <linearGradient id="grad-{sid_safe}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.22" />
      <stop offset="100%" stop-color="{accent_soft}" stop-opacity="0.08" />
    </linearGradient>
    <marker id="arrow-{sid_safe}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
    </marker>
  </defs>
  <title id="title-{sid_safe}">{heading} 的概念流程圖</title>
  <desc id="desc-{sid_safe}">{meta["sub"]}</desc>
  <text x="34" y="34" font-size="18" font-weight="700" fill="#e2e8f0">Section Map: {sid} {focus}</text>
  <text x="34" y="54" font-size="11" fill="#94a3b8">{meta["sub"]}</text>
  <rect x="28" y="78" width="704" height="112" rx="18" fill="url(#grad-{sid_safe})" stroke="#1e293b" />
  <rect x="54" y="100" width="182" height="70" rx="14" fill="#111827" stroke="{accent}" stroke-width="1.5" />
  <text x="73" y="124" font-size="13" font-weight="700" fill="{accent_soft}">風險問題</text>
  <text x="73" y="145" font-size="12" fill="#e5e7eb">{meta["risk"]}</text>
  <text x="73" y="161" font-size="10" fill="#94a3b8">本節要回答的具體不確定性</text>
  <path d="M 236 135 L 292 135" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow-{sid_safe})" />
  <rect x="292" y="100" width="182" height="70" rx="14" fill="#111827" stroke="{accent}" stroke-width="1.5" />
  <text x="311" y="124" font-size="13" font-weight="700" fill="{accent_soft}">本節模型</text>
  <text x="311" y="145" font-size="12" fill="#e5e7eb">{meta["model"]}</text>
  <text x="311" y="161" font-size="10" fill="#94a3b8">用什麼方法把風險問題量化</text>
  <path d="M 474 135 L 530 135" fill="none" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow-{sid_safe})" />
  <rect x="530" y="100" width="176" height="70" rx="14" fill="#111827" stroke="{accent}" stroke-width="1.5" />
  <text x="549" y="124" font-size="13" font-weight="700" fill="{accent_soft}">決策輸出</text>
  <text x="549" y="145" font-size="12" fill="#e5e7eb">{meta["output"]}</text>
  <text x="549" y="161" font-size="10" fill="#94a3b8">學完本節後能做的具體判斷</text>
  <text x="34" y="214" font-size="10" fill="#94a3b8">{meta["ref"]}</text>
</svg>
</div>'''


# ---------------------------------------------------------------------------
# Replacement: Conclusion
# ---------------------------------------------------------------------------

CONCLUSION_TEMPLATE_RE = re.compile(
    r'#### 核心技術結論\n'
    r'[^\n]*的價值，在於把[^\n]*整理成可驗證、可比較、可落地的量化輸出。'
    r'[^\n]*',
    re.MULTILINE,
)


def make_new_conclusion(meta: dict[str, str]) -> str:
    return f"#### 核心技術結論\n{meta['concl']}"


# ---------------------------------------------------------------------------
# Process a single file
# ---------------------------------------------------------------------------

def process_file(path: Path, dry_run: bool = True) -> tuple[bool, list[str]]:
    """Process one file. Returns (changed, list_of_changes)."""
    original = path.read_text(encoding="utf-8")
    newline = detect_newline(original)
    heading = section_heading(original)
    sid = section_id_from_heading(heading)

    if sid not in SECTION_META:
        return False, [f"  SKIP {sid}: no metadata"]

    meta = SECTION_META[sid]
    chapter = int(sid.split(".")[0])
    accent, accent_soft = CHAPTER_COLORS.get(chapter, ("#94a3b8", "#e2e8f0"))
    changes: list[str] = []
    text = original

    # 1. Replace Story Guide
    story_match = STORY_RE.search(text)
    if story_match:
        old_story = story_match.group(0)
        if "不是孤立的術語" in old_story:
            new_story = make_new_story(meta, heading)
            text = text[:story_match.start()] + new_story + text[story_match.end():]
            changes.append("  ✓ Story Guide replaced")
        else:
            changes.append("  - Story Guide already unique, skipped")
    else:
        changes.append("  ⚠ No Story Guide found")

    # 2. Replace SVG Section Map
    svg_match = SVG_BLOCK_RE.search(text)
    if svg_match:
        old_svg = svg_match.group(0)
        if "先釐清問題，再接上模型，最後回到可執行的金融判斷" in old_svg or "先界定這一節到底要處理什麼不確定性" in old_svg:
            new_svg = make_new_svg(sid, heading, meta, accent, accent_soft)
            text = text[:svg_match.start()] + new_svg + text[svg_match.end():]
            changes.append("  ✓ SVG Section Map replaced")
        else:
            changes.append("  - SVG already unique, skipped")
    else:
        changes.append("  ⚠ No section-map SVG found")

    # 3. Replace templated conclusion
    concl_match = CONCLUSION_TEMPLATE_RE.search(text)
    if concl_match:
        new_concl = make_new_conclusion(meta)
        text = text[:concl_match.start()] + new_concl + text[concl_match.end():]
        changes.append("  ✓ Conclusion replaced")
    elif "#### 核心技術結論" in text:
        changes.append("  - Conclusion already unique, skipped")
    else:
        changes.append("  ⚠ No conclusion section found")

    changed = text != original
    if changed and not dry_run:
        text = text.replace("\n", newline) if newline == "\r\n" else text
        path.write_text(text, encoding="utf-8")

    return changed, changes


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Upgrade templated section content")
    parser.add_argument("--apply", action="store_true", help="Actually write changes")
    parser.add_argument("--ch", type=int, nargs="*", help="Only process specific chapters")
    args = parser.parse_args()

    root = Path("src/content")
    chapters = args.ch or list(range(1, 13))
    total_changed = 0
    total_files = 0

    for chapter in sorted(chapters):
        ch_dir = root / f"b2_ch{chapter}"
        if not ch_dir.exists():
            continue
        files = sorted(ch_dir.glob("*.md"))
        for f in files:
            total_files += 1
            sid = f.stem.split("_")[0]  # e.g. "2.2"
            if sid not in SECTION_META:
                print(f"[SKIP] {f.name} (no metadata for {sid})")
                continue
            changed, changes = process_file(f, dry_run=not args.apply)
            status = "WRITE" if (changed and args.apply) else ("WOULD" if changed else "CLEAN")
            print(f"[{status}] {f.name}")
            for c in changes:
                print(c)
            if changed:
                total_changed += 1

    mode = "Applied" if args.apply else "Dry-run"
    print(f"\n{mode}: {total_changed}/{total_files} files {'changed' if args.apply else 'would change'}")

    if args.apply:
        # Verify no templates remain
        template_count = 0
        for chapter in sorted(chapters):
            ch_dir = root / f"b2_ch{chapter}"
            if not ch_dir.exists():
                continue
            for f in sorted(ch_dir.glob("*.md")):
                content = f.read_text(encoding="utf-8")
                if "不是孤立的術語" in content:
                    print(f"  ⚠ TEMPLATE REMAINS: {f.name} (Story Guide)")
                    template_count += 1
                if "可驗證、可比較、可落地" in content:
                    print(f"  ⚠ TEMPLATE REMAINS: {f.name} (Conclusion)")
                    template_count += 1
        if template_count == 0:
            print("  ✅ No template patterns detected")
        else:
            print(f"  ❌ {template_count} template occurrences still present")


if __name__ == "__main__":
    main()
