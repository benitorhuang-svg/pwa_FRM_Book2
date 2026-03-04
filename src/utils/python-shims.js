/**
 * Python 相容性墊片 (Compatibility Shims)
 * 
 * 本檔案包含用於在 Pyodide 環境中模擬或填補缺失函式庫的 Python 代碼字串
 * (例如：QuantLib C++ 擴充套件、Pymoo 舊版支援)。
 */

export const QUANTLIB_SHIM = `
# QuantLib (ql) 強大模擬層
# 由於 QuantLib 是 C++ 擴充套件，目前無法在瀏覽器原生執行。
# 我們提供一個高度相容的模擬層，以支援書中 Chapter 12 的債券與利率分析範例。
import sys
import datetime
from types import ModuleType
ql = ModuleType('QuantLib')
sys.modules['QuantLib'] = ql

class QLDate:
    def __init__(self, *args):
        try:
            if len(args) == 3: # (d, m, y)
                self.dt = datetime.date(args[2], args[1], args[0])
            elif len(args) == 2: # (str_val, fmt)
                py_fmt = args[1].replace('%d', '%d').replace('%m', '%m').replace('%Y', '%Y')
                self.dt = datetime.datetime.strptime(args[0], py_fmt).date()
            elif len(args) == 1 and isinstance(args[0], QLDate):
                self.dt = args[0].dt
            elif len(args) == 1 and isinstance(args[0], datetime.date):
                self.dt = args[0]
            else:
                self.dt = datetime.date(2020, 1, 1)
        except Exception:
            self.dt = datetime.date(2020, 1, 1)

    def __add__(self, other):
        if isinstance(other, int):
            new_dt = self.dt + datetime.timedelta(days=other)
            return QLDate(new_dt.day, new_dt.month, new_dt.year)
        elif hasattr(other, 'units'): # QLPeriod
            val = other.value
            if other.units == "Days":
                new_dt = self.dt + datetime.timedelta(days=val)
                return QLDate(new_dt)
            elif other.units == "Weeks":
                new_dt = self.dt + datetime.timedelta(weeks=val)
                return QLDate(new_dt)
            elif other.units == "Months":
                new_dt = self.dt + datetime.timedelta(days=val * 30)
                return QLDate(new_dt)
            elif other.units == "Years":
                new_dt = self.dt + datetime.timedelta(days=val * 365)
                return QLDate(new_dt)
        return self

    def __sub__(self, other):
        if isinstance(other, QLDate):
            return (self.dt - other.dt).days
        return 0

    def __lt__(self, other): return self.dt < (other.dt if hasattr(other, 'dt') else other)
    def __le__(self, other): return self.dt <= (other.dt if hasattr(other, 'dt') else other)
    def __gt__(self, other): return self.dt > (other.dt if hasattr(other, 'dt') else other)
    def __ge__(self, other): return self.dt >= (other.dt if hasattr(other, 'dt') else other)
    def __eq__(self, other): return self.dt == (other.dt if hasattr(other, 'dt') else other)
    def __ne__(self, other): return not self.__eq__(other)
    def __hash__(self): return hash(self.dt)
    def __str__(self): return self.dt.strftime('%B %d, %Y')
    def __repr__(self): return self.__str__()
    def date(self): return self

ql.Date = QLDate

class QLPeriod:
    _UNIT_MAP = {'d': 'Days', 'w': 'Weeks', 'm': 'Months', 'y': 'Years'}
    def __init__(self, value, units=None):
        if isinstance(value, str) and units is None:
            import re as _re
            m = _re.match(r'(\\d+)\\s*([dwmyDWMY])', value)
            if m:
                self.value = int(m.group(1))
                self.units = self._UNIT_MAP.get(m.group(2).lower(), 'Days')
            else:
                self.value = 0
                self.units = 'Days'
        else:
            self.value = value
            self.units = units
ql.Period = QLPeriod
ql.Months = "Months"
ql.Years = "Years"
ql.Days = "Days"
ql.Weeks = "Weeks"

# 月份常數
ql.January, ql.February, ql.March = 1, 2, 3
ql.April, ql.May, ql.June = 4, 5, 6
ql.July, ql.August, ql.September = 7, 8, 9
ql.October, ql.November, ql.December = 10, 11, 12

class Settings:
    _inst = None
    @classmethod
    def instance(cls):
        if cls._inst is None: cls._inst = cls()
        return cls._inst
    evaluationDate = None
ql.Settings = Settings

class QLDayCount:
    def __init__(self, *args): pass
    def yearFraction(self, start, end):
        s = start.dt if hasattr(start, 'dt') else start
        e = end.dt if hasattr(end, 'dt') else end
        return (e - s).days / 365.0

ql.Thirty360 = QLDayCount
ql.ActualActual = QLDayCount
ql.ActualActual.Bond = "Bond"

class QLCalendar:
    def __init__(self, *args): pass
    def advance(self, date, value, units):
        if hasattr(units, 'units'): # It's a period
            return date + units
        return date + QLPeriod(value, units)

ql.NullCalendar = QLCalendar
ql.UnitedStates = QLCalendar
ql.UnitedStates.GovernmentBond = "GovernmentBond"
ql.Linear = lambda: "Linear"
ql.Compounded = "Compounded"
ql.Annual = 1
ql.Semiannual = 2
ql.Quarterly = 4
ql.Daily = 365
ql.Unadjusted = "Unadjusted"
ql.Following = "Following"

class DateGeneration: Backward = "Backward"
ql.DateGeneration = DateGeneration
ql.Schedule = lambda *args: "MockSchedule"
ql.MakeSchedule = lambda *args: "MockSchedule"
ql.FixedRateBondHelper = lambda *args: "MockHelper"

class CashFlow:
    def __init__(self, date, amount):
        self._date = date
        self._amount = amount
    def date(self): return self._date
    def amount(self): return self._amount

class QLZeroRate:
    def __init__(self, rate): self._rate = rate
    def rate(self): return self._rate
    def equivalentRate(self, *args): return self

class QLYieldCurve:
    def dates(self):
        d = ql.Settings.instance().evaluationDate or QLDate(15,1,2020)
        return [d + 90, d + 180, d + 365, d + 730, d + 1095]
    def zeroRate(self, yrs, compounding, freq): return QLZeroRate(0.05 + 0.005 * yrs)
    def enableExtrapolation(self): pass
    def discount(self, t):
        r = 0.05
        dt = float(t) if isinstance(t, (int, float)) else 1.0
        return np.exp(-r * dt)

ql.ZeroCurve = lambda *args: QLYieldCurve()
ql.PiecewiseLogCubicDiscount = lambda *args: QLYieldCurve()
ql.FlatForward = lambda *args: QLYieldCurve()

class QLQuote:
    def __init__(self, value=0.0): self._value = value
    def value(self): return self._value
    def setValue(self, value): self._value = value

class QLHandle:
    def __init__(self, link=None): self._link = link
    def linkTo(self, link): self._link = link
    def currentLink(self): return self._link
    def __getattr__(self, name): return getattr(self._link, name)

ql.QuoteHandle = QLHandle
ql.SimpleQuote = QLQuote
ql.YieldTermStructureHandle = QLHandle
ql.RelinkableYieldTermStructureHandle = QLHandle

class QLDuration:
    Modified = "Modified"
    Macaulay = "Macaulay"
ql.Duration = QLDuration

ql.BondFunctions = ModuleType('BondFunctions')
ql.BondFunctions.duration = lambda *args: 2.5
ql.BondFunctions.convexity = lambda *args: 10.0

class DiscountingBondEngine:
    def __init__(self, handle=None): self.handle = handle
ql.DiscountingBondEngine = DiscountingBondEngine

class FixedRateBond:
    def __init__(self, *args):
        self.faceValue = 100
        self.coupons = [0.05]
        self.engine = None
        if len(args) >= 2: self.faceValue = args[1]
        if len(args) >= 4: self.coupons = args[3]
    def dayCounter(self): return QLDayCount()
    def cashflows(self):
        d = ql.Settings.instance().evaluationDate or QLDate(15,1,2020)
        return [
            CashFlow(d + 180, self.faceValue * self.coupons[0] / 2),
            CashFlow(d + 360, self.faceValue + self.faceValue * self.coupons[0] / 2)
        ]
    def setPricingEngine(self, engine): self.engine = engine
    def cleanPrice(self, *args):
        rate = 0.05
        if self.engine and hasattr(self.engine, 'handle'):
            h = self.engine.handle
            while hasattr(h, 'currentLink') and h.currentLink() is not None:
                h = h.currentLink()
            if hasattr(h, 'zeroRate'):
                rate = h.zeroRate(10, 1, 1).rate() # 用 10 年期利率作為定價代理
        elif args: rate = args[0]
        return 100 / (1 + rate/2)**2
    def dirtyPrice(self, *args): return self.cleanPrice(*args) * 1.0125
    def NPV(self): return self.cleanPrice()
ql.FixedRateBond = FixedRateBond

class QLSpreadedCurve:
    def __init__(self, base_handle, spread_handles, dates):
        self._base = base_handle
        self._spreads = spread_handles
        self._dates = dates
    def zeroRate(self, yrs, compounding, freq):
        base = self._base
        while hasattr(base, 'currentLink') and base.currentLink() is not None:
            base = base.currentLink()
        br = base.zeroRate(yrs, compounding, freq).rate()
        # 簡單模擬：加總所有利差的平均值來體現敏感度
        total_spread = sum(s.value() if hasattr(s, 'value') else s for s in self._spreads)
        return QLZeroRate(br + total_spread / len(self._spreads))
    def dates(self): return self._dates

ql.SpreadedLinearZeroInterpolatedTermStructure = QLSpreadedCurve
class QLHullWhite:
    def __init__(self, handle, a, s): self.handle = handle
ql.HullWhite = QLHullWhite

class QLTreeEngine:
    def __init__(self, model, grid): self.handle = model.handle
ql.TreeCallableFixedRateBondEngine = QLTreeEngine

ql.CallabilitySchedule = list
ql.CallabilityPrice = lambda *args: "MockPrice"
ql.CallabilityPrice.Clean = "Clean"
ql.Callability = lambda *args: "MockCallability"
ql.Callability.Call = "Call"
ql.Callability.Put = "Put"
ql.CallableFixedRateBond = FixedRateBond

# ─── Ch10_5 extensions: CVA via GSR model + MC simulation ───

ql.Actual365Fixed = QLDayCount
ql.Thirty360.BondBasis = "BondBasis"
ql.ModifiedFollowing = "ModifiedFollowing"

class QLTarget:
    def advance(self, date, period):
        return date + period
ql.TARGET = QLTarget

class QLEuribor6M:
    def __init__(self, handle=None):
        self._handle = handle
        self._fixings = {}
    def tenor(self): return QLPeriod(6, "Months")
    def fixingCalendar(self): return QLTarget()
    def businessDayConvention(self): return "ModifiedFollowing"
    def dayCounter(self): return QLDayCount()
    def fixingDate(self, d): return d
    def isValidFixingDate(self, d): return True
    def fixing(self, d):
        k = str(d)
        return self._fixings.get(k, 0.025)
    def addFixing(self, d, v):
        self._fixings[str(d)] = v
ql.Euribor6M = QLEuribor6M

class QLSchedule:
    def __init__(self, start, end, tenor, calendar, bdc1, bdc2, dg, eomt):
        self._dates = []
        d = start
        while True:
            self._dates.append(d)
            nd = d + tenor
            if hasattr(nd, 'dt') and hasattr(end, 'dt') and nd.dt >= end.dt:
                break
            elif not hasattr(nd, 'dt'):
                break
            d = nd
        self._dates.append(end)
    def __iter__(self): return iter(self._dates)
    def __len__(self): return len(self._dates)
    def __getitem__(self, i): return self._dates[i]
ql.Schedule = QLSchedule

class QLVanillaSwap:
    Receiver = 1
    Payer = -1
    def __init__(self, typ, nominal, fixedSch, fixedRate, fixedDC, floatSch, index, spread, floatDC):
        self._typ = typ
        self._nominal = nominal
        self._fixed_sch = fixedSch
        self._fixed_rate = fixedRate
        self._float_sch = floatSch
        self._engine = None
    def setPricingEngine(self, engine): self._engine = engine
    def NPV(self):
        n = self._nominal
        r = self._fixed_rate
        years = 4
        if self._engine and hasattr(self._engine, 'handle'):
            h = self._engine.handle
            while hasattr(h, 'currentLink') and callable(h.currentLink) and h.currentLink() is not None:
                h = h.currentLink()
            if hasattr(h, 'discount'):
                total = 0.0
                for t in range(1, years+1):
                    total += n * r * h.discount(float(t))
                total += n * h.discount(float(years))
                total -= n * h.discount(0.0)
                return self._typ * total
        return self._typ * n * r * years * 0.01
ql.VanillaSwap = QLVanillaSwap

class QLGsrProcess:
    def expectation(self, t, x, dt): return x * np.exp(-0.04 * dt)
    def stdDeviation(self, t, x, dt): return 0.008 * np.sqrt(dt)

class QLGsr:
    def __init__(self, yts, stepDates, vols, meanRevs):
        self._yts = yts
        self._process = QLGsrProcess()
    def stateProcess(self): return self._process
    def zerobond(self, T, t, y):
        r = 0.025 + 0.005 * y if isinstance(y, (int, float)) else 0.025
        dt = T - t if T > t else 0.01
        return np.exp(-r * dt)
ql.Gsr = QLGsr

class QLDiscountCurve:
    def __init__(self, dates, discounts, dc):
        self._dates = dates
        self._discounts = list(discounts)
    def enableExtrapolation(self): pass
    def discount(self, t):
        if isinstance(t, (int, float)):
            idx = min(int(t), len(self._discounts)-1)
            idx = max(0, idx)
            return self._discounts[idx]
        return 1.0
ql.DiscountCurve = QLDiscountCurve

class QLDiscountingSwapEngine:
    def __init__(self, handle): self.handle = handle
ql.DiscountingSwapEngine = QLDiscountingSwapEngine

class QLHazardRateCurve:
    def __init__(self, dates, rates, dc):
        import numpy as _np
        self._times = []
        if len(dates) > 0 and hasattr(dates[0], 'dt'):
            base = dates[0].dt
            for d in dates:
                self._times.append((d.dt - base).days / 365.0)
        else:
            self._times = [float(i) for i in range(len(dates))]
        self._rates = list(rates)
    def enableExtrapolation(self): pass
    def _interp_rate(self, t):
        import numpy as _np
        return float(_np.interp(t, self._times, self._rates))
    def hazardRate(self, t):
        return self._interp_rate(float(t))
    def survivalProbability(self, t):
        import numpy as _np
        h = self._interp_rate(float(t))
        return float(_np.exp(-h * float(t)))
    def defaultProbability(self, *args):
        if len(args) == 2:
            return self.survivalProbability(args[0]) - self.survivalProbability(args[1])
        return 1.0 - self.survivalProbability(args[0])
    def defaultDensity(self, t):
        h = self._interp_rate(float(t))
        return h * self.survivalProbability(float(t))
ql.HazardRateCurve = QLHazardRateCurve

class QLIndexManager:
    _inst = None
    @classmethod
    def instance(cls):
        if cls._inst is None: cls._inst = cls()
        return cls._inst
    def clearHistories(self): pass
ql.IndexManager = QLIndexManager

class QLMersenneTwisterUniformRng:
    def __init__(self, seed=0):
        self._rng = __import__('random').Random(seed)
    def next(self):
        class Res:
            def __init__(self, v): self.value = v
        return Res(self._rng.random())
ql.MersenneTwisterUniformRng = QLMersenneTwisterUniformRng

class QLMersenneTwisterUniformRsg:
    def __init__(self, dim, rng):
        self._dim = dim
        self._rng = rng
    def nextSequence(self):
        class Seq:
            def __init__(self, vals): self.value = vals
        return Seq([self._rng.next().value for _ in range(self._dim)])
    def dimension(self): return self._dim
ql.MersenneTwisterUniformRsg = QLMersenneTwisterUniformRsg

class QLInvCumulativeGaussianRsg:
    def __init__(self, rsg):
        self._rsg = rsg
    def nextSequence(self):
        import scipy.stats as _st
        seq = self._rsg.nextSequence()
        vals = [float(_st.norm.ppf(max(1e-10, min(1-1e-10, u)))) for u in seq.value]
        class Seq:
            def __init__(self, v): self.value = v
        return Seq(vals)
ql.InvCumulativeMersenneTwisterGaussianRsg = QLInvCumulativeGaussianRsg

print("✅ QuantLib (ql) 強大模擬層已啟動。")
`;

