from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import pandas as pd
import joblib

app = FastAPI(title="AI Retail Sales Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("models/sales_model.pkl")
encoders = joblib.load("models/encoders.pkl")


@app.get("/")
def home():
    return {"message": "AI Retail Sales Intelligence API is running"}


@app.get("/analytics/summary")
def get_summary():
    df = pd.read_sql("SELECT * FROM sales", engine)

    total_sales = round(df["sales"].sum(), 2)
    total_profit = round(df["profit"].sum(), 2)
    total_rows = len(df)
    avg_discount = round(df["discount"].mean(), 2)

    return {
        "total_sales": total_sales,
        "total_profit": total_profit,
        "total_rows": total_rows,
        "avg_discount": avg_discount,
    }


@app.get("/analytics/region-sales")
def region_sales():
    df = pd.read_sql(
        """
        SELECT region, SUM(sales) AS sales
        FROM sales
        GROUP BY region
        ORDER BY sales DESC
        """,
        engine,
    )

    return df.to_dict(orient="records")


@app.get("/analytics/category-sales")
def category_sales():
    df = pd.read_sql(
        """
        SELECT category, SUM(sales) AS sales
        FROM sales
        GROUP BY category
        ORDER BY sales DESC
        """,
        engine,
    )

    return df.to_dict(orient="records")


@app.get("/analytics/top-sub-categories")
def top_sub_categories():
    df = pd.read_sql(
        """
        SELECT sub_category, SUM(sales) AS sales
        FROM sales
        GROUP BY sub_category
        ORDER BY sales DESC
        LIMIT 10
        """,
        engine,
    )

    return df.to_dict(orient="records")


@app.get("/predict")
def predict_sales(
    category: str,
    sub_category: str,
    region: str,
    segment: str,
    quantity: int,
    discount: float,
):
    input_data = pd.DataFrame(
        [
            {
                "category": category,
                "sub_category": sub_category,
                "region": region,
                "segment": segment,
                "quantity": quantity,
                "discount": discount,
            }
        ]
    )

    for col in ["category", "sub_category", "region", "segment"]:
        input_data[col] = encoders[col].transform(input_data[col])

    prediction = model.predict(input_data)[0]

    return {"predicted_sales": round(float(prediction), 2)}


@app.get("/ai/business-summary")
def ai_business_summary():
    df = pd.read_sql("SELECT * FROM sales", engine)

    total_sales = round(df["sales"].sum(), 2)
    total_profit = round(df["profit"].sum(), 2)

    best_category = (
        df.groupby("category")["sales"]
        .sum()
        .sort_values(ascending=False)
        .idxmax()
    )

    worst_category = (
        df.groupby("category")["profit"]
        .sum()
        .sort_values()
        .idxmin()
    )

    best_region = (
        df.groupby("region")["sales"]
        .sum()
        .sort_values(ascending=False)
        .idxmax()
    )

    summary = f"""
    Total sales are ${total_sales}. Total profit is ${total_profit}.
    The best performing category is {best_category}.
    The strongest sales region is {best_region}.
    The lowest profit category is {worst_category}.
    The business should focus on improving profit in weak categories and reducing heavy discounts.
    """

    return {"summary": summary.strip()}