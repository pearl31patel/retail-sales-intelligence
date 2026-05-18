# AI Retail Sales Intelligence Platform

An end-to-end full-stack data platform that combines data engineering, analytics, machine learning, and AI-powered business intelligence for retail sales analysis.

## Features

- ETL pipeline for retail sales data processing
- Interactive analytics dashboard
- Regional and category-wise sales analysis
- Top-performing sub-category insights
- Machine learning sales prediction
- AI-generated business summary
- Responsive and animated frontend UI
- REST API backend with FastAPI
- SQLite database integration

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pandas
- Scikit-learn
- SQLite / PostgreSQL

### Frontend
- React
- Vite
- Recharts
- Framer Motion
- Axios

### Machine Learning
- Random Forest Regressor
- Label Encoding
- Sales prediction model

## Project Workflow

1. Load Kaggle retail dataset
2. Clean and transform data using ETL pipeline
3. Store clean data in PostgreSQL
4. Train ML model to predict sales
5. Build FastAPI APIs
6. Build React dashboard
7. Display analytics and prediction results

## Dashboard Features

- Total sales and profit metrics
- Regional sales visualization
- Category sales analytics
- Top sub-category analysis
- AI business recommendations
- Sales prediction system

## Machine Learning Workflow

1. Data preprocessing and cleaning
2. Feature engineering
3. Label encoding categorical features
4. Train/test split
5. Random Forest model training
6. Sales prediction API deployment

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `/analytics/summary` | Sales summary metrics |
| `/analytics/region-sales` | Regional sales analysis |
| `/analytics/category-sales` | Category sales insights |
| `/analytics/top-sub-categories` | Top-performing sub-categories |
| `/predict` | ML sales prediction |
| `/ai/business-summary` | AI-generated business insights |

## Why This Project Matters

Retail companies need data-driven insights to improve sales, profit, and inventory planning. This project helps businesses to understand sales trends, identify top products, predict sales, and generate simple AI business summaries.

## How to Run

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python etl.py
python train_model.py
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Dataset

Kaggle Sample Superstore Dataset

---

## Author

Pearl Patel