export const PYMOO_SHIM = `
# Pymoo 相容性與警告抑制
try:
    import pymoo
    # 0.4.x 原生包含 pymoo.model.problem 和 pymoo.factory
    # 只需抑制編譯提示
    try:
        from pymoo.configuration import Configuration
        Configuration.show_compile_hint = False
    except (ImportError, AttributeError):
        pass
    
    # 驗證關鍵模組可匯入
    import pymoo.model.problem
    import pymoo.algorithms.nsga2
    print("✅ Pymoo 0.4.1：舊版 API 原生可用，無需額外映射。")
except ImportError as e:
    # 如果是 0.6.x 或其他版本，嘗試建立向後相容映射
    try:
        import sys
        import pymoo.core.problem
        import pymoo.algorithms.moo.nsga2
        sys.modules['pymoo.model.problem'] = pymoo.core.problem
        sys.modules['pymoo.algorithms.nsga2'] = pymoo.algorithms.moo.nsga2
        
        from types import ModuleType
        if not hasattr(pymoo, 'factory'):
            factory = ModuleType('pymoo.factory')
            from pymoo.operators.sampling.rnd import FloatRandomSampling
            from pymoo.operators.crossover.sbx import SBX
            from pymoo.operators.mutation.pm import PM
            from pymoo.termination import get_termination as _get_termination
            def get_sampling(name, *args, **kwargs): return FloatRandomSampling()
            def get_crossover(name, *args, **kwargs): return SBX(prob=kwargs.get('prob', 0.9), eta=kwargs.get('eta', 15))
            def get_mutation(name, *args, **kwargs): return PM(eta=kwargs.get('eta', 20))
            factory.get_sampling = get_sampling
            factory.get_crossover = get_crossover
            factory.get_mutation = get_mutation
            factory.get_termination = _get_termination
            sys.modules['pymoo.factory'] = factory
        print("✅ Pymoo 相容性：舊版 API 映射已完成（0.6.x -> 0.4.x 路徑）。")
    except Exception as e2:
        if not isinstance(e2, ImportError):
            print(f"⚠️ Pymoo Shim Error: {e2}")
            print(f"Original Import Error (0.4.x): {e}")
except Exception as e:
    if not isinstance(e, ImportError):
        print(f"⚠️ Pymoo Shim Error: {e}")
    pass
`;

