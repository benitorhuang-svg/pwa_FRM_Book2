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
            if other.units == "Months":
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

    def __str__(self): return self.dt.strftime('%B %d, %Y')
    def __repr__(self): return self.__str__()
    def date(self): return self

ql.Date = QLDate

class QLPeriod:
    def __init__(self, value, units=None):
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
    print(f"📡 模擬數據引擎：由於瀏覽器 CORS 限制，正在為 {name} 產生模擬股價數據...")
    
    start_date = pd.to_datetime(start or '2020-01-01')
    end_date = pd.to_datetime(end or '2020-12-31')
    dates = pd.date_range(start_date, end_date)
    
    tickers = [name] if isinstance(name, str) else name
    data = {}
    for ticker in tickers:
        stock_map = {
            'goog': 1500, 'amzn': 2000, 'fb': 200, 'nflx': 300, 
            'gld': 150, 'ge': 80, 'nke': 100, 'ford': 10, 'dis': 180, 'aapl': 150, 'tsla': 700
        }
        base_price = stock_map.get(ticker.lower(), 100)
        returns = np.random.normal(0.0005, 0.02, len(dates))
        price = base_price * np.exp(np.cumsum(returns))
        data[ticker] = price
    # Logic dispatch based on data source
    if data_source == 'fred':
        # FRED returns columns named after the series ID (ticker)
        return pd.DataFrame(data, index=dates)
    
    # Default (Yahoo-like): returns Adj Close, High, Low, etc. (Simulated as just Adj Close here)
    if len(tickers) > 1:
        df = pd.DataFrame(data, index=dates)
        df.columns = pd.MultiIndex.from_product([['Adj Close'], tickers])
        return df
    else:
        # Fix: Use tickers[0] to avoid "unhashable type: list" if name was a list
        target_ticker = tickers[0]
        df = pd.DataFrame({'Adj Close': data[target_ticker]}, index=dates)
        return df

try:
    import sys
    import pandas_datareader
    import pandas_datareader.data as pdr_data
    methods = ['DataReader', 'get_data_yahoo', 'get_data_stooq', 'get_data_fred']
    for method in methods:
        setattr(pdr_data, method, simulated_data_reader)
        setattr(pandas_datareader, method, simulated_data_reader)
    sys.modules['pandas_datareader.data'].DataReader = simulated_data_reader
    sys.modules['pandas_datareader'].DataReader = simulated_data_reader
    for method in methods:
        setattr(sys.modules['pandas_datareader.data'], method, simulated_data_reader)
        setattr(sys.modules['pandas_datareader'], method, simulated_data_reader)
    print("✅ 模擬數據引擎：攔截器已成功啟動。")
except ImportError:
    pass
except Exception as e:
    print(f"⚠️ 模擬數據引擎啟動失敗: {str(e)}")
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
        def wrapper(x, *args, **kwargs):
            x_arr = np.array(x)
            if x_arr.shape == (): return func(float(x), *args, **kwargs)
            return np.array([func(float(xi), *args, **kwargs) for xi in x_arr])
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
`;

export const DATASET_SHIM = `
# Dataset path redirection: intercept hardcoded absolute paths and redirect to virtual /data directory
import os
import sys

def check_and_redirect(path):
    if not isinstance(path, str):
        return path
    # If path looks like Windows or Unix absolute path
    if (':' in path and '\\\\' in path) or path.startswith('/'):
        filename = os.path.basename(path)
        # Search virtual /data directory
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
