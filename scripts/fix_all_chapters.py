#!/usr/bin/env python3
"""
Comprehensive fix script for all chapter JSON files.
Restores truncated Ch4 examples, adds missing Ch12 examples,
creates missing datasets, and adapts all file paths for web execution.
"""
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "public", "data")
CHAPTERS_DIR = DATA_DIR
DATASETS_DIR = os.path.join(DATA_DIR, "datasets")

# ─── Helper ──────────────────────────────────────────────────────────────────
def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✅ Saved {os.path.basename(path)}")

# ─── Ch4 full source code (replacing truncated '...' examples) ────────────────
CH4_FULL_CODE = {}

CH4_FULL_CODE["B2_Ch4_1.py"] = r"""# B2_Ch4_1.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

import numpy as np
import matplotlib.pyplot as plt
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# define functions for data point generation
def fun1(x):
    return -2*x+3

def fun2(x):
    return 2*x+1

def fun3(x):
    return np.sin(1.5 * np.pi * x)

def fun4(x):
    return np.cos(2.1 * np.pi * (x-1.))+np.cos(3 * np.pi * x)


np.random.seed(6)

num_sample = 30

X = np.sort(np.random.rand(num_sample))

rows = 2
cols = 2
fig, axs = plt.subplots(rows, cols, figsize=(14,8))

# fig1
y1 = fun1(X) + np.random.randn(num_sample) * 0.1
polynomial_features = PolynomialFeatures(degree=1, include_bias=False)
linear_regression = LinearRegression()
pipeline = Pipeline([("polynomial_features", polynomial_features),
                     ("linear_regression", linear_regression)])
pipeline.fit(X[:, np.newaxis], y1)

X_test = np.linspace(0, 1, 1000)
axs[0, 0].plot(X_test, pipeline.predict(X_test[:, np.newaxis]), color='red', label="Fitting model")
axs[0, 0].scatter(X, y1)
axs[0, 0].set_yticks([1.0, 1.5, 2.0, 2.5, 3.0])
axs[0, 0].set_title('(a)', loc='left')

# fig2
y2 = fun2(X) + np.random.randn(num_sample) * 0.1
polynomial_features = PolynomialFeatures(degree=1, include_bias=False)
linear_regression = LinearRegression()
pipeline = Pipeline([("polynomial_features", polynomial_features),
                     ("linear_regression", linear_regression)])
pipeline.fit(X[:, np.newaxis], y2)

X_test = np.linspace(0, 1, 1000)
axs[0, 1].plot(X_test, pipeline.predict(X_test[:, np.newaxis]), color='red', label="Fitting model")
axs[0, 1].scatter(X, y2)
axs[0, 1].set_yticks([1.0, 1.5, 2.0, 2.5, 3.0])
axs[0, 1].set_title('(b)', loc='left')

# fig3
y3 = fun3(X) + np.random.randn(num_sample) * 0.1
polynomial_features = PolynomialFeatures(degree=5, include_bias=False)
linear_regression = LinearRegression()
pipeline = Pipeline([("polynomial_features", polynomial_features),
                     ("linear_regression", linear_regression)])
pipeline.fit(X[:, np.newaxis], y3)

X_test = np.linspace(0, 1, 1000)
axs[1, 0].plot(X_test, pipeline.predict(X_test[:, np.newaxis]), color='red', label="Fitting model")
axs[1, 0].scatter(X, y3)
axs[1, 0].set_title('(c)', loc='left')

# fig4
y4 = fun4(X) + np.random.randn(num_sample) * 0.1
polynomial_features = PolynomialFeatures(degree=8, include_bias=False)
linear_regression = LinearRegression()
pipeline = Pipeline([("polynomial_features", polynomial_features),
                     ("linear_regression", linear_regression)])
pipeline.fit(X[:, np.newaxis], y4)

X_test = np.linspace(0, 1, 1000)
axs[1, 1].plot(X_test, pipeline.predict(X_test[:, np.newaxis]), color='red', label="Fitting model")
axs[1, 1].scatter(X, y4)
axs[1, 1].set_yticks([-1.0, 0.0, 1.0, 2.0])
axs[1, 1].set_title('(d)', loc='left')"""

CH4_FULL_CODE["B2_Ch4_2.py"] = r"""# B2_Ch4_2.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

import numpy as np
import matplotlib.pyplot as plt
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

def original_fun(X):
    return np.sin(1.5 * np.pi * X)

np.random.seed(6)

num_sample = 30
degrees = [1, 5, 15]
titles = ['(a) Underfitting', '(b) Optimalfitting', '(c) Overfitting']
X = np.sort(np.random.rand(num_sample))
y = original_fun(X) + np.random.randn(num_sample) * 0.1

rows = 1
cols = 3
fig, axs = plt.subplots(rows, cols, figsize=(14,5))

for i in range(len(degrees)):
    polynomial_features = PolynomialFeatures(degree=degrees[i],
                                             include_bias=False)
    linear_regression = LinearRegression()
    pipeline = Pipeline([("polynomial_features", polynomial_features),
                         ("linear_regression", linear_regression)])
    pipeline.fit(X[:, np.newaxis], y)

    X_test = np.linspace(0, 1, 100)
    axs[i].plot(X_test, pipeline.predict(X_test[:, np.newaxis]), color='red', label="Fitting model")
    axs[i].plot(X_test, original_fun(X_test), color='lightblue', label="Original function")
    axs[i].scatter(X, y, s=20, label="Samples")
    axs[i].set_xlim(0, 1)
    axs[i].set_ylim(-2, 2)
    axs[i].set_xticks([0.0, 0.5, 1.0])
    axs[i].set_yticks([-2, -1, 0, 1, 2])
    axs[i].legend(loc="best")
    axs[i].set_title(titles[i], loc='left')"""