export const PANDAS_DATAREADER_SHIM = `
# 模擬數據引擎：處理 DataReader 因 CORS 導致的 RemoteDataError
def simulated_data_reader(name, data_source=None, start=None, end=None, **kwargs):
    import pandas as pd
    import numpy as np
    
    # 預設行為：模擬 Yahoo Finance 結構 (High, Low, Open, Close, Volume, Adj Close)
    print(f"📡 模擬數據引擎：由於瀏覽器 CORS 限制，正在為 {name} 產生模擬股價數據 (Yahoo Finance Bypass)...")
    
    start_date = pd.to_datetime(start or '2020-01-01')
    end_date = pd.to_datetime(end or '2020-12-31')
    dates = pd.date_range(start_date, end_date)
    
    tickers = [name] if isinstance(name, str) else name
    
    # 支援多 Ticker 回傳
    result_dict = {}
    
    for ticker in tickers:
        ticker_lower = ticker.lower()
        
        # 定義不同股票的基礎特徵 (Base Price, Volatility)
        stock_map = {
            'goog': (1500, 0.015), 'amzn': (3200, 0.018), 'fb': (270, 0.02), 'meta': (270, 0.02),
            'nflx': (500, 0.025), 'gld': (180, 0.008), 'ge': (10, 0.012), 
            'nke': (140, 0.012), 'ford': (9, 0.015), 'dis': (170, 0.015), 
            'aapl': (130, 0.018), 'tsla': (700, 0.035), 'sp500': (3700, 0.01),
            '^gspc': (3700, 0.01), 'wti': (48, 0.025)
        }
        
        base_price, volatility = stock_map.get(ticker_lower, (100, 0.02))
        
        # 產生隨機漫步價格
        np.random.seed(sum(ord(c) for c in ticker) + len(dates)) # Deterministic random based on ticker
        returns = np.random.normal(0.0005, volatility, len(dates))
        price_path = base_price * np.exp(np.cumsum(returns))
        
        # 產生 OHLCV
        df_ticker = pd.DataFrame(index=dates)
        df_ticker['Adj Close'] = price_path
        df_ticker['Close'] = price_path
        df_ticker['Open'] = price_path * np.random.uniform(0.99, 1.01, len(dates))
        df_ticker['High'] = np.maximum(df_ticker['Open'], df_ticker['Close']) * np.random.uniform(1.0, 1.01, len(dates))
        df_ticker['Low'] = np.minimum(df_ticker['Open'], df_ticker['Close']) * np.random.uniform(0.99, 1.0, len(dates))
        df_ticker['Volume'] = np.random.randint(1000000, 10000000, len(dates))
        
        result_dict[ticker] = df_ticker

    # FRED 數據源處理 (Return single column per series)
    if data_source == 'fred':
        fred_data = {t: result_dict[t]['Adj Close'] for t in tickers}
        df = pd.DataFrame(fred_data)
        return df.astype(float) # Strict float casting
        
    # Yahoo 數據源處理
    if len(tickers) == 1:
        return result_dict[tickers[0]].astype(float)
    else:
        # Multi-index dataframe for multiple tickers
        reformed_data = {}
        for attr in ['High', 'Low', 'Open', 'Close', 'Volume', 'Adj Close']:
            reformed_data[attr] = pd.DataFrame({t: result_dict[t][attr] for t in tickers})
        
        # Concatenate significantly simplifies structure
        return pd.concat(reformed_data, axis=1).astype(float)

# 強制攔截 Patching
try:
    import sys
    import pandas_datareader
    import pandas_datareader.data as pdr_data
    
    # 替換核心函數
    pdr_data.DataReader = simulated_data_reader
    pdr_data.get_data_yahoo = simulated_data_reader
    pdr_data.get_data_fred = simulated_data_reader
    
    # 替換頂層
    pandas_datareader.DataReader = simulated_data_reader
    if hasattr(pandas_datareader, 'data'):
        pandas_datareader.data.DataReader = simulated_data_reader
        pandas_datareader.data.get_data_yahoo = simulated_data_reader
        
    print("✅ 模擬數據引擎：已成功攔截 pandas_datareader (Yahoo/FRED CORS Bypass)。")
    
except ImportError:
    # 即使尚未匯入，也要嘗試預先注入 sys.modules (為了稍後匯入時能生效? 難以做到，只能依靠 App.jsx 在匯入後觸發此墊片)
    pass
except Exception as e:
    print(f"⚠️ 模擬數據引擎啟動警告: {str(e)}")
`;

