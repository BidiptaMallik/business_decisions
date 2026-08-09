import pandas as pd

for name, path in [
    ("churn", "BusinessDecisionData/churn_data.csv"),
    ("pricing", "BusinessDecisionData/pricing_data.csv"),
    ("market", "BusinessDecisionData/market_data.csv"),
    ("supplychain", "BusinessDecisionData/supplychain_data1.csv"),
]:
    data = pd.read_csv(path, encoding='latin1', low_memory=False, nrows=5)
    print(f"\n--- {name} ---")
    print(list(data.columns))
    print(data.dtypes)