CH4_FULL_CODE["B2_Ch4_4.py"] = r"""# B2_Ch4_4.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

# B2_Ch4_4_A.py
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import numpy as np
import matplotlib as mpl
from mpl_toolkits.mplot3d import Axes3D
from sklearn.metrics import mean_squared_error, r2_score


# B2_Ch4_4_B.py
# read data
df = pd.read_csv('/data/datasets/b2_ch4/MultiLrRegrData.csv')
df.head()


# B2_Ch4_4_C.py
# plot stock index price vs interest rate and unemployment rate
mpl.style.use('ggplot')
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6), sharey=True)
ax1.scatter(df['InterestRate'], df['StockIndexPrice'], color='red')
ax1.set_title('(a) Stock index price VS interest rate', loc='left', fontsize=14)
ax1.set_xlabel('Interest rate', fontsize=14)
ax1.set_ylabel('Stock index price', fontsize=14)
ax1.set_yticks([700, 900, 1100, 1300, 1500])
ax1.grid(True)

ax2.scatter(df['UnemploymentRate'], df['StockIndexPrice'], color='green')
ax2.set_title('(b) Stock index price VS unemployment rate', loc='left', fontsize=14)
ax2.set_xlabel('Unemployment rate', fontsize=14)
ax2.set_ylabel('Stock index price', fontsize=14)
ax2.grid(True)


# B2_Ch4_4_D.py
# implement linear regression model
x = df[['InterestRate','UnemploymentRate']]
y = df['StockIndexPrice']
MultiLrModel = LinearRegression()
MultiLrModel.fit(x, y)

# plot multiple regression model
fig = plt.figure()
ax = plt.axes(projection='3d')
zdata = df['StockIndexPrice']
xdata = df['InterestRate']
ydata = df['UnemploymentRate']
ax.scatter(xdata, ydata, zdata, c=zdata)
x3d, y3d = np.meshgrid(xdata, ydata)
z3d_pred = MultiLrModel.intercept_+MultiLrModel.coef_[0]*x3d+MultiLrModel.coef_[1]*y3d
ax.plot_surface(x3d, y3d, z3d_pred, color = 'grey', rstride = 100, cstride = 100, alpha=0.3)
ax.set_title('Multiple Linear Regression', fontsize=14)
ax.set_xlabel('Interest rate')
ax.set_ylabel('Unemployment rate')
ax.set_zlabel('Stock index price')


# B2_Ch4_4_E.py
zdata_pred = MultiLrModel.intercept_+MultiLrModel.coef_[0]*xdata+MultiLrModel.coef_[1]*ydata
rmse = (np.sqrt(mean_squared_error(zdata, zdata_pred)))
r2 = r2_score(zdata, zdata_pred)
print('RMSE of this polynomial regression model: %.2f' % rmse)
print('R square of this polynomial regression model: %.2f' % r2)"""

CH4_FULL_CODE["B2_Ch4_6.py"] = r"""# B2_Ch4_6.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

# B2_Ch4_6_A.py
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import seaborn as sns
from sklearn.metrics import confusion_matrix


# B2_Ch4_6_B.py
bankdata = pd.read_csv('/data/datasets/b2_ch4/BankTeleCompaign.csv')
bankdata = bankdata.dropna()
bankdata.head()

# B2_Ch4_6_C.py
# plot related item/column
sns.set(palette="pastel")
fig, ax = plt.subplots(3, 2, figsize=(6, 8))
sns.countplot(y="job",  data=bankdata, ax=ax[0, 0])
sns.countplot(x="marital", data=bankdata, ax=ax[0, 1])
sns.countplot(x="default", data=bankdata, ax=ax[1, 0])
sns.countplot(x="housing", data=bankdata, ax=ax[1, 1])
sns.countplot(x="loan", data=bankdata, ax=ax[2, 0])
sns.countplot(x="poutcome", data=bankdata, ax=ax[2, 1])
plt.tight_layout()

# B2_Ch4_6_D.py
# create dummy variables with only two values: 0 or 1
data = pd.get_dummies(bankdata, columns =['job', 'marital', 'default', 'housing', 'loan', 'poutcome'])
# drop unknown columns
data.drop([col for col in data.columns if 'unknow' in col], axis=1, inplace=True)
# plot correlation heatmap
sns.heatmap(data.corr(), square=True, cmap="YlGnBu", linewidths=.01, linecolor='lightgrey', cbar_kws={"orientation": "horizontal", "shrink": 0.3, "pad": 0.25})

# B2_Ch4_6_E.py
# split data into training and test sets
X = data.iloc[:,1:]
y = data.iloc[:,0]
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)
# implement logistic regression model
modelclassifier = LogisticRegression(random_state=0)
modelclassifier.fit(X_train, y_train)


# B2_Ch4_6_F.py
# evaluate model via confusion matrix
y_pred = modelclassifier.predict(X_test)
confusion_matrix = confusion_matrix(y_test, y_pred)
print(confusion_matrix)


# B2_Ch4_6_G.py
# evaluate model by accuracy
model_score = modelclassifier.score(X_test, y_test)
print('Model accuracy on test set: {:.2f}'.format(model_score))"""

CH4_FULL_CODE["B2_Ch4_7.py"] = r"""# B2_Ch4_7.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

# B2_Ch4_7_A.py
# importing libraries
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib as mpl
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score

# B2_Ch4_7_B.py
data = pd.read_csv('/data/datasets/b2_ch4/PolyRegrData.csv')

# plot data
mpl.style.use('ggplot')
plt.figure(figsize=(14,8))
plt.scatter(data.iloc[:,0].values,data.iloc[:,1].values, c='#1f77b4')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Raw Data')


# B2_Ch4_7_C.py
# preprocess input data
x = data.iloc[:,0].values.reshape(-1, 1)
y = data.iloc[:,1].values.reshape(-1, 1)
polynomial_features= PolynomialFeatures(degree=3)
x_poly = polynomial_features.fit_transform(x)
# create and then fit model
LRmodel = LinearRegression()
LRmodel.fit(x_poly,y)
print('intercept:', LRmodel.intercept_)
print('slope:', LRmodel.coef_)

# plot
plt.plot(x,y,'o',c='#1f77b4')
y_poly_pred = LRmodel.predict(x_poly)
plt.plot(x,y_poly_pred,'red')
plt.legend(['Raw Data',
            'y=%5.2f+%5.2f*x+%5.2f*x²+%5.2f*x³' % (LRmodel.intercept_, LRmodel.coef_[0][1],LRmodel.coef_[0][2],LRmodel.coef_[0][3])
            ], prop={'size': 8})
plt.title('Polynomial Regression Model')


# B2_Ch4_7_D.py
# evaluate model
rmse = np.sqrt(mean_squared_error(y,y_poly_pred))
r2 = r2_score(y,y_poly_pred)
print('RMSE of this polynomial regression model: %.2f' % rmse)
print('R square of this polynomial regression model: %.2f' % r2)"""

