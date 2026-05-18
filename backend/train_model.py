import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score
from database import engine

def train_model():
    df = pd.read_sql("SELECT * FROM sales", engine)

    features = ["category", "sub_category", "region", "segment", "quantity", "discount"]
    target = "sales"

    data = df[features + [target]].copy()

    encoders = {}

    for col in ["category", "sub_category", "region", "segment"]:
        encoder = LabelEncoder()
        data[col] = encoder.fit_transform(data[col])
        encoders[col] = encoder

    X = data[features]
    y = data[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    print("MAE:", mean_absolute_error(y_test, predictions))
    print("R2 Score:", r2_score(y_test, predictions))

    os.makedirs("models", exist_ok=True)

    joblib.dump(model, "models/sales_model.pkl")
    joblib.dump(encoders, "models/encoders.pkl")

    print("Model saved successfully.")


train_model()