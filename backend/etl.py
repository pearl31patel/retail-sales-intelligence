import pandas as pd
from database import engine

def clean_columns(df):
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("-", "_")
    )
    return df

def run_etl():
    df = pd.read_csv("data/superstore.csv", encoding="latin1")

    df = clean_columns(df)

    print("Columns found:", df.columns.tolist())

    # create fake year/month since dataset has no date
    df["year"] = 2024
    df["month"] = 1

    df = df.dropna()

    df.to_sql("sales", engine, if_exists="replace", index=False)

    print("ETL completed successfully.")

run_etl()