CH4_FULL_CODE["B2_Ch4_8.py"] = r"""# B2_Ch4_8.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

import pandas as pd
from scipy import stats
import matplotlib.pyplot as plt

df = pd.read_csv('/data/datasets/b2_ch4/outliersimpact.csv')

X = df.x
y = df.y

plt.plot(X, y, 'bo')

slope1, intercept1, r_value1, p_value1, std_err1 = stats.linregress(X, y)
rline1 = intercept1 + slope1*X

plt.plot(X, rline1,'r-', label='Fitting with outliers')

plt.annotate('Fitting with outliers', xy=(0.6, intercept1 + slope1*0.6), xytext=(0.6, 1.2),
              arrowprops=dict(arrowstyle="-|>",
                             connectionstyle="arc3",
                             mutation_scale=20,
                             fc="w"))

plt.annotate('outliers', xy=(0.802171, 0.5), xytext=(0.75, 0.6))
plt.annotate('', xy=(0.89286, 0.6), xytext=(0.75, 0.6))

# eliminate two outliers
df_nooutliers = df[(df['y']!=0.5) & (df['y']!=0.6)]

X = df_nooutliers.x
y = df_nooutliers.y

slope2, intercept2, r_value2, p_value2, std_err2 = stats.linregress(X, y)
rline2 = intercept2 + slope2*X
plt.plot(X, rline2,'r--', label='Fitting without outliers')

plt.annotate('Fitting without outliers', xy=(0.7, intercept2 + slope2*0.7), xytext=(0.4, 2.2),
              arrowprops=dict(arrowstyle="-|>",
                             connectionstyle="arc3",
                             mutation_scale=20,
                             fc="w"))

plt.title('Impact on linear regression by outliers')
plt.gca().set_yticks([0.5, 1.0, 1.5, 2.0, 2.5])

plt.gca().spines['right'].set_visible(False)
plt.gca().spines['top'].set_visible(False)
plt.gca().yaxis.set_ticks_position('left')
plt.gca().xaxis.set_ticks_position('bottom')"""

# Ch4_9: Fix normalize=True deprecation → use Pipeline with StandardScaler
CH4_FULL_CODE["B2_Ch4_9.py"] = r"""# B2_Ch4_9.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

# B2_Ch4_9_A.py
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline


# B2_Ch4_9_B.py
# extract and plot raw data
data = pd.read_csv('/data/datasets/b2_ch4/RidgeRegrData.csv')
plt.plot(data['x'], data['y'], 'o')
plt.title('Raw Data')
plt.xlabel('x')
plt.ylabel('y')
plt.gca().spines['right'].set_visible(False)
plt.gca().spines['top'].set_visible(False)
plt.gca().yaxis.set_ticks_position('left')
plt.gca().xaxis.set_ticks_position('bottom')


# B2_Ch4_9_C.py
# prepare data with powers up to 15
for i in range(2,16):
    colname = 'x_%d'%i
    data[colname] = data['x']**i
print(data.head())


# B2_Ch4_9_D.py
# create ridge regression fit and plot function
def ridge_regression_fit_plot(data, predictors, alpha, alpha_subplotpos):
    # fit ridge regression model (use Pipeline with StandardScaler instead of deprecated normalize=True)
    ridgeregrmodel = make_pipeline(StandardScaler(), Ridge(alpha=alpha))
    ridgeregrmodel.fit(data[predictors], data['y'])
    y_pred = ridgeregrmodel.predict(data[predictors])

    # plot for model with predefined alpha
    if alpha in alpha_subplotpos:
        plt.subplot(alpha_subplotpos[alpha])
        plt.tight_layout()
        plt.plot(data['x'], data['y'],'.')
        plt.plot(data['x'], y_pred, 'g-')
        plt.title('Ridge Regression:  $\\alpha$=%.3g'%alpha)

    # return results
    rss = sum((y_pred-data['y'])**2)
    ret = [rss]
    ret.extend([ridgeregrmodel[-1].intercept_])
    ret.extend(ridgeregrmodel[-1].coef_)
    return ret


# B2_Ch4_9_E.py
# initialize predictors to be set of 15 powers of x
predictors=['x']
predictors.extend(['x_%d'%i for i in range(2,16)])
# set list of alpha values
alpha_list = [1e-20, 1e-10, 1e-5, 1e-3, 1e-2, 1e-1, 1, 2, 3, 5, 10, 20]
# store coefficients
col = ['rss','intercept'] + ['coef_x_%d'%i for i in range(1,16)]
ind = ['alpha_%.2g' % alpha_list[i] for i in range(0,len(alpha_list))]
coef_matrix_ridge = pd.DataFrame(index=ind, columns=col)
# alpha:subplot position
alpha_subplotpos = {1e-20:241, 1e-10:242, 1e-3:243, 1e-2:244, 1e-1:245, 1:246, 5:247, 20:248}
for i in range(len(alpha_list)):
    coef_matrix_ridge.iloc[i,] = ridge_regression_fit_plot(data, predictors, alpha_list[i], alpha_subplotpos)



# B2_Ch4_9_F.py
# show parameter matrix
pd.options.display.float_format = '{:,.2g}'.format
print(coef_matrix_ridge)

# B2_Ch4_9_G.py
# plot rss of models
plt.figure()
plt.plot(coef_matrix_ridge['rss'], 'o')
plt.title('RSS Trend')
plt.xlabel(r'$\alpha$')
plt.xticks(rotation=30)
plt.ylabel('RSS')
plt.gca().spines['right'].set_visible(False)
plt.gca().spines['top'].set_visible(False)
plt.gca().yaxis.set_ticks_position('left')
plt.gca().xaxis.set_ticks_position('bottom')


# B2_Ch4_9_H.py
print(coef_matrix_ridge.apply(lambda x: sum(x.values==0),axis=1))"""