export const SCIPY_RVS_SHIM = `
# SciPy .rvs() 相容性墊片
try:
    import scipy.stats as _scipy_stats
    import numpy as _np
    _orig_rvs = _scipy_stats.rv_generic.rvs

    def _patched_rvs(self, *args, **kwargs):
        try:
            return _orig_rvs(self, *args, **kwargs)
        except (ImportError, AttributeError) as _e:
            if 'fblas' not in str(_e) and 'flapack' not in str(_e):
                raise
            _name = getattr(self, 'name', getattr(getattr(self, 'dist', None), 'name', ''))
            _size = kwargs.get('size', None)
            _loc = kwargs.get('loc', 0)
            _scale = kwargs.get('scale', 1)
            _fallback_map = {
                'bernoulli': lambda: _np.random.binomial(1, args[0] if args else kwargs.get('p', 0.5), size=_size),
                'binom': lambda: _np.random.binomial(args[0] if args else kwargs.get('n', 1), args[1] if len(args) > 1 else kwargs.get('p', 0.5), size=_size),
                'uniform': lambda: _np.random.uniform(_loc, _loc + _scale, size=_size),
                'norm': lambda: _np.random.normal(_loc, _scale, size=_size),
                'expon': lambda: _np.random.exponential(_scale, size=_size) + _loc,
                'poisson': lambda: _np.random.poisson(args[0] if args else kwargs.get('mu', 1), size=_size),
                'geom': lambda: _np.random.geometric(args[0] if args else kwargs.get('p', 0.5), size=_size),
                'randint': lambda: _np.random.randint(args[0] if args else kwargs.get('low', 0), args[1] if len(args) > 1 else kwargs.get('high', 2), size=_size),
            }
            if _name in _fallback_map:
                return _fallback_map[_name]()
            raise

    _scipy_stats.rv_generic.rvs = _patched_rvs
    print("✅ SciPy 相容性：.rvs() 安全墊片已啟動。")
except Exception:
    pass
`;

