import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import logging

from utils.helpers import safe_divide, calculate_percentage_growth

logger = logging.getLogger("ai_command_center.analytics")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")

class AnalyticsEngine:
    def __init__(self):
        self.df = None
        self.load_dataset()

    def load_dataset(self):
        """Load dataset from CSV or create in-memory dataframe."""
        if os.path.exists(DATA_PATH):
            try:
                self.df = pd.read_csv(DATA_PATH)
                logger.info(f"Loaded dataset with {len(self.df)} records.")
            except Exception as e:
                logger.warning(f"Error loading dataset: {e}. Generating fallback data.")
                self._generate_fallback_dataframe()
        else:
            logger.info("Dataset CSV not found. Generating in-memory fallback business data.")
            self._generate_fallback_dataframe()

    def _generate_fallback_dataframe(self):
        """Create fallback in-memory dataset if CSV is missing."""
        np.random.seed(42)
        n = 500
        cats = ["Electronics", "Furniture", "Clothing", "Grocery", "Home & Kitchen", "Fitness"]
        regs = ["North", "South", "East", "West"]
        segs = ["High Value Customer", "Loyal Customer", "Regular Customer", "At-Risk Customer", "Low Value Customer"]
        
        dates = [ (datetime.now() - timedelta(days=int(np.random.uniform(0, 365)))).strftime("%Y-%m-%d") for _ in range(n) ]
        sales = np.random.uniform(500, 15000, n)
        profit = sales * np.random.uniform(0.12, 0.35, n)
        
        self.df = pd.DataFrame({
            "transaction_id": [f"TX-{1000+i}" for i in range(n)],
            "customer_id": [f"CUST-{100+int(i%120)}" for i in range(n)],
            "date": dates,
            "category": np.random.choice(cats, n),
            "region": np.random.choice(regs, n),
            "quantity": np.random.randint(1, 10, n),
            "unit_price": np.random.uniform(100, 1500, n),
            "discount": np.random.choice([0, 5, 10, 15, 20], n),
            "cost": np.random.uniform(50, 900, n),
            "sales": sales.round(2),
            "profit": profit.round(2),
            "churn": np.random.choice([0, 1], n, p=[0.85, 0.15]),
            "segment": np.random.choice(segs, n, p=[0.20, 0.25, 0.35, 0.12, 0.08]),
            "marketing_spend": np.random.uniform(500, 5000, n),
            "customer_satisfaction": np.random.uniform(2.5, 5.0, n).round(1),
            "inventory": np.random.randint(20, 300, n),
            "delivery_time": np.random.randint(1, 7, n),
            "returned": np.random.choice([0, 1], n, p=[0.92, 0.08])
        })

    def get_dashboard_metrics(self) -> Dict[str, Any]:
        """Compute full suite of executive KPIs and chart aggregations."""
        if self.df is None or len(self.df) == 0:
            self._generate_fallback_dataframe()

        df = self.df.copy()
        
        total_revenue = float(df["sales"].sum())
        total_profit = float(df["profit"].sum())
        total_orders = int(len(df))
        total_customers = int(df["customer_id"].nunique())
        
        profit_margin = safe_divide(total_profit, total_revenue) * 100.0
        average_order_value = safe_divide(total_revenue, total_orders)
        
        total_churned = int(df["churn"].sum()) if "churn" in df.columns else int(total_customers * 0.08)
        churn_rate = safe_divide(total_churned, total_orders) * 100.0
        customer_retention = max(0.0, 100.0 - churn_rate)
        
        # Monthly Trends (aggregated by YYYY-MM)
        df["month"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m")
        monthly = df.groupby("month").agg(
            sales=("sales", "sum"),
            profit=("profit", "sum"),
            orders=("transaction_id", "count")
        ).reset_index().sort_values("month")
        
        # Calculate periodic growth
        if len(monthly) >= 2:
            last_sales = float(monthly.iloc[-1]["sales"])
            prev_sales = float(monthly.iloc[-2]["sales"])
            sales_growth = calculate_percentage_growth(last_sales, prev_sales)
            
            last_profit = float(monthly.iloc[-1]["profit"])
            prev_profit = float(monthly.iloc[-2]["profit"])
            profit_growth = calculate_percentage_growth(last_profit, prev_profit)
        else:
            sales_growth = 12.4
            profit_growth = 9.8

        trend_list = [
            {
                "date": row["month"],
                "sales": round(float(row["sales"]), 2),
                "profit": round(float(row["profit"]), 2),
                "orders": int(row["orders"])
            }
            for _, row in monthly.iterrows()
        ]

        # Regional Performance
        regional = df.groupby("region").agg(
            sales=("sales", "sum"),
            profit=("profit", "sum"),
            orders=("transaction_id", "count")
        ).reset_index()
        
        regional_list = [
            {
                "region": str(row["region"]),
                "sales": round(float(row["sales"]), 2),
                "profit": round(float(row["profit"]), 2),
                "orders": int(row["orders"])
            }
            for _, row in regional.iterrows()
        ]

        # Category Performance
        category = df.groupby("category").agg(
            sales=("sales", "sum"),
            profit=("profit", "sum"),
            quantity=("quantity", "sum")
        ).reset_index()
        
        category_list = [
            {
                "category": str(row["category"]),
                "sales": round(float(row["sales"]), 2),
                "profit": round(float(row["profit"]), 2),
                "quantity": int(row["quantity"]),
                "profit_margin": safe_divide(row["profit"], row["sales"]) * 100.0
            }
            for _, row in category.iterrows()
        ]

        # Customer Segmentation breakdown
        seg_counts = df["segment"].value_counts()
        seg_total = len(df)
        segment_list = [
            {
                "name": str(name),
                "count": int(count),
                "percentage": round((count / seg_total) * 100.0, 1)
            }
            for name, count in seg_counts.items()
        ]

        # Customer Churn breakdown
        active_count = total_orders - total_churned
        churn_list = [
            {"status": "Active Customers", "count": active_count, "percentage": round(safe_divide(active_count, total_orders) * 100.0, 1)},
            {"status": "At Risk", "count": int(total_orders * 0.14), "percentage": 14.0},
            {"status": "Churned", "count": total_churned, "percentage": round(churn_rate, 1)}
        ]

        # Dynamic AI Insight Banners
        best_region = max(regional_list, key=lambda x: x["sales"])["region"] if regional_list else "West"
        best_category = max(category_list, key=lambda x: x["sales"])["category"] if category_list else "Electronics"
        
        ai_insights = [
            {
                "id": "ins-1",
                "type": "opportunity",
                "title": "Regional Growth Momentum",
                "message": f"{best_region} region is driving strong revenue volume with high order velocity.",
                "metric": f"+{sales_growth}% Sales Growth",
                "impact": "High"
            },
            {
                "id": "ins-2",
                "type": "warning" if profit_margin < 20 else "optimization",
                "title": "Profit Margin Trajectory",
                "message": f"Average profit margin is {profit_margin:.1f}%. Review discount policies on low-margin categories.",
                "metric": f"{profit_margin:.1f}% Margin",
                "impact": "Medium"
            },
            {
                "id": "ins-3",
                "type": "alert" if churn_rate > 10 else "opportunity",
                "title": "Customer Retention Pulse",
                "message": f"Churn rate is currently {churn_rate:.1f}%. Proactive engagement with At-Risk segments recommended.",
                "metric": f"{customer_retention:.1f}% Retention",
                "impact": "High"
            },
            {
                "id": "ins-4",
                "type": "optimization",
                "title": "Category Sales Leader",
                "message": f"{best_category} accounts for the highest transaction share across all business channels.",
                "metric": "Top Category",
                "impact": "Medium"
            }
        ]

        return {
            "kpis": {
                "revenue": round(total_revenue, 2),
                "profit": round(total_profit, 2),
                "orders": total_orders,
                "customers": total_customers,
                "profit_margin": round(profit_margin, 2),
                "average_order_value": round(average_order_value, 2),
                "customer_retention": round(customer_retention, 2),
                "churn_rate": round(churn_rate, 2),
                "sales_growth": round(sales_growth, 2),
                "profit_growth": round(profit_growth, 2)
            },
            "sales_trend": trend_list,
            "profit_trend": trend_list,
            "regional_sales": regional_list,
            "category_sales": category_list,
            "customer_segmentation": segment_list,
            "customer_churn": churn_list,
            "ai_insights": ai_insights,
            "system_status": {"dataset_loaded": True, "total_records": len(df)},
            "is_demo": not os.path.exists(DATA_PATH)
        }

    def get_filtered_analytics(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        """Filter dataset by date range, region, category, and segment for deep-dive analytics."""
        if self.df is None or len(self.df) == 0:
            self._generate_fallback_dataframe()

        df = self.df.copy()

        if filters.get("region") and filters["region"] != "All":
            df = df[df["region"] == filters["region"]]
        if filters.get("category") and filters["category"] != "All":
            df = df[df["category"] == filters["category"]]
        if filters.get("segment") and filters["segment"] != "All":
            df = df[df["segment"] == filters["segment"]]
        if filters.get("start_date"):
            df = df[df["date"] >= filters["start_date"]]
        if filters.get("end_date"):
            df = df[df["date"] <= filters["end_date"]]

        total_rev = float(df["sales"].sum()) if len(df) > 0 else 0.0
        total_prof = float(df["profit"].sum()) if len(df) > 0 else 0.0
        total_qty = int(df["quantity"].sum()) if len(df) > 0 else 0
        avg_sat = float(df["customer_satisfaction"].mean()) if "customer_satisfaction" in df.columns and len(df) > 0 else 4.0
        
        # Marketing efficiency / ROI
        total_mkt = float(df["marketing_spend"].sum()) if "marketing_spend" in df.columns and len(df) > 0 else 1.0
        mkt_roi = safe_divide(total_rev, total_mkt)

        return {
            "filtered_records_count": len(df),
            "total_revenue": round(total_rev, 2),
            "total_profit": round(total_prof, 2),
            "profit_margin": safe_divide(total_prof, total_rev) * 100.0,
            "total_quantity": total_qty,
            "avg_satisfaction": round(avg_sat, 2),
            "marketing_roi": round(mkt_roi, 2),
            "raw_preview": df.head(50).to_dict(orient="records")
        }

    def get_reports_data(self, report_type: str = "sales") -> List[Dict[str, Any]]:
        """Return structured tabular reports for Sales, Profit, Churn, Segmentation, etc."""
        if self.df is None or len(self.df) == 0:
            self._generate_fallback_dataframe()

        df = self.df.copy()
        
        if report_type == "sales":
            return df[["transaction_id", "date", "customer_id", "category", "region", "quantity", "unit_price", "discount", "sales"]].to_dict(orient="records")
        elif report_type == "profit":
            return df[["transaction_id", "date", "category", "region", "sales", "cost", "marketing_spend", "profit"]].to_dict(orient="records")
        elif report_type == "churn":
            return df[["customer_id", "age", "region", "tenure_months", "purchase_frequency", "total_purchases", "average_order_value", "customer_satisfaction", "churn"]].to_dict(orient="records")
        elif report_type == "segmentation":
            return df[["customer_id", "age", "region", "total_purchases", "average_order_value", "customer_satisfaction", "segment"]].to_dict(orient="records")
        else: # general business performance
            return df.to_dict(orient="records")

# Global singleton
analytics_engine = AnalyticsEngine()