# Ch4_10: Fix normalize=True deprecation → use Pipeline with StandardScaler
CH4_FULL_CODE["B2_Ch4_10.py"] = r"""# B2_Ch4_10.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

# B2_Ch4_10_A.py
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# create lasso regression fit and plot function
def lasso_regression_fit_plot(data, predictors, alpha, alpha_subplotpos):
    # fit lasso regression model (use Pipeline with StandardScaler instead of deprecated normalize=True)
    lassoregrmodel = make_pipeline(StandardScaler(), Lasso(alpha=alpha, tol=0.1, max_iter=10000))
    lassoregrmodel.fit(data[predictors], data['y'])
    y_pred = lassoregrmodel.predict(data[predictors])

    # plot for model with predefined alpha
    if alpha in alpha_subplotpos:
        plt.subplot(alpha_subplotpos[alpha])
        plt.plot(data['x'], data['y'],'.')
        plt.plot(data['x'], y_pred, 'r')
        plt.title('$\\alpha$=%.3g'%alpha)
    plt.yticks([-1.0, -0.5, 0, 0.5, 1.0])

    # return results
    rss = sum((y_pred-data['y'])**2)
    ret = [rss]
    ret.extend([lassoregrmodel[-1].intercept_])
    ret.extend(lassoregrmodel[-1].coef_)
    return ret


# B2_Ch4_10_B.py
# extract raw data
data = pd.read_csv('/data/datasets/b2_ch4/RidgeRegrData.csv')

# prepare data with powers up to 15
for i in range(2,16):
    colname = 'x_%d'%i
    data[colname] = data['x']**i

# initialize predictors to be set of 15 powers of x
predictors=['x']
predictors.extend(['x_%d'%i for i in range(2,16)])

# set list of alpha values
alpha_list = [1e-20, 1e-10, 1e-5, 1e-3, 1e-2, 1e-1, 1, 2, 3, 5, 10, 20]

# store coefficients
col = ['rss','intercept'] + ['coef_x_%d'%i for i in range(1,16)]
ind = ['alpha_%.2g'%alpha_list[i] for i in range(0,len(alpha_list))]
coef_matrix_lasso = pd.DataFrame(index=ind, columns=col)

# alpha:subplot position
alpha_subplotpos = {1e-20:231, 1e-10:232, 1e-5:233, 1e-3:234, 1e-2:235, 1e-1:236}
for i in range(len(alpha_list)):
    coef_matrix_lasso.iloc[i,] = lasso_regression_fit_plot(data, predictors, alpha_list[i], alpha_subplotpos)


# B2_Ch4_10_C.py
# show parameter matrix
pd.options.display.float_format = '{:,.2g}'.format
print(coef_matrix_lasso)


# B2_Ch4_10_D.py
# plot rss of models
plt.figure()
plt.plot(coef_matrix_lasso['rss'], 'o')
plt.title('RSS Trend')
plt.xlabel(r'$\alpha$')
plt.xticks(rotation=30)
plt.ylabel('RSS')
plt.gca().spines['right'].set_visible(False)
plt.gca().spines['top'].set_visible(False)
plt.gca().yaxis.set_ticks_position('left')
plt.gca().xaxis.set_ticks_position('bottom')


# B2_Ch4_10_E.py
print(coef_matrix_lasso.apply(lambda x: sum(x.values==0),axis=1))"""