export const SCIPY_STUB = `
# Lightweight SciPy stub
try:
    import scipy
except Exception:
    import types, sys
    import numpy as np
    import math

    scipy = types.ModuleType('scipy')
    stats = types.ModuleType('scipy.stats')

    def _scalar_or_array(func):
        def wrapper(self, x, *args, **kwargs):
            try:
                # If x is numpy array or list
                if hasattr(x, '__iter__') and not isinstance(x, (str, bytes)):
                    x_arr = np.array(x)
                else:
                    x_arr = np.array([x])
                    
                if x_arr.size == 1:
                    return func(self, float(x_arr.item()), *args, **kwargs)
                return np.array([func(self, float(xi), *args, **kwargs) for xi in x_arr.flat]).reshape(x_arr.shape)
            except Exception:
                 # Fallback for weird types
                 return func(self, x, *args, **kwargs)
        return wrapper

    def norm(loc=0.0, scale=1.0):
        class N:
            name = 'norm'
            def rvs(self, size=None, **kwargs): return np.random.normal(loc, scale, size=size)
            @_scalar_or_array
            def pdf(self, x): return math.exp(-0.5*((x-loc)/scale)**2)/(scale*math.sqrt(2*math.pi))
            @_scalar_or_array
            def cdf(self, x): return 0.5*(1+math.erf((x-loc)/(scale*math.sqrt(2))))
            def ppf(self, q):
                def cdf_fn(x): return 0.5*(1+math.erf((x-loc)/(scale*math.sqrt(2))))
                def scalar_ppf(qi):
                    a, b = loc - 10*scale, loc + 10*scale
                    for _ in range(60):
                        m = 0.5*(a+b)
                        if cdf_fn(m) < qi: a = m
                        else: b = m
                    return 0.5*(a+b)
                if hasattr(q, '__iter__'): return np.array([scalar_ppf(float(qi)) for qi in q])
                return scalar_ppf(float(q))
            def stats(self, moments='mvsk'): return loc, scale**2, None, None
        return N()

    stats.norm = norm()
    scipy.stats = stats
    sys.modules['scipy'] = scipy
    sys.modules['scipy.stats'] = stats
    print('✅ SciPy stub installed.')
`;

export const QPSOLVERS_SHIM = `
# qpsolvers fallback shim for browser environments without native solver backends
try:
    import numpy as _np
    from scipy.optimize import minimize as _minimize, LinearConstraint as _LinearConstraint

    def _fallback_solve_qp(P, q, G=None, h=None, A=None, b=None, solver=None, **kwargs):
        Pm = _np.asarray(P, dtype=float)
        qv = _np.asarray(q, dtype=float).reshape(-1)
        n = int(qv.shape[0])

        def _obj(x):
            return 0.5 * float(x @ Pm @ x) + float(qv @ x)

        def _jac(x):
            return Pm @ x + qv

        constraints = []

        if A is not None and b is not None:
            Am = _np.atleast_2d(_np.asarray(A, dtype=float))
            bv = _np.asarray(b, dtype=float).reshape(-1)
            constraints.append(_LinearConstraint(Am, bv, bv))

        if G is not None and h is not None:
            Gm = _np.atleast_2d(_np.asarray(G, dtype=float))
            hv = _np.asarray(h, dtype=float).reshape(-1)
            constraints.append(_LinearConstraint(Gm, -_np.inf * _np.ones_like(hv), hv))

        x0 = _np.ones(n, dtype=float) / max(1, n)
        res = _minimize(_obj, x0, jac=_jac, method='SLSQP', constraints=constraints, options={'maxiter': 1000, 'ftol': 1e-9})

        if not res.success:
            res = _minimize(_obj, x0, method='SLSQP', constraints=constraints, options={'maxiter': 2000, 'ftol': 1e-8})

        return _np.asarray(res.x, dtype=float) if res.success else None

    try:
        import qpsolvers as _qps
        _orig_solve_qp = getattr(_qps, 'solve_qp', None)

        def _patched_solve_qp(P, q, G=None, h=None, A=None, b=None, solver=None, **kwargs):
            if _orig_solve_qp is not None and solver is not None:
                try:
                    return _orig_solve_qp(P, q, G, h, A, b, solver=solver, **kwargs)
                except Exception:
                    pass
            return _fallback_solve_qp(P, q, G, h, A, b, solver=solver, **kwargs)

        _qps.solve_qp = _patched_solve_qp
        print('✅ qpsolvers shim: solve_qp fallback enabled.')
    except Exception:
        import sys
        from types import ModuleType

        qps = ModuleType('qpsolvers')

        def solve_qp(P, q, G=None, h=None, A=None, b=None, solver=None, **kwargs):
            return _fallback_solve_qp(P, q, G, h, A, b, solver=solver, **kwargs)

        qps.solve_qp = solve_qp
        sys.modules['qpsolvers'] = qps
        print('✅ qpsolvers shim: lightweight module injected.')
except Exception as _e:
    print(f'⚠️ qpsolvers shim failed: {_e}')
`;

