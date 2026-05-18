import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [summary, setSummary] = useState(null);
  const [regionSales, setRegionSales] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [topSubCategories, setTopSubCategories] = useState([]);
  const [aiSummary, setAiSummary] = useState("");
  const [prediction, setPrediction] = useState(null);

  const [form, setForm] = useState({
    category: "Technology",
    sub_category: "Phones",
    region: "West",
    segment: "Consumer",
    quantity: 2,
    discount: 0.1,
  });

  const subCategoryOptions = {
    Furniture: ["Bookcases", "Chairs", "Furnishings", "Tables"],
    Technology: ["Accessories", "Copiers", "Machines", "Phones"],
    "Office Supplies": [
      "Appliances",
      "Art",
      "Binders",
      "Envelopes",
      "Fasteners",
      "Labels",
      "Paper",
      "Storage",
      "Supplies",
    ],
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const summaryRes = await axios.get(`${API_URL}/analytics/summary`);
    const regionRes = await axios.get(`${API_URL}/analytics/region-sales`);
    const categoryRes = await axios.get(`${API_URL}/analytics/category-sales`);
    const subRes = await axios.get(`${API_URL}/analytics/top-sub-categories`);
    const aiRes = await axios.get(`${API_URL}/ai/business-summary`);

    setSummary(summaryRes.data);
    setRegionSales(regionRes.data);
    setCategorySales(categoryRes.data);
    setTopSubCategories(subRes.data);
    setAiSummary(aiRes.data.summary);
  };

  const predictSales = async () => {
    const res = await axios.get(`${API_URL}/predict`, { params: form });
    setPrediction(res.data.predicted_sales);
  };

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.hero}
      >
        <p style={styles.badge}>Retail Analytics Dashboard</p>
        <h1 style={styles.title}>AI Retail Sales Intelligence Platform</h1>
        <p style={styles.subtitle}>
          Transforming retail data into actionable insights through interactive analytics, 
          predictive modeling, and AI-powered business intelligence.
        </p>
      </motion.div>

      {summary && (
        <div style={styles.cards}>
          <StatCard
            title="Total Sales"
            value={`$${summary.total_sales.toLocaleString()}`}
          />
          <StatCard
            title="Total Profit"
            value={`$${summary.total_profit.toLocaleString()}`}
          />
          <StatCard
            title="Total Records"
            value={summary.total_rows.toLocaleString()}
          />
          <StatCard title="Avg Discount" value={summary.avg_discount} />
        </div>
      )}

      <div style={styles.grid}>
        <ChartCard title="Regional Sales">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionSales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Sales">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={styles.grid}>
        <motion.section
          style={styles.card}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>Top 10 Sub-Categories</h2>
          <div style={styles.list}>
            {topSubCategories.map((item, index) => (
              <div key={index} style={styles.listItem}>
                <span>
                  {index + 1}. {item.sub_category}
                </span>
                <strong>${Math.round(item.sales).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          style={styles.card}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h2>AI Business Summary</h2>
          <p style={styles.aiText}>{aiSummary}</p>
        </motion.section>
      </div>

      <motion.section
        style={styles.predictionCard}
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Sales Prediction</h2>
        <p style={styles.smallText}>
          Enter product details to predict expected sales.
        </p>

        <div className="prediction-form">
          <div className="form-field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                  sub_category: subCategoryOptions[e.target.value][0],
                })
              }
            >
              <option>Furniture</option>
              <option>Technology</option>
              <option>Office Supplies</option>
            </select>
          </div>

          <div className="form-field">
            <label>Sub Category</label>
            <select
              value={form.sub_category}
              onChange={(e) =>
                setForm({ ...form, sub_category: e.target.value })
              }
            >
              {subCategoryOptions[form.category].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Region</label>
            <select
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            >
              <option>West</option>
              <option>East</option>
              <option>Central</option>
              <option>South</option>
            </select>
          </div>

          <div className="form-field">
            <label>Segment</label>
            <select
              value={form.segment}
              onChange={(e) => setForm({ ...form, segment: e.target.value })}
            >
              <option>Consumer</option>
              <option>Corporate</option>
              <option>Home Office</option>
            </select>
          </div>

          <div className="form-field">
            <label>Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
              placeholder="Quantity"
            />
          </div>

          <div className="form-field">
            <label>Discount</label>
            <input
              type="number"
              step="0.01"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: Number(e.target.value) })
              }
              placeholder="Discount"
            />
          </div>
        </div>

        <div className="prediction-actions">
          <button onClick={predictSales} className="predict-button">
            Predict Sales
          </button>

          {prediction && (
            <motion.div
              className="prediction-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Predicted Sales: ${prediction}
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <motion.div
      style={styles.statCard}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <p style={styles.statTitle}>{title}</p>
      <h2>{value}</h2>
    </motion.div>
  );
}

function ChartCard({ title, children }) {
  return (
    <motion.section
      style={styles.card}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <h2>{title}</h2>
      {children}
    </motion.section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    fontFamily: "Inter, Arial, sans-serif",
    background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
    color: "#0f172a",
  },
  hero: {
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    padding: "36px",
    borderRadius: "24px",
    marginBottom: "28px",
    boxShadow: "0 20px 40px rgba(37, 99, 235, 0.25)",
  },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.18)",
    padding: "8px 14px",
    borderRadius: "999px",
    marginBottom: "12px",
  },
  title: {
    fontSize: "clamp(30px, 5vw, 54px)",
    margin: 0,
  },
  subtitle: {
    fontSize: "18px",
    maxWidth: "780px",
    lineHeight: 1.6,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statCard: {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  statTitle: {
    color: "#64748b",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    padding: "14px",
    background: "#f8fafc",
    borderRadius: "14px",
  },
  aiText: {
    fontSize: "17px",
    lineHeight: 1.7,
    color: "#334155",
  },
  predictionCard: {
    background: "white",
    padding: "28px",
    borderRadius: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  smallText: {
    color: "#64748b",
  },
};

export default App;