# ─── Ch12 missing examples ───────────────────────────────────────────────────
CH12_EX2 = {
    "id": "ex2",
    "title": "12.2 QP 求解器：效率前緣與 CAL 線",
    "filename": "B2_Ch12_2.py",
    "code": r"""# B2_Ch12_2.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

from numpy import array, sqrt, dot, linspace, append, zeros_like, ones_like
from pandas import read_excel, DataFrame
from qpsolvers import solve_qp
import matplotlib.pyplot as plt

#%% Read data from excel
data = read_excel('/data/datasets/b2_ch12/Data_portfolio_1.xlsx')

#%% Return Vector, Volatility Vector, Variance-Covariance Matrix, Correlation Matrix
Singlename_Mean = DataFrame.mean(data)*12
Singlename_Vol = DataFrame.std(data)*sqrt(12)
CorrelationMatrix = DataFrame.corr(data)
CovarianceMatrix = DataFrame.cov(data)*12

#%% Define Risk Free asset
RF = 0.02

#%% Scatter plot
tickers = Singlename_Mean.index.tolist()

fig,ax=plt.subplots()
ax.scatter(Singlename_Vol,Singlename_Mean,color="blue")
ax.scatter(0,RF,color="red")

for x_pos, y_pos, label in zip(Singlename_Vol, Singlename_Mean, tickers):
    ax.annotate(label,
                xy=(x_pos, y_pos),
                xytext=(7, 0),
                textcoords='offset points',
                ha='left',
                va='center')

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')


#%% GMVP portfolio
Weight_GMVP=solve_qp(
    CovarianceMatrix.to_numpy(),
    zeros_like(Singlename_Mean),
    None,None,
    ones_like(Singlename_Mean),
    array([1.]))

Port_Vol_GMVP = sqrt(dot(dot(Weight_GMVP,CovarianceMatrix.to_numpy()),Weight_GMVP))
Port_Return_GMVP = dot(Weight_GMVP,Singlename_Mean.to_numpy())

#%% bar chart GMVP weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_GMVP)
ax.set(xlabel='GMVP Weight Allocation',ylabel='Names')

#%% MVP portfolio, fixed return
Port_Return = 0.30
Weight_MVP=solve_qp(
    CovarianceMatrix.to_numpy(),
    zeros_like(Singlename_Mean),
    None,None,
    array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
    array([1.,Port_Return]).reshape(2,))

fig,ax=plt.subplots()
tickers = Singlename_Mean.index.tolist()
ax.barh(tickers,Weight_MVP)
ax.set(xlabel='Weight',ylabel='Names')


#%% Efficient Frontier
EF_vol = array([])
Rp_range =  linspace(Port_Return_GMVP,0.3, num=25)

for Rp in Rp_range:
    Weight_MVP=solve_qp(
        CovarianceMatrix.to_numpy(),
        zeros_like(Singlename_Mean),
        None,None,
        array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
        array([1.,Rp]).reshape(2,))
    Port_vol = sqrt(dot(dot(Weight_MVP,CovarianceMatrix.to_numpy()),Weight_MVP))
    EF_vol = append(EF_vol,array(Port_vol))

# In-efficient
InEF_vol = array([])
Rp_range_inEF =  linspace(0.0,Port_Return_GMVP, num=10)

for Rp in Rp_range_inEF:
    Weight_MVP=solve_qp(
        CovarianceMatrix.to_numpy(),
        zeros_like(Singlename_Mean),
        None,None,
        array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
        array([1.,Rp]).reshape(2,))
    Port_vol = sqrt(dot(dot(Weight_MVP,CovarianceMatrix.to_numpy()),Weight_MVP))
    InEF_vol = append(InEF_vol,array(Port_vol))

# Hyperbola curve
Hcurve_vol = array([])
Rp_range_Hcurve =  linspace(0.001,0.3, num=100)

for Rp in Rp_range_Hcurve:
    Weight_MVP=solve_qp(
        CovarianceMatrix.to_numpy(),
        zeros_like(Singlename_Mean),
        None,None,
        array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
        array([1.,Rp]).reshape(2,))
    Port_vol = sqrt(dot(dot(Weight_MVP,CovarianceMatrix.to_numpy()),Weight_MVP))
    Hcurve_vol = append(Hcurve_vol,array(Port_vol))

#%% Optimal Risky portfolio
Er_initial = 0.15
Solution=solve_qp(
    CovarianceMatrix.to_numpy(),
    zeros_like(Singlename_Mean),
    None,None,
    array([Singlename_Mean.to_numpy()-RF]),
    array([Er_initial-RF]))

Weight_ORP = Solution/sum(Solution)

Port_Vol_ORP = sqrt(dot(dot(Weight_ORP,CovarianceMatrix.to_numpy()),Weight_ORP))
Port_Return_ORP = dot(Weight_ORP,Singlename_Mean.to_numpy())

SR = (Port_Return_ORP-RF)/Port_Vol_ORP

#%% bar chart ORP weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_ORP)
ax.set(xlabel='Optimal Risk Portfolio Weight Allocation',ylabel='Names')


#%% Capital Market Line
vol_range = linspace(0,0.35,100)
CML = RF + SR*vol_range

#%% plot Efficient Frontier portfolios
fig,ax=plt.subplots()
ax.plot(Hcurve_vol,Rp_range_Hcurve)
ax.scatter(Port_Vol_GMVP,Port_Return_GMVP, marker='x')
ax.scatter(0,RF,color="red")
ax.scatter(Port_Vol_ORP,Port_Return_ORP, marker='D',color="red")
ax.plot(vol_range,CML)
ax.scatter(Singlename_Vol,Singlename_Mean,color="blue")

for x_pos, y_pos, label in zip(Singlename_Vol, Singlename_Mean, tickers):
    ax.annotate(label,
                xy=(x_pos, y_pos),
                xytext=(7, 0),
                textcoords='offset points',
                ha='left',
                va='center')

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')


#%% Optimal Indifference Utility Curve 1
A1 = 3
U_max_1 = RF + SR**2/(2*A1)
Weight_P_1 = SR/(A1*Port_Vol_ORP)

R1 = 1/2*A1*(vol_range**2) + U_max_1

E_c1 = RF+SR**2/A1
Vol_c1 = Weight_P_1*Port_Vol_ORP

#%% bar chart OCP1 weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_ORP*Weight_P_1)
ax.set(xlabel='Optimal Risk Portfolio Weight Allocation with A = '+ str(A1),ylabel='Names')

#%% Optimal Indifference Utility Curve 2
A2 = 5
U_max_2 = RF + SR**2/(2*A2)
Weight_P_2 = SR/(A2*Port_Vol_ORP)

R2 = 1/2*A2*(vol_range**2) + U_max_2

E_c2 = RF+SR**2/A2
Vol_c2 = Weight_P_2*Port_Vol_ORP

#%% bar chart OCP2 weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_ORP*Weight_P_2)
ax.set(xlabel='Optimal Risk Portfolio Weight Allocation with A = '+ str(A2),ylabel='Names')

#%% plot Capital Market Line and Indifference Utility Curves
fig,ax=plt.subplots()
ax.plot(vol_range,CML)
ax.plot(vol_range,R1,color="green")
ax.plot(vol_range,R2,color="green")
ax.scatter(Port_Vol_ORP,Port_Return_ORP, marker='D')

ax.scatter(Vol_c1,E_c1, marker='*', color="purple")
ax.scatter(Vol_c2,E_c2, marker='*', color="purple")

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')

#%% plot everything
fig,ax=plt.subplots()
ax.plot(Hcurve_vol,Rp_range_Hcurve)
ax.scatter(Port_Vol_GMVP,Port_Return_GMVP, marker='x')
ax.scatter(0,RF,color="red")
ax.scatter(Port_Vol_ORP,Port_Return_ORP, marker='D')
ax.plot(vol_range,CML)

ax.plot(vol_range,R1,color="green")
ax.plot(vol_range,R2,color="green")

ax.scatter(Vol_c1,E_c1, marker='*', color="purple")
ax.scatter(Vol_c2,E_c2, marker='*', color="purple")

ax.scatter(Singlename_Vol,Singlename_Mean,color="blue")
for x_pos, y_pos, label in zip(Singlename_Vol, Singlename_Mean, tickers):
    ax.annotate(label,
                xy=(x_pos, y_pos),
                xytext=(7, 0),
                textcoords='offset points',
                ha='left',
                va='center')

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')"""
}