export const BASE_ENV_SETUP = `
import warnings
warnings.simplefilter("ignore", DeprecationWarning)
warnings.simplefilter("ignore", FutureWarning)
warnings.simplefilter("ignore", SyntaxWarning)
warnings.filterwarnings("ignore", message=".*pyarrow.*")

import numpy as np
if not hasattr(np, 'int'): np.int = int
if not hasattr(np, 'float'): np.float = float
if not hasattr(np, 'bool'): np.bool = bool

try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.rcParams['font.family'] = ['DejaVu Sans', 'sans-serif']
except Exception: pass

import builtins
import js
def custom_input(prompt=""):
    result = js.window.prompt(prompt)
    return result if result is not None else ""
builtins.input = custom_input

try:
    import numpy_financial as npf
    for func in ['irr', 'npv', 'pmt', 'pv', 'rate', 'nper', 'fv', 'ppmt', 'ipmt']:
        if not hasattr(np, func) and hasattr(npf, func): setattr(np, func, getattr(npf, func))
except ImportError: pass

import sys
from types import ModuleType

# 徹底解決 distutils 在 Python 3.12 缺失的問題
try:
    import distutils
    import distutils.version
except ImportError:
    d = ModuleType('distutils')
    dv = ModuleType('distutils.version')
    du = ModuleType('distutils.util')
    ds = ModuleType('distutils.spawn')
    
    # Stub LooseVersion for libraries like sklearn/statsmodels
    class LooseVersion:
        def __init__(self, vstring): self.v = vstring
        def __str__(self): return self.v
        def __repr__(self): return f"LooseVersion('{self.v}')"
        def __lt__(self, other): return False
        def __le__(self, other): return True
        def __gt__(self, other): return True
        def __ge__(self, other): return True
        def __eq__(self, other): return True
    
    dv.LooseVersion = LooseVersion
    d.version = dv
    d.util = du
    d.spawn = ds
    
    sys.modules['distutils'] = d
    sys.modules['distutils.version'] = dv
    sys.modules['distutils.util'] = du
    sys.modules['distutils.spawn'] = ds
    print("✅ distutils 相容性：已建立虛擬子模組與 LooseVersion 樁。")

try:
    import pyodide_http
    pyodide_http.patch_all()
except ImportError: pass

try:
    import scipy.stats
    if not hasattr(scipy.stats, 'binom_test') and hasattr(scipy.stats, 'binomtest'):
        scipy.stats.binom_test = lambda k, n=None, p=0.5, alt='two-sided': scipy.stats.binomtest(k, n, p, alt).pvalue
except ImportError: pass
except Exception:
    pass

# Provide a lightweight fallback for scipy.stats.binom when SciPy's binom is missing
try:
    import scipy
    import numpy as _np
    import math
    if hasattr(scipy, 'stats'):
        _ss = scipy.stats
        if not hasattr(_ss, 'binom'):
            class _BinomFactory:
                def __call__(self, n, p):
                    nn = int(n)
                    pp = float(p)
                    class Dist:
                        def __init__(self, nn, pp):
                            self.n = nn
                            self.p = pp
                        def pmf(self, k):
                            k_int = int(k)
                            try:
                                return math.comb(self.n, k_int) * (self.p ** k_int) * ((1 - self.p) ** (self.n - k_int))
                            except Exception:
                                # fallback for older Python without comb
                                from math import factorial
                                return factorial(self.n) // (factorial(k_int) * factorial(self.n - k_int)) * (self.p ** k_int) * ((1 - self.p) ** (self.n - k_int))
                        def rvs(self, size=None):
                            return _np.random.binomial(self.n, self.p, size=size)
                    return Dist(nn, pp)
            _ss.binom = _BinomFactory()
except Exception:
    pass

# Expand lightweight fallbacks for common discrete SciPy distributions
try:
    import scipy
    import numpy as _np
    import math
    if hasattr(scipy, 'stats'):
        _ss = scipy.stats

        def _comb(n, k):
            try:
                return math.comb(n, k)
            except Exception:
                from math import factorial
                return factorial(n) // (factorial(k) * factorial(n - k))

        # Bernoulli
        if not hasattr(_ss, 'bernoulli'):
            class _BernFactory:
                def __call__(self, p):
                    pp = float(p)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            return pp if ki == 1 else (1.0 - pp)
                        def rvs(self, size=None):
                            return _np.random.binomial(1, pp, size=size)
                    return Dist()
            _ss.bernoulli = _BernFactory()

        # Poisson
        if not hasattr(_ss, 'poisson'):
            class _PoisFactory:
                def __call__(self, mu):
                    mm = float(mu)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            return math.exp(-mm) * (mm ** ki) / math.factorial(ki)
                        def rvs(self, size=None):
                            return _np.random.poisson(mm, size=size)
                    return Dist()
            _ss.poisson = _PoisFactory()

        # Geometric (SciPy uses support 1,2,3...)
        if not hasattr(_ss, 'geom'):
            class _GeomFactory:
                def __call__(self, p):
                    pp = float(p)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            if ki < 1: return 0.0
                            return (1 - pp) ** (ki - 1) * pp
                        def rvs(self, size=None):
                            return _np.random.geometric(pp, size=size)
                    return Dist()
            _ss.geom = _GeomFactory()

        # RandInt (discrete uniform [low, high))
        if not hasattr(_ss, 'randint'):
            class _RandIntFactory:
                def __call__(self, low, high=None):
                    lo = int(low)
                    hi = int(high) if high is not None else lo
                    # numpy randint semantics: low (inclusive), high (exclusive)
                    def _pmf(k):
                        ki = int(k)
                        if hi <= lo:
                            return 0.0
                        return 1.0 / (hi - lo) if (lo <= ki < hi) else 0.0
                    class Dist:
                        def pmf(self, k): return _pmf(k)
                        def rvs(self, size=None): return _np.random.randint(lo, hi, size=size)
                    return Dist()
            _ss.randint = _RandIntFactory()

        # Hypergeometric (ngood, nbad, nsample)
        if not hasattr(_ss, 'hypergeom'):
            class _HyperFactory:
                def __call__(self, M, n, N):
                    M_i = int(M)
                    n_i = int(n)
                    N_i = int(N)
                    class Dist:
                        def pmf(self, k):
                            ki = int(k)
                            if ki < 0 or ki > n_i: return 0.0
                            # C(M, k) * C(M - k, N - k) / C(M, N) but use safe combinatorics
                            try:
                                num = _comb(n_i, ki) * _comb(M_i - n_i, N_i - ki)
                                den = _comb(M_i, N_i)
                                return num / den if den != 0 else 0.0
                            except Exception:
                                return 0.0
                        def rvs(self, size=None):
                            # Use numpy hypergeometric: numpy.hypergeometric(ngood, nbad, nsample)
                            return _np.random.hypergeometric(n_i, M_i - n_i, N_i, size=size)
                    return Dist()
            _ss.hypergeom = _HyperFactory()
except Exception:
    pass
`;

