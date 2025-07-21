import pandas as pd
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("transfers_table.csv")

df.columns = [col.strip() for col in df.columns]  # strip whitespace

numeric_cols = ["BPM", "ORtg", "Usg", "Ast", "TO"]
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")  # convert bad values to NaN

df.dropna(subset=numeric_cols, inplace=True)

df["success"] = (
    (df["BPM"] > 2.0) &
    (df["ORtg"] > 110) &
    (df["Usg"] > 20) &
    (df["Usg"] < 30)
).astype(int)

features = numeric_cols
X = df[features]
y = df["success"]

model = LogisticRegression()
model.fit(X, y)

df["success_probability"] = model.predict_proba(X)[:, 1]

results = df[["Player", "success_probability"]].sort_values(by="success_probability", ascending=False)

results.to_json("../frontend/public/success_probabilities.json", orient="records")
results.to_csv("success_probabilities.csv", index=False)

print(results.to_string(index=False))