CH12_EX3 = {
    "id": "ex3",
    "title": "12.3 非負權重限制下的效率前緣",
    "filename": "B2_Ch12_3.py",
    "code": r"""# B2_Ch12_3.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

from numpy import array, sqrt, dot, linspace, append, zeros_like, ones_like, size, identity
from pandas import read_excel, DataFrame
from qpsolvers import solve_qp
import matplotlib.pyplot as plt

#%% Read data from excel
data = read_excel('/data/datasets/b2_ch12/Data_portfolio_1.xlsx')

#%% Return Vector, Volatility Vector, Variance-Covariance Matrix, Correlation Matrix
Singlename_Mean = DataFrame.mean(data)*12
Singlename_Vol = DataFrame.std(data)*sqrt(12)
CorrelationMatrix = DataFrame.corr(data)
CovarianceMatrix = DataFrame.cov(data)*12

#%% Define Risk Free asset
RF = 0.02

#%% Scatter plot
tickers = Singlename_Mean.index.tolist()

fig,ax=plt.subplots()
ax.scatter(Singlename_Vol,Singlename_Mean,color="blue")
ax.scatter(0,RF,color="red")

for x_pos, y_pos, label in zip(Singlename_Vol, Singlename_Mean, tickers):
    ax.annotate(label,
                xy=(x_pos, y_pos),
                xytext=(7, 0),
                textcoords='offset points',
                ha='left',
                va='center')

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')


#%% GMVP portfolio (non-negative weights)
Weight_GMVP=solve_qp(
    CovarianceMatrix.to_numpy(),
    zeros_like(Singlename_Mean),
    -identity(size(Singlename_Mean)),
    zeros_like(Singlename_Mean),
    ones_like(Singlename_Mean),
    array([1.]))

Port_Vol_GMVP = sqrt(dot(dot(Weight_GMVP,CovarianceMatrix.to_numpy()),Weight_GMVP))
Port_Return_GMVP = dot(Weight_GMVP,Singlename_Mean.to_numpy())

#%% bar chart GMVP weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_GMVP)
ax.set(xlabel='GMVP Weight Allocation',ylabel='Names')

#%% MVP portfolio, fixed return (non-negative weights)
Port_Return = 0.1
Weight_MVP=solve_qp(
    CovarianceMatrix.to_numpy(),
    zeros_like(Singlename_Mean),
    -identity(size(Singlename_Mean)),
    zeros_like(Singlename_Mean),
    array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
    array([1.,Port_Return]).reshape(2,))


#%% Efficient Frontier
EF_vol = array([])
Rp_range =  linspace(Port_Return_GMVP,max(Singlename_Mean), num=15)

for Rp in Rp_range:
    Weight_MVP=solve_qp(
        CovarianceMatrix.to_numpy(),
        zeros_like(Singlename_Mean),
        -identity(size(Singlename_Mean)),
        zeros_like(Singlename_Mean),
        array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
        array([1.,Rp]).reshape(2,))
    Port_vol = sqrt(dot(dot(Weight_MVP,CovarianceMatrix.to_numpy()),Weight_MVP))
    EF_vol = append(EF_vol,array(Port_vol))

# In-efficient
InEF_vol = array([])
Rp_range_inEF =  linspace(min(Singlename_Mean),Port_Return_GMVP, num=8)

for Rp in Rp_range_inEF:
    Weight_MVP=solve_qp(
        CovarianceMatrix.to_numpy(),
        zeros_like(Singlename_Mean),
        -identity(size(Singlename_Mean)),
        zeros_like(Singlename_Mean),
        array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
        array([1.,Rp]).reshape(2,))
    Port_vol = sqrt(dot(dot(Weight_MVP,CovarianceMatrix.to_numpy()),Weight_MVP))
    InEF_vol = append(InEF_vol,array(Port_vol))

# Hyperbola curve
Hcurve_vol = array([])
Rp_range_Hcurve =  linspace(min(Singlename_Mean),max(Singlename_Mean), num=50)

for Rp in Rp_range_Hcurve:
    Weight_MVP=solve_qp(
        CovarianceMatrix.to_numpy(),
        zeros_like(Singlename_Mean),
        -identity(size(Singlename_Mean)),
        zeros_like(Singlename_Mean),
        array([ones_like(Singlename_Mean),Singlename_Mean.to_numpy()]),
        array([1.,Rp]).reshape(2,))
    Port_vol = sqrt(dot(dot(Weight_MVP,CovarianceMatrix.to_numpy()),Weight_MVP))
    Hcurve_vol = append(Hcurve_vol,array(Port_vol))

#%% Optimal Risky portfolio (non-negative weights)
Er_initial = 0.05
Solution=solve_qp(
    CovarianceMatrix.to_numpy(),
    zeros_like(Singlename_Mean),
    -identity(size(Singlename_Mean)),
    zeros_like(Singlename_Mean),
    array([Singlename_Mean.to_numpy()-RF]),
    array([Er_initial-RF]))

Weight_ORP = Solution/sum(Solution)

Port_Vol_ORP = sqrt(dot(dot(Weight_ORP,CovarianceMatrix.to_numpy()),Weight_ORP))
Port_Return_ORP = dot(Weight_ORP,Singlename_Mean.to_numpy())

SR = (Port_Return_ORP-RF)/Port_Vol_ORP

#%% bar chart ORP weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_ORP)
ax.set(xlabel='Optimal Risk Portfolio Weight Allocation',ylabel='Names')

#%% Capital Market Line
vol_range = linspace(0,0.3,100)
CML = RF + SR*vol_range

#%% plot Efficient Frontier portfolios
fig,ax=plt.subplots()
ax.plot(Hcurve_vol,Rp_range_Hcurve)
ax.scatter(Port_Vol_GMVP,Port_Return_GMVP, marker='x')
ax.scatter(0,RF,color="red")
ax.scatter(Port_Vol_ORP,Port_Return_ORP, marker='D',color="red")
ax.plot(vol_range,CML)
ax.scatter(Singlename_Vol,Singlename_Mean,color="blue")

for x_pos, y_pos, label in zip(Singlename_Vol, Singlename_Mean, tickers):
    ax.annotate(label,
                xy=(x_pos, y_pos),
                xytext=(7, 0),
                textcoords='offset points',
                ha='left',
                va='center')

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')


#%% Optimal Indifference Utility Curve 1
A1 = 3
U_max_1 = RF + SR**2/(2*A1)
Weight_P_1 = SR/(A1*Port_Vol_ORP)

R1 = 1/2*A1*(vol_range**2) + U_max_1

E_c1 = RF+SR**2/A1
Vol_c1 = Weight_P_1*Port_Vol_ORP

#%% bar chart OCP1 weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_ORP*Weight_P_1)
ax.set(xlabel='Optimal Risk Portfolio Weight Allocation with A = '+ str(A1),ylabel='Names')

#%% Optimal Indifference Utility Curve 2
A2 = 5
U_max_2 = RF + SR**2/(2*A2)
Weight_P_2 = SR/(A2*Port_Vol_ORP)

R2 = 1/2*A2*(vol_range**2) + U_max_2

E_c2 = RF+SR**2/A2
Vol_c2 = Weight_P_2*Port_Vol_ORP

#%% bar chart OCP2 weight
fig,ax=plt.subplots()

ax.barh(tickers,Weight_ORP*Weight_P_2)
ax.set(xlabel='Optimal Risk Portfolio Weight Allocation with A = '+ str(A2),ylabel='Names')

#%% plot Capital Market Line and Indifference Utility Curves
fig,ax=plt.subplots()
ax.plot(vol_range,CML)
ax.plot(vol_range,R1,color="green")
ax.plot(vol_range,R2,color="green")
ax.scatter(Port_Vol_ORP,Port_Return_ORP, marker='D')

ax.scatter(Vol_c1,E_c1, marker='*', color="purple")
ax.scatter(Vol_c2,E_c2, marker='*', color="purple")

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')

#%% plot everything
fig,ax=plt.subplots()
ax.plot(Hcurve_vol,Rp_range_Hcurve)
ax.scatter(Port_Vol_GMVP,Port_Return_GMVP, marker='x')
ax.scatter(0,RF,color="red")
ax.scatter(Port_Vol_ORP,Port_Return_ORP, marker='D')
ax.plot(vol_range,CML)

ax.plot(vol_range,R1,color="green")
ax.plot(vol_range,R2,color="green")

ax.scatter(Vol_c1,E_c1, marker='*', color="purple")
ax.scatter(Vol_c2,E_c2, marker='*', color="purple")

ax.scatter(Singlename_Vol,Singlename_Mean,color="blue")
for x_pos, y_pos, label in zip(Singlename_Vol, Singlename_Mean, tickers):
    ax.annotate(label,
                xy=(x_pos, y_pos),
                xytext=(7, 0),
                textcoords='offset points',
                ha='left',
                va='center')

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')"""
}