export const DATASET_SHIM = `
# Dataset path redirection: intercept hardcoded absolute paths and redirect to virtual /data directory
import os
import sys

def check_and_redirect(path):
    if not isinstance(path, str):
        return path
    
    # Debug: Print intercepted path
    # print(f"🔍 Checking path: {path}")

    # Robust check for Windows/Unix absolute paths
    is_absolute = False
    _bs = chr(92)  # backslash, avoids escaping issues in generated code
    # Windows drive path example: C:\\path or Unix style: /path
    if len(path) >= 3 and path[1] == ':' and (path[2] == _bs or path[2] == '/'): is_absolute = True
    if path.startswith('/'): is_absolute = True # Unix
    
    if is_absolute:
        filename = os.path.basename(path)
        # Search virtual /data directory recursively
        for root, dirs, files in os.walk('/data'):
            if filename in files:
                target = os.path.join(root, filename)
                print(f"📂 Dataset Redirect: Intercepted {path} -> Using virtual path {target}")
                return target
    return path

try:
    import pandas as pd
    _orig_read_csv = pd.read_csv
    _orig_read_excel = pd.read_excel
    def patched_read_csv(filepath_or_buffer, *args, **kwargs):
        return _orig_read_csv(check_and_redirect(filepath_or_buffer), *args, **kwargs)
    def patched_read_excel(io, *args, **kwargs):
        return _orig_read_excel(check_and_redirect(io), *args, **kwargs)
    pd.read_csv = patched_read_csv
    pd.read_excel = patched_read_excel
    print("✅ Dataset Redirect: Successfully hooked pandas read functions.")
except ImportError: pass
except Exception as e: print(f"⚠️ Dataset Redirect Patch Error: {str(e)}")
`;

export const MCINT_SHIM = `
# mcint (Monte Carlo Integration) stub for browser environments
import sys
from types import ModuleType

mcint = ModuleType('mcint')
sys.modules['mcint'] = mcint

def mcint_integrate(integrand, sampler, measure, n):
    total = 0.0
    total_sq = 0.0
    # Process in chunks to maintain UI responsiveness if needed, but for now simple loop
    for _ in range(n):
        point = next(sampler)
        val = integrand(point)
        total += val
        total_sq += val * val
    
    mean = total / n
    var = (total_sq / n) - (mean ** 2)
    result = mean * measure
    error = (max(0, var) ** 0.5) * measure / (n ** 0.5)
    return result, error

mcint.integrate = mcint_integrate
print("✅ mcint (Monte Carlo) shim installed.")
`;

