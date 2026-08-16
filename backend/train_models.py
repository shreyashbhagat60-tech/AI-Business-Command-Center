"""
Automated Model Training and Business Dataset Generator for AI Business Command Center.
Generates realistic multi-dimensional business datasets and trains scikit-learn models:
- Sales Prediction (RandomForestRegressor)
- Profit Prediction (RandomForestRegressor)
- Customer Churn Classifier (RandomForestClassifier)
- Customer Segmentation Classifier (RandomForestClassifier / KMeans)
Also exports scalers, encoders, and explicit feature name metadata.
"""

import os
import random
import numpy as np
import pandas as pd
import joblib
from datetime import datetime, timedelta

from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

CATEGORIES = ["Electronics", "Furniture", "Clothing", "Grocery", "Home & Kitchen", "Fitness"]
REGIONS = ["North", "South", "East", "West"]
SEGMENTS = [
    "High Value Customer",
    "Loyal Customer",
    "Regular Customer",
    "At-Risk Customer",
    "Low Value Customer"
]

def generate_synthetic_dataset(num_records=2500, random_state=42):
    np.random.seed(random_state)
    random.seed(random_state)
    
    records = []
    base_date = datetime.now() - timedelta(days=365)
    
    for i in range(1, num_records + 1):
        cust_id = f"CUST-{random.randint(1000, 1800)}"
        tx_id = f"TX-{10000 + i}"
        days_offset = random.randint(0, 365)
        tx_date = (base_date + timedelta(days=days_offset)).strftime("%Y-%m-%d")
        
        category = random.choice(CATEGORIES)
        region = random.choice(REGIONS)
        
        age = int(np.clip(np.random.normal(36, 11), 18, 72))
        
        # Category-based pricing heuristics
        if category == "Electronics":
            unit_price = round(float(np.random.uniform(250, 2200)), 2)
            cost_ratio = np.random.uniform(0.60, 0.78)
            quantity = int(np.random.choice([1, 2, 3, 4, 5], p=[0.45, 0.30, 0.15, 0.07, 0.03]))
        elif category == "Furniture":
            unit_price = round(float(np.random.uniform(150, 1200)), 2)
            cost_ratio = np.random.uniform(0.50, 0.70)
            quantity = int(np.random.choice([1, 2, 3, 4], p=[0.50, 0.30, 0.15, 0.05]))
        elif category == "Clothing":
            unit_price = round(float(np.random.uniform(25, 250)), 2)
            cost_ratio = np.random.uniform(0.35, 0.55)
            quantity = int(np.random.choice([1, 2, 3, 4, 6, 8], p=[0.30, 0.30, 0.20, 0.10, 0.06, 0.04]))
        elif category == "Grocery":
            unit_price = round(float(np.random.uniform(5, 80)), 2)
            cost_ratio = np.random.uniform(0.70, 0.88)
            quantity = int(np.random.choice([2, 4, 6, 10, 15], p=[0.20, 0.30, 0.25, 0.15, 0.10]))
        elif category == "Fitness":
            unit_price = round(float(np.random.uniform(40, 600)), 2)
            cost_ratio = np.random.uniform(0.45, 0.65)
            quantity = int(np.random.choice([1, 2, 3], p=[0.60, 0.30, 0.10]))
        else: # Home & Kitchen
            unit_price = round(float(np.random.uniform(30, 450)), 2)
            cost_ratio = np.random.uniform(0.40, 0.60)
            quantity = int(np.random.choice([1, 2, 3, 5], p=[0.45, 0.35, 0.15, 0.05]))
            
        discount = float(np.random.choice([0, 5, 10, 15, 20, 25, 30], p=[0.25, 0.25, 0.20, 0.15, 0.08, 0.05, 0.02]))
        base_cost = round(unit_price * cost_ratio, 2)
        
        marketing_spend = round(float(np.random.uniform(500, 8000)), 2)
        customer_satisfaction = round(float(np.clip(np.random.normal(4.1, 0.8), 1.0, 5.0)), 1)
        delivery_time = int(np.clip(np.random.normal(3.5, 1.5), 1, 10))
        inventory = int(np.random.randint(15, 450))
        
        # Returned probability correlated with dissatisfaction & delivery time
        return_prob = 0.04 + (5.0 - customer_satisfaction) * 0.04 + (delivery_time > 5) * 0.06
        returned = 1 if (random.random() < return_prob) else 0
        
        # Customer behavioral metrics
        tenure_months = int(np.clip(np.random.normal(20, 12), 1, 60))
        purchase_frequency = int(np.clip(np.random.poisson(lam=4.2), 1, 18))
        total_purchases = int(purchase_frequency * (tenure_months / 3.5) + np.random.randint(1, 10))
        average_order_value = round(float(unit_price * quantity * (1 - discount/100.0) + np.random.uniform(20, 80)), 2)
        
        # Sales & Profit calculations
        gross_sales = unit_price * quantity
        discounted_sales = gross_sales * (1.0 - discount / 100.0)
        actual_cost = base_cost * quantity
        
        # Marketing overhead allocation & logistics cost
        marketing_overhead = marketing_spend * 0.015
        logistics_cost = delivery_time * 4.5 + (20.0 if returned else 0.0)
        
        profit = discounted_sales - actual_cost - marketing_overhead - logistics_cost
        if returned:
            profit = -logistics_cost - 15.0  # restocking loss
            
        sales = round(discounted_sales, 2)
        profit = round(profit, 2)
        
        # Churn logic: High dissatisfaction, high delivery time, high returns, low tenure increase churn
        churn_score = (
            (5.0 - customer_satisfaction) * 0.35 +
            (1 if returned else 0) * 0.25 +
            (delivery_time / 10.0) * 0.20 +
            (1.0 / (purchase_frequency + 1)) * 0.20 -
            (tenure_months / 60.0) * 0.15
        )
        churn = 1 if churn_score > 0.48 else 0
        
        # Customer segment assignment based on value & behavior
        if total_purchases > 35 and average_order_value > 350 and customer_satisfaction >= 4.0:
            segment = "High Value Customer"
        elif tenure_months > 18 and purchase_frequency >= 5 and churn == 0:
            segment = "Loyal Customer"
        elif churn == 1 or (customer_satisfaction <= 2.5 and returned == 1):
            segment = "At-Risk Customer"
        elif total_purchases < 5 and average_order_value < 100:
            segment = "Low Value Customer"
        else:
            segment = "Regular Customer"
            
        records.append({
            "transaction_id": tx_id,
            "customer_id": cust_id,
            "date": tx_date,
            "age": age,
            "category": category,
            "quantity": quantity,
            "unit_price": unit_price,
            "discount": discount,
            "cost": base_cost,
            "marketing_spend": marketing_spend,
            "customer_satisfaction": customer_satisfaction,
            "region": region,
            "delivery_time": delivery_time,
            "inventory": inventory,
            "returned": returned,
            "tenure_months": tenure_months,
            "purchase_frequency": purchase_frequency,
            "total_purchases": total_purchases,
            "average_order_value": average_order_value,
            "sales": sales,
            "profit": profit,
            "churn": churn,
            "segment": segment
        })
        
    df = pd.DataFrame(records)
    csv_path = os.path.join(DATA_DIR, "dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"[OK] Generated {len(df)} records saved to {csv_path}")
    return df

def train_and_save_models(df):
    feature_names_dict = {}
    encoders_dict = {}
    scalers_dict = {}
    
    # 1. TRAIN SALES MODEL (RandomForestRegressor)
    sales_features = [
        "age", "quantity", "unit_price", "discount", "cost", 
        "marketing_spend", "customer_satisfaction", "delivery_time", 
        "inventory", "returned", "category_encoded", "region_encoded"
    ]
    
    # Categorical encoders
    cat_encoder = LabelEncoder()
    reg_encoder = LabelEncoder()
    df["category_encoded"] = cat_encoder.fit_transform(df["category"])
    df["region_encoded"] = reg_encoder.fit_transform(df["region"])
    
    encoders_dict["category"] = cat_encoder
    encoders_dict["region"] = reg_encoder
    
    X_sales = df[sales_features]
    y_sales = df["sales"]
    
    scaler_sales = StandardScaler()
    X_sales_scaled = scaler_sales.fit_transform(X_sales)
    scalers_dict["sales"] = scaler_sales
    
    sales_model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42)
    sales_model.fit(X_sales_scaled, y_sales)
    joblib.dump(sales_model, os.path.join(MODELS_DIR, "sales_model.pkl"))
    feature_names_dict["sales"] = sales_features
    print("[OK] Trained and saved sales_model.pkl")
    
    # 2. TRAIN PROFIT MODEL (RandomForestRegressor)
    profit_features = [
        "unit_price", "quantity", "cost", "discount", 
        "marketing_spend", "customer_satisfaction", "delivery_time", 
        "returned", "category_encoded", "region_encoded"
    ]
    X_profit = df[profit_features]
    y_profit = df["profit"]
    
    scaler_profit = StandardScaler()
    X_profit_scaled = scaler_profit.fit_transform(X_profit)
    scalers_dict["profit"] = scaler_profit
    
    profit_model = RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42)
    profit_model.fit(X_profit_scaled, y_profit)
    joblib.dump(profit_model, os.path.join(MODELS_DIR, "profit_model.pkl"))
    feature_names_dict["profit"] = profit_features
    print("[OK] Trained and saved profit_model.pkl")
    
    # 3. TRAIN CHURN MODEL (RandomForestClassifier)
    churn_features = [
        "age", "tenure_months", "purchase_frequency", "total_purchases",
        "average_order_value", "customer_satisfaction", "returned", 
        "discount", "delivery_time", "region_encoded"
    ]
    X_churn = df[churn_features]
    y_churn = df["churn"]
    
    scaler_churn = StandardScaler()
    X_churn_scaled = scaler_churn.fit_transform(X_churn)
    scalers_dict["churn"] = scaler_churn
    
    churn_model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    churn_model.fit(X_churn_scaled, y_churn)
    joblib.dump(churn_model, os.path.join(MODELS_DIR, "churn_model.pkl"))
    feature_names_dict["churn"] = churn_features
    print("[OK] Trained and saved churn_model.pkl")
    
    # 4. TRAIN SEGMENTATION MODEL (RandomForestClassifier)
    segment_encoder = LabelEncoder()
    df["segment_encoded"] = segment_encoder.fit_transform(df["segment"])
    encoders_dict["segment"] = segment_encoder
    
    segment_features = [
        "age", "tenure_months", "purchase_frequency", "total_purchases",
        "average_order_value", "customer_satisfaction", "discount"
    ]
    X_seg = df[segment_features]
    y_seg = df["segment_encoded"]
    
    scaler_seg = StandardScaler()
    X_seg_scaled = scaler_seg.fit_transform(X_seg)
    scalers_dict["segmentation"] = scaler_seg
    
    seg_model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    seg_model.fit(X_seg_scaled, y_seg)
    joblib.dump(seg_model, os.path.join(MODELS_DIR, "segmentation_model.pkl"))
    feature_names_dict["segmentation"] = segment_features
    print("[OK] Trained and saved segmentation_model.pkl")
    
    # SAVE AUXILIARY FILES
    joblib.dump(scalers_dict, os.path.join(MODELS_DIR, "scaler.pkl"))
    joblib.dump(encoders_dict, os.path.join(MODELS_DIR, "encoder.pkl"))
    joblib.dump(feature_names_dict, os.path.join(MODELS_DIR, "feature_names.pkl"))
    print("[OK] Exported scaler.pkl, encoder.pkl, and feature_names.pkl")

if __name__ == "__main__":
    print("Starting AI Business Command Center Dataset Generation & Model Training...")
    dataset = generate_synthetic_dataset(num_records=2500)
    train_and_save_models(dataset)
    print("Training pipeline complete!")