CH12_EX4 = {
    "id": "ex4",
    "title": "12.4 CAPM Beta 與系統性風險分析",
    "filename": "B2_Ch12_4.py",
    "code": r"""# B2_Ch12_4.py

###############
# Prepared by Ran An, Wei Lu, and Feng Zhang
# Editor-in-chief: Weisheng Jiang, and Sheng Tu
# Book 2  |  Financial Risk Management with Python
# Published and copyrighted by Tsinghua University Press
# Beijing, China, 2021
###############

from numpy import sqrt, linspace, corrcoef, zeros
from pandas import read_excel, DataFrame

#%% Read data from excel
data = read_excel('/data/datasets/b2_ch12/Data_portfolio_2.xlsx')

#%% CAPM beta
Mean = DataFrame.mean(data)*12
Vol = DataFrame.std(data)*sqrt(12)

Singlename_Return = data.iloc[:,1:-2]

MktExcess = data.iloc[:,-2]
RF = data.iloc[:,-1]

Singlename_ExcessReturn = Singlename_Return.copy()

n = len(Singlename_Return.columns)

Correlation_v_Mkt = zeros(n)

for k in range(n):
    Singlename_ExcessReturn.iloc[:,k] = Singlename_Return.iloc[:,k] - RF
    Correlation_v_Mkt[k] = corrcoef(Singlename_ExcessReturn.iloc[:,k].to_numpy(),
                                    MktExcess.to_numpy())[1,0]


Vol_Excess = DataFrame.std(Singlename_ExcessReturn)*sqrt(12)
Vol_Mkt = DataFrame.std(MktExcess)*sqrt(12)


Beta = zeros(n)
Sys_exp_Vol = zeros(n)
Sys_exp_prct = zeros(n)

for k in range(n):
    Beta[k] = Correlation_v_Mkt[k]*Vol_Excess[k]/Vol_Mkt
    Sys_exp_Vol[k] = Beta[k]*Vol_Mkt
    Sys_exp_prct[k] = Sys_exp_Vol[k]**2/Vol_Excess[k]**2

print("Asset Names:", Singlename_Return.columns.tolist())
print("Beta values:", Beta)
print("Systematic Risk %:", Sys_exp_prct)"""
}


# ─── Main logic ──────────────────────────────────────────────────────────────
def fix_ch4():
    """Restore 8 truncated examples in chapters_b2_ch4.json."""
    path = os.path.join(CHAPTERS_DIR, "chapters_b2_ch4.json")
    ch = load_json(path)
    examples = ch["content"]["examples"]
    fixed = 0
    for ex in examples:
        fn = ex["filename"]
        if fn in CH4_FULL_CODE:
            ex["code"] = CH4_FULL_CODE[fn]
            fixed += 1
            print(f"  → Restored {fn}")
    save_json(path, ch)
    print(f"  Ch4: {fixed} examples restored")

