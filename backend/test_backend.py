import os
import sys
import json

# Force UTF-8 stdout encoding for Windows console
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def run_all_tests():
    print("====================================================")
    print("RUNNING FULL AI BUSINESS COMMAND CENTER TEST SUITE")
    print("====================================================")
    
    # 1. Health Diagnostic
    print("\n--- 1. Testing GET /health ---")
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code} {r.text}"
    health_data = r.json()
    print("Status code:", r.status_code)
    print("Health Data:", health_data)
    assert health_data["status"] == "healthy"
    assert health_data["models"]["sales"] is True
    assert health_data["models"]["profit"] is True
    assert health_data["models"]["churn"] is True
    assert health_data["models"]["segmentation"] is True
    print("[PASS] Health Check passed!")

    # 2. Authentication: Login default executive admin
    print("\n--- 2. Testing POST /auth/login (Admin) ---")
    r = client.post("/auth/login", json={"email": "admin@commandcenter.ai", "password": "AdminPassword123!"})
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    login_data = r.json()
    token = login_data["access_token"]
    user_info = login_data["user"]
    print("Logged in as:", user_info["email"], f"({user_info['role']})")
    assert token is not None
    print("[PASS] Admin Login passed!")

    # 3. Auth Profile /me and /profile
    print("\n--- 3. Testing GET /auth/me & GET /profile ---")
    headers = {"Authorization": f"Bearer {token}"}
    r = client.get("/auth/me", headers=headers)
    assert r.status_code == 200
    assert r.json()["email"] == "admin@commandcenter.ai"

    r = client.get("/profile", headers=headers)
    assert r.status_code == 200
    assert r.json()["email"] == "admin@commandcenter.ai"
    print("[PASS] Profile Fetch passed!")

    # 4. Profile Update PUT /profile
    print("\n--- 4. Testing PUT /profile ---")
    r = client.put("/profile", json={"full_name": "Executive Director Updated", "company_name": "Global AI Enterprise"}, headers=headers)
    assert r.status_code == 200
    assert r.json()["full_name"] == "Executive Director Updated"
    print("[PASS] Profile Update passed!")

    # 5. Forgot Password
    print("\n--- 5. Testing POST /auth/forgot-password ---")
    r = client.post("/auth/forgot-password", json={"email": "admin@commandcenter.ai"})
    assert r.status_code == 200
    assert r.json()["success"] is True
    print("[PASS] Forgot Password passed!")

    # 6. Dashboard Metrics
    print("\n--- 6. Testing GET /dashboard ---")
    r = client.get("/dashboard")
    assert r.status_code == 200, f"Dashboard failed: {r.status_code} {r.text}"
    dash = r.json()
    print("KPIs:", dash["kpis"])
    print("Sales trend count:", len(dash["sales_trend"]))
    print("AI Insights count:", len(dash["ai_insights"]))
    assert "revenue" in dash["kpis"]
    assert "profit" in dash["kpis"]
    assert len(dash["regional_sales"]) >= 4
    print("[PASS] Dashboard Check passed!")

    # 7. Sales Prediction
    print("\n--- 7. Testing POST /predict/sales ---")
    payload_sales = {
        "age": 32,
        "category": "Electronics",
        "quantity": 3,
        "unit_price": 600.0,
        "discount": 10.0,
        "cost": 380.0,
        "marketing_spend": 3000.0,
        "customer_satisfaction": 4.5,
        "region": "West",
        "delivery_time": 3,
        "inventory": 150,
        "returned": 0
    }
    r = client.post("/predict/sales", json=payload_sales)
    assert r.status_code == 200, f"Sales pred failed: {r.status_code} {r.text}"
    sales_res = r.json()
    print("Sales Prediction Result:", sales_res)
    assert sales_res["predicted_sales"] > 0
    assert sales_res["is_demo"] is False
    print("[PASS] Sales Prediction passed!")

    # 8. Profit Prediction
    print("\n--- 8. Testing POST /predict/profit ---")
    payload_profit = {
        "unit_price": 800.0,
        "quantity": 2,
        "cost": 450.0,
        "discount": 5.0,
        "marketing_spend": 2500.0,
        "customer_satisfaction": 4.6,
        "delivery_time": 2,
        "returned": 0,
        "category": "Electronics",
        "region": "North"
    }
    r = client.post("/predict/profit", json=payload_profit)
    assert r.status_code == 200, f"Profit pred failed: {r.status_code} {r.text}"
    profit_res = r.json()
    print("Profit Prediction Result:", profit_res)
    assert "predicted_profit" in profit_res
    assert profit_res["is_demo"] is False
    print("[PASS] Profit Prediction passed!")

    # 9. Churn Prediction
    print("\n--- 9. Testing POST /predict/churn ---")
    payload_churn = {
        "age": 45,
        "tenure_months": 8,
        "purchase_frequency": 2,
        "total_purchases": 6,
        "average_order_value": 95.0,
        "customer_satisfaction": 2.2,
        "returned": 1,
        "discount": 20.0,
        "delivery_time": 7,
        "region": "South"
    }
    r = client.post("/predict/churn", json=payload_churn)
    assert r.status_code == 200, f"Churn pred failed: {r.status_code} {r.text}"
    churn_res = r.json()
    print("Churn Prediction Result:", churn_res)
    assert churn_res["churn_prediction"] in [0, 1]
    assert churn_res["risk_level"] in ["High", "Medium", "Low"]
    print("[PASS] Churn Prediction passed!")

    # 10. Segmentation
    print("\n--- 10. Testing POST /predict/segment ---")
    payload_seg = {
        "total_purchases": 50,
        "average_order_value": 450.0,
        "customer_satisfaction": 4.8,
        "tenure_months": 28,
        "discount": 5.0,
        "returned": 0,
        "region": "West"
    }
    r = client.post("/predict/segment", json=payload_seg)
    assert r.status_code == 200, f"Segmentation pred failed: {r.status_code} {r.text}"
    seg_res = r.json()
    print("Customer Segmentation Result:", seg_res)
    assert "segment" in seg_res
    print("[PASS] Segmentation Prediction passed!")

    # 11. AI Advisor Strategic Assessment
    print("\n--- 11. Testing POST /advisor ---")
    r = client.post("/advisor", json={"revenue": 12500000, "profit": 3250000, "sales_growth": 12.4, "churn_rate": 8.2})
    assert r.status_code == 200, f"Advisor failed: {r.status_code} {r.text}"
    adv_res = r.json()
    print("AI Advisor Health Score:", adv_res["health_score"])
    print("AI Insights count:", len(adv_res["insights"]))
    print("Recommendations count:", len(adv_res["recommendations"]))
    assert adv_res["health_score"]["score"] >= 0
    print("[PASS] AI Advisor Strategic Assessment passed!")

    # 12. AI Advisor Conversational Q&A Assistant
    print("\n--- 12. Testing POST /advisor/chat ---")
    r = client.post("/advisor/chat", json={"query": "Why did profit decrease?"})
    assert r.status_code == 200, f"Advisor chat failed: {r.status_code} {r.text}"
    chat_res = r.json()
    print("AI Advisor Chat Category:", chat_res["category"])
    assert len(chat_res["answer"]) > 20
    print("[PASS] AI Advisor Conversational Chat passed!")

    # 13. Reports & Real Exports
    print("\n--- 13. Testing GET /reports & Exports ---")
    r = client.get("/reports?type=sales")
    assert r.status_code == 200
    print("Sales Reports record count:", len(r.json()["data"]))

    r_csv = client.get("/reports/export?type=sales&format=csv")
    assert r_csv.status_code == 200
    assert "text/csv" in r_csv.headers.get("content-type", "")
    assert len(r_csv.content) > 100
    print("[PASS] CSV Export passed!")

    r_xlsx = client.get("/reports/export?type=profit&format=xlsx")
    assert r_xlsx.status_code == 200
    assert len(r_xlsx.content) > 500
    print("[PASS] Excel (.xlsx) Export passed!")

    print("\n====================================================")
    print("ALL 13 ENTERPRISE BACKEND TESTS PASSED (100%)!")
    print("====================================================")

if __name__ == "__main__":
    run_all_tests()