export const ARCH_STUB = `
# arch (Autoregressive Conditional Heteroskedasticity) stub
import sys
from types import ModuleType
import numpy as np

arch = ModuleType('arch')
arch_univariate = ModuleType('arch.univariate')

class ConstantMean:
    def __init__(self, y=None, *args, **kwargs): 
        self.y = y if y is not None else np.array([])
        
    def fit(self, *args, **kwargs):
        y_in = self.y
        n = len(y_in)
        class FitRes:
            def __init__(self, n, y_in): 
                self.n = n
                # Preserve the original index (DatetimeIndex) if y is a pandas Series/DataFrame.
                idx = None
                try:
                    if hasattr(y_in, 'index'):
                        idx = y_in.index
                except Exception:
                    idx = None

                try:
                    import pandas as pd
                    if idx is None:
                        idx = pd.RangeIndex(start=0, stop=n, step=1)
                    self._conditional_volatility = pd.Series(np.zeros(n), index=idx, name='conditional_volatility')
                    self._resid = pd.Series(np.zeros(n), index=idx, name='resid')
                except Exception:
                    self._conditional_volatility = np.zeros(n)
                    self._resid = np.zeros(n)
                # arch.fit() returns an object with many numeric attributes (params/aic/bic/etc).
                # Provide safe defaults so book examples don't crash when casting/printing.
                try:
                    import pandas as pd
                    self.params = pd.Series([0.0], index=['mu'])
                except Exception:
                    self.params = np.array([0.0])

                self.aic = 0.0
                self.bic = 0.0
                self.loglikelihood = 0.0
                self.convergence_flag = 0

                def _summary():
                    return "ARCH Stub: 'arch' is not supported in the browser; returning dummy fit results."
                self.summary = _summary
            
            @property
            def conditional_volatility(self):
                return self._conditional_volatility
            
            @property
            def resid(self):
                return self._resid
                
            def plot(self, *args, **kwargs):
                print("ARCH Stub: Plot called.")
                return None
                
            def __getattr__(self, name):
                # Common numeric attributes used in examples
                if name in ('nobs', 'num_params', 'scale'):
                    return 0.0
                if name in ('tvalues', 'pvalues', 'std_err'):
                    try:
                        import pandas as pd
                        return pd.Series([0.0], index=['mu'])
                    except Exception:
                        return np.array([0.0])
                return lambda *args, **kwargs: None
                
        return FitRes(n, y_in)

arch_univariate.ConstantMean = ConstantMean
arch_univariate.arch_model = lambda y, *args, **kwargs: ConstantMean(y)
arch.arch_model = arch_univariate.arch_model

sys.modules['arch'] = arch
sys.modules['arch.univariate'] = arch_univariate
print("✅ arch stub installed (browser fallback) with dummy data support.")
`;

export const MIBIAN_STUB = `
# mibian (Options Pricing) stub with Black-Scholes pricing
import sys
import math
from types import ModuleType

mibian = ModuleType('mibian')

def _norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def _norm_pdf(x):
    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)

class BS:
    """Black-Scholes pricing: BS([S, K, r, T], volatility=sigma) or BS([S, K, r, T], callPrice=c)"""
    def __init__(self, params=None, volatility=None, callPrice=None, putPrice=None, *args, **kwargs):
        if params is None:
            params = args[0] if args else [100, 100, 5, 30]
        S = float(params[0])
        K = float(params[1])
        r = float(params[2]) / 100.0  # mibian uses % for rate
        T = float(params[3]) / 365.0  # mibian uses days

        if volatility is not None:
            sigma = float(volatility) / 100.0  # mibian uses %
            sqrtT = math.sqrt(max(T, 1e-10))
            d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrtT)
            d2 = d1 - sigma * sqrtT
            self.callPrice = S * _norm_cdf(d1) - K * math.exp(-r * T) * _norm_cdf(d2)
            self.putPrice = K * math.exp(-r * T) * _norm_cdf(-d2) - S * _norm_cdf(-d1)
            self.callDelta = _norm_cdf(d1)
            self.putDelta = self.callDelta - 1.0
            self.callGamma = self.putGamma = _norm_pdf(d1) / (S * sigma * sqrtT)
            self.vega = S * _norm_pdf(d1) * sqrtT / 100.0
            self.callTheta = (-(S * _norm_pdf(d1) * sigma) / (2 * sqrtT) - r * K * math.exp(-r * T) * _norm_cdf(d2)) / 365.0
            self.putTheta = (-(S * _norm_pdf(d1) * sigma) / (2 * sqrtT) + r * K * math.exp(-r * T) * _norm_cdf(-d2)) / 365.0
            self.callRho = K * T * math.exp(-r * T) * _norm_cdf(d2) / 100.0
            self.putRho = -K * T * math.exp(-r * T) * _norm_cdf(-d2) / 100.0
            self.impliedVolatility = sigma * 100.0
        elif callPrice is not None or putPrice is not None:
            target = float(callPrice) if callPrice is not None else float(putPrice)
            is_call = callPrice is not None
            # Newton's method for implied vol
            sigma = 0.3
            for _ in range(100):
                sqrtT = math.sqrt(max(T, 1e-10))
                d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrtT)
                d2 = d1 - sigma * sqrtT
                if is_call:
                    price = S * _norm_cdf(d1) - K * math.exp(-r * T) * _norm_cdf(d2)
                else:
                    price = K * math.exp(-r * T) * _norm_cdf(-d2) - S * _norm_cdf(-d1)
                vega = S * _norm_pdf(d1) * sqrtT
                if abs(vega) < 1e-12: break
                sigma = sigma - (price - target) / vega
                if sigma <= 0: sigma = 0.001
                if abs(price - target) < 1e-8: break
            self.impliedVolatility = sigma * 100.0
            # Fill Greeks at solved vol
            sqrtT = math.sqrt(max(T, 1e-10))
            d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * sqrtT)
            d2 = d1 - sigma * sqrtT
            self.callPrice = S * _norm_cdf(d1) - K * math.exp(-r * T) * _norm_cdf(d2)
            self.putPrice = K * math.exp(-r * T) * _norm_cdf(-d2) - S * _norm_cdf(-d1)
            self.callDelta = _norm_cdf(d1)
            self.putDelta = self.callDelta - 1.0
            self.callGamma = self.putGamma = _norm_pdf(d1) / (S * sigma * sqrtT)
            self.vega = S * _norm_pdf(d1) * sqrtT / 100.0
            self.callTheta = 0.0
            self.putTheta = 0.0
            self.callRho = 0.0
            self.putRho = 0.0
        else:
            self.callPrice = self.putPrice = 0.0
            self.callDelta = self.putDelta = 0.0
            self.callTheta = self.putTheta = 0.0
            self.callGamma = self.putGamma = 0.0
            self.vega = 0.0
            self.impliedVolatility = 0.0
            self.callRho = self.putRho = 0.0

mibian.BS = BS
mibian.Me = BS
mibian.GK = BS

sys.modules['mibian'] = mibian
print("✅ mibian Black-Scholes stub installed (browser fallback).")
`;