def fix_ch12():
    """Add 3 missing examples and fix ex1 in chapters_b2_ch12.json."""
    path = os.path.join(CHAPTERS_DIR, "chapters_b2_ch12.json")
    ch = load_json(path)
    examples = ch["content"]["examples"]

    # Fix ex1: remove "*** End Patch" artifact and complete the plotting code
    for ex in examples:
        if ex["id"] == "ex1":
            code = ex["code"]
            if "*** End Patch" in code:
                code = code.replace("*** End Patch", "")
                ex["code"] = code.rstrip()
            # Ensure ex1 ends with the scatter+EF plot
            if "fig,ax=plt.subplots()" not in code.split("EF_vol = append")[-1]:
                ex["code"] = ex["code"].rstrip() + r"""

#%% plot results
fig,ax=plt.subplots()
ax.scatter(Singlename_Vol,Singlename_Mean,color="blue")
ax.scatter(0,RF,color="red")
ax.plot(EF_vol,Rp_range)
ax.scatter(Port_Vol_GMVP,Port_Return_GMVP, marker='x')

for x_pos, y_pos, label in zip(Singlename_Vol, Singlename_Mean, tickers):
    ax.annotate(label,
                xy=(x_pos, y_pos),
                xytext=(7, 0),
                textcoords='offset points',
                ha='left',
                va='center')

ax.set(xlabel='Portfolio Volatility',ylabel='Portfolio Return')"""

    # Add missing examples
    existing_ids = {e["id"] for e in examples}
    for new_ex in [CH12_EX2, CH12_EX3, CH12_EX4]:
        if new_ex["id"] not in existing_ids:
            examples.append(new_ex)
            print(f"  → Added {new_ex['filename']}")

    save_json(path, ch)
    print(f"  Ch12: now has {len(examples)} examples")


def create_missing_datasets():
    """Create synthetic CDS_spreads.csv and EE.csv for Ch9 and Ch10."""
    import csv

    # CDS_spreads.csv for Ch9_2
    ch9_dir = os.path.join(DATASETS_DIR, "b2_ch9")
    os.makedirs(ch9_dir, exist_ok=True)
    cds_path = os.path.join(ch9_dir, "CDS_spreads.csv")
    if not os.path.exists(cds_path):
        with open(cds_path, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["Maturity", "Spread", "DF", "Recovery"])
            # Typical CDS term structure data
            maturities = [1, 2, 3, 4, 5, 7, 10]
            spreads = [60, 80, 100, 115, 130, 155, 180]  # bps
            dfs = [0.98, 0.96, 0.94, 0.92, 0.90, 0.86, 0.80]
            recovery = 0.4
            for m, s, d in zip(maturities, spreads, dfs):
                w.writerow([m, s, d, recovery])
        print(f"  → Created {cds_path}")

    # EE.csv for Ch10_2
    ch10_dir = os.path.join(DATASETS_DIR, "b2_ch10")
    os.makedirs(ch10_dir, exist_ok=True)
    ee_path = os.path.join(ch10_dir, "EE.csv")
    if not os.path.exists(ee_path):
        with open(ee_path, "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["Time", "EE"])
            # Typical Expected Exposure profile (humped shape)
            times = [0.0, 0.083, 0.167, 0.25, 0.333, 0.417, 0.5,
                     0.583, 0.667, 0.75, 0.833, 0.917, 1.0]
            ees = [0.0, 0.15, 0.28, 0.38, 0.45, 0.50, 0.52,
                   0.50, 0.46, 0.40, 0.33, 0.25, 0.15]
            for t, e in zip(times, ees):
                w.writerow([t, e])
        print(f"  → Created {ee_path}")


def fix_ch9_dataset_path():
    """Update Ch9_2 code to use the correct dataset path."""
    path = os.path.join(CHAPTERS_DIR, "chapters_b2_ch9.json")
    ch = load_json(path)
    changed = False
    for ex in ch["content"]["examples"]:
        if ex["filename"] == "B2_Ch9_2.py":
            code = ex["code"]
            # Replace hardcoded Windows path
            old = r'C:\Dropbox\FRM Book\CreditRisk\CDS_spreads.csv'
            new = '/data/datasets/b2_ch9/CDS_spreads.csv'
            if old in code:
                code = code.replace(old, new)
                ex["code"] = code
                changed = True
                print("  → Fixed Ch9_2 CDS_spreads.csv path")
    if changed:
        save_json(path, ch)


def fix_ch10_dataset_path():
    """Update Ch10_2 code to use the correct dataset path."""
    path = os.path.join(CHAPTERS_DIR, "chapters_b2_ch10.json")
    ch = load_json(path)
    changed = False
    for ex in ch["content"]["examples"]:
        if ex["filename"] == "B2_Ch10_2.py":
            code = ex["code"]
            old = r"C:\Users\anran\Dropbox\FRM Book\CCR\EE.csv"
            new = "/data/datasets/b2_ch10/EE.csv"
            if old in code:
                code = code.replace(old, new)
                ex["code"] = code
                changed = True
                print("  → Fixed Ch10_2 EE.csv path")
    if changed:
        save_json(path, ch)


def validate_all_json():
    """Validate all chapter JSON files parse correctly and report example counts."""
    print("\n=== Validation ===")
    for i in range(1, 13):
        fn = f"chapters_b2_ch{i}.json"
        path = os.path.join(CHAPTERS_DIR, fn)
        if not os.path.exists(path):
            print(f"  ❌ {fn} NOT FOUND")
            continue
        try:
            ch = load_json(path)
            n_ex = len(ch["content"]["examples"])
            # Check for truncated code
            truncated = []
            for ex in ch["content"]["examples"]:
                code = ex.get("code", "")
                if code.rstrip().endswith("..."):
                    truncated.append(ex["filename"])
            status = f"  ✅ {fn}: {n_ex} examples"
            if truncated:
                status += f"  ⚠️ TRUNCATED: {', '.join(truncated)}"
            print(status)
        except json.JSONDecodeError as e:
            print(f"  ❌ {fn}: JSON PARSE ERROR: {e}")


# ─── Execute ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=== Fixing Ch4 (8 truncated examples) ===")
    fix_ch4()

    print("\n=== Fixing Ch12 (3 missing examples + ex1 artifact) ===")
    fix_ch12()

    print("\n=== Creating missing datasets ===")
    create_missing_datasets()

    print("\n=== Fixing Ch9_2 dataset path ===")
    fix_ch9_dataset_path()

    print("\n=== Fixing Ch10_2 dataset path ===")
    fix_ch10_dataset_path()

    validate_all_json()
    print("\n🎉 All fixes applied.")
