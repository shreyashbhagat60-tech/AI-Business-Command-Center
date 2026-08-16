import os
import numpy as np
import logging
from typing import Dict, Any, List

from .model_loader import model_registry
from .preprocessing import (
    preprocess_sales,
    preprocess_profit,
    preprocess_churn,
    preprocess_segmentation
)
from .analytics import analytics_engine
from utils.helpers import safe_divide

logger = logging.getLogger("ai_command_center.ai_engine")

SEGMENT_NAMES = [
    "High Value Customer",
    "Loyal Customer",
    "Regular Customer",
    "At-Risk Customer",
    "Low Value Customer"
]

class AIEngine:
    def predict_sales(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict sales using RandomForestRegressor or heuristic fallback."""
        model = model_registry.get_model("sales")
        is_demo = model is None
        
        unit_price = float(data.get("unit_price", 450.0))
        quantity = float(data.get("quantity", 2))
        discount = float(data.get("discount", 10.0))
        
        if model is not None:
            try:
                X, _ = preprocess_sales(data)
                pred_val = float(model.predict(X)[0])
                model_status = "Connected (RandomForestRegressor)"
            except Exception as e:
                logger.error(f"Error in sales model prediction: {e}")
                pred_val = unit_price * quantity * (1.0 - discount / 100.0)
                model_status = "Demo Fallback Mode"
                is_demo = True
        else:
            pred_val = unit_price * quantity * (1.0 - discount / 100.0)
            model_status = "Demo Fallback Mode"

        pred_val = max(0.0, round(pred_val, 2))
        
        # Recommendations & Feature Impacts
        if discount > 20:
            rec = "High discount rate applied. Consider reducing promotional discount to 10-15% to boost realized revenue margin."
        elif float(data.get("inventory", 100)) < 20:
            rec = "Low inventory detected. Increase warehouse replenishment cycle to prevent stockouts during peak demand."
        else:
            rec = "Healthy demand trajectory. Optimize targeted digital marketing to capture additional regional market share."

        feature_impacts = [
            {"feature": "Unit Price", "impact": "+42%", "direction": "positive"},
            {"feature": "Order Quantity", "impact": "+35%", "direction": "positive"},
            {"feature": "Discount Rate", "impact": f"-{discount}%", "direction": "negative"},
            {"feature": "Customer Satisfaction", "impact": "+15%", "direction": "positive"}
        ]

        return {
            "predicted_sales": pred_val,
            "currency": "INR",
            "input_summary": data,
            "model_status": model_status,
            "confidence_score": 0.94 if not is_demo else 0.82,
            "business_recommendation": rec,
            "feature_impacts": feature_impacts,
            "is_demo": is_demo
        }

    def predict_profit(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict profit using RandomForestRegressor or heuristic fallback."""
        model = model_registry.get_model("profit")
        is_demo = model is None
        
        unit_price = float(data.get("unit_price", 500.0))
        quantity = float(data.get("quantity", 3))
        cost = float(data.get("cost", 300.0))
        discount = float(data.get("discount", 10.0))
        mkt = float(data.get("marketing_spend", 2000.0))
        
        gross_rev = unit_price * quantity * (1.0 - discount / 100.0)
        
        if model is not None:
            try:
                X, _ = preprocess_profit(data)
                pred_profit = float(model.predict(X)[0])
                model_status = "Connected (RandomForestRegressor)"
            except Exception as e:
                logger.error(f"Error in profit model prediction: {e}")
                pred_profit = gross_rev - (cost * quantity) - (mkt * 0.015)
                model_status = "Demo Fallback Mode"
                is_demo = True
        else:
            pred_profit = gross_rev - (cost * quantity) - (mkt * 0.015)
            model_status = "Demo Fallback Mode"

        pred_profit = round(pred_profit, 2)
        margin_pct = safe_divide(pred_profit, gross_rev) * 100.0
        
        if margin_pct < 10:
            interpretation = "Critically low profit margin. Direct costs and discounts are heavily eroding earnings."
            rec = "Immediate action needed: renegotiate supplier unit costs and eliminate discounts exceeding 8%."
        elif margin_pct < 25:
            interpretation = "Moderate profit margin. Operational overhead is stable but marketing efficiency can be tuned."
            rec = "Profit can be improved by reducing discount levels and optimizing marketing expenditure allocation."
        else:
            interpretation = "Strong profit generation with healthy gross and operating margin profile."
            rec = "Maintain pricing strategy and scale high-margin product bundles to maximize volume."

        return {
            "predicted_profit": pred_profit,
            "predicted_revenue": round(gross_rev, 2),
            "profit_margin_pct": round(margin_pct, 2),
            "currency": "INR",
            "input_summary": data,
            "model_status": model_status,
            "business_interpretation": interpretation,
            "recommendation": rec,
            "is_demo": is_demo
        }

    def predict_churn(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict customer churn using Classification model."""
        model = model_registry.get_model("churn")
        is_demo = model is None
        
        sat = float(data.get("customer_satisfaction", 3.8))
        returns = int(data.get("returned", 0))
        deliv = float(data.get("delivery_time", 4))
        tenure = float(data.get("tenure_months", 14))
        
        if model is not None:
            try:
                X, _ = preprocess_churn(data)
                prob = float(model.predict_proba(X)[0][1])
                pred_label = int(model.predict(X)[0])
                model_status = "Connected (RandomForestClassifier)"
            except Exception as e:
                logger.error(f"Error in churn model prediction: {e}")
                prob = 0.15 + (5.0 - sat) * 0.15 + (returns * 0.25)
                prob = float(np.clip(prob, 0.05, 0.95))
                pred_label = 1 if prob >= 0.50 else 0
                model_status = "Demo Fallback Mode"
                is_demo = True
        else:
            prob = 0.15 + (5.0 - sat) * 0.15 + (returns * 0.25)
            prob = float(np.clip(prob, 0.05, 0.95))
            pred_label = 1 if prob >= 0.50 else 0
            model_status = "Demo Fallback Mode"

        prob = round(prob, 2)
        
        if prob >= 0.65:
            risk_level = "High"
            risk_color = "#ef4444"
            actions = [
                "Deploy proactive account manager outreach within 24 hours.",
                "Offer a personalized retention loyalty discount (15-20%).",
                "Expedite resolution of any pending product returns or support tickets.",
                "Conduct executive feedback interview to address satisfaction bottlenecks."
            ]
            drivers = [
                "Customer satisfaction rating below target threshold",
                "High recent product returns rate",
                "Extended delivery turnaround times"
            ]
        elif prob >= 0.35:
            risk_level = "Medium"
            risk_color = "#f59e0b"
            actions = [
                "Send targeted product recommendation email based on purchase history.",
                "Provide VIP shipping perks on the next purchase.",
                "Monitor next order interval and send re-engagement prompt."
            ]
            drivers = [
                "Moderate purchase frequency lull",
                "Marginal customer tenure maturity"
            ]
        else:
            risk_level = "Low"
            risk_color = "#10b981"
            actions = [
                "Enroll in VIP loyalty tier & early access beta features.",
                "Request product review or referral endorsement.",
                "Deliver cross-sell recommendations for complementary catalog lines."
            ]
            drivers = [
                "High customer satisfaction rating",
                "Consistent purchase frequency and zero recent returns"
            ]

        return {
            "churn_prediction": pred_label,
            "churn_probability": prob,
            "risk_level": risk_level,
            "risk_color": risk_color,
            "model_status": model_status,
            "input_summary": data,
            "key_drivers": drivers,
            "recommended_actions": actions,
            "is_demo": is_demo
        }

    def predict_segment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict customer segment."""
        model = model_registry.get_model("segmentation")
        is_demo = model is None
        
        total_p = float(data.get("total_purchases", 45))
        aov = float(data.get("average_order_value", 420.0))
        sat = float(data.get("customer_satisfaction", 4.6))
        tenure = float(data.get("tenure_months", 24))
        
        if model is not None:
            try:
                X, _ = preprocess_segmentation(data)
                pred_idx = int(model.predict(X)[0])
                if model_registry.encoders and "segment" in model_registry.encoders:
                    seg_name = str(model_registry.encoders["segment"].inverse_transform([pred_idx])[0])
                else:
                    seg_name = SEGMENT_NAMES[min(pred_idx, len(SEGMENT_NAMES)-1)]
                model_status = "Connected (RandomForestClassifier)"
            except Exception as e:
                logger.error(f"Error in segmentation model prediction: {e}")
                seg_name = "High Value Customer" if total_p > 30 and aov > 300 else "Loyal Customer"
                model_status = "Demo Fallback Mode"
                is_demo = True
        else:
            if total_p > 35 and aov > 350:
                seg_name = "High Value Customer"
            elif tenure > 18 and sat >= 4.0:
                seg_name = "Loyal Customer"
            elif sat <= 2.5:
                seg_name = "At-Risk Customer"
            elif total_p < 5:
                seg_name = "Low Value Customer"
            else:
                seg_name = "Regular Customer"
            model_status = "Demo Fallback Mode"

        # Persona & Strategy details
        segment_details = {
            "High Value Customer": {
                "desc": "Elite tier customers generating substantial revenue with exceptional order values.",
                "chars": ["High average order value", "Low price sensitivity", "Frequent repeat orders", "High brand affinity"],
                "strategy": ["Dedicated concierge account manager", "Exclusive preview of premium releases", "Bespoke volume discounts", "Customized quarterly gifts"]
            },
            "Loyal Customer": {
                "desc": "Consistent brand champions with high lifetime tenure and steady engagement.",
                "chars": ["Long customer tenure", "Consistent purchase cadence", "High satisfaction scores", "High referral likelihood"],
                "strategy": ["Tiered loyalty points rewards", "Free priority delivery on all orders", "Early access to seasonal sales", "Community ambassador invitations"]
            },
            "Regular Customer": {
                "desc": "Standard active buyers with predictable seasonal purchasing behaviors.",
                "chars": ["Moderate basket size", "Responsive to promotions", "Standard purchase frequency", "Average satisfaction rating"],
                "strategy": ["Targeted upsell & cross-sell campaigns", "Seasonal discount newsletters", "Product bundle recommendations", "Engagement surveys"]
            },
            "At-Risk Customer": {
                "desc": "Previously engaged customers displaying declining activity or satisfaction issues.",
                "chars": ["Recent purchase lapse", "Declining satisfaction scores", "Recent product returns", "Discount reliance"],
                "strategy": ["Re-engagement win-back promotion", "Direct feedback inquiry", "Apology credit or discount code", "Targeted customer care follow-up"]
            },
            "Low Value Customer": {
                "desc": "Infrequent or one-time low-ticket shoppers with minimal lifetime contribution.",
                "chars": ["Low order value", "Single-order history", "High discount dependence", "Low response rate"],
                "strategy": ["Automated low-cost email workflows", "Entry-level bundle recommendations", "Clearance promotions", "Self-service support"]
            }
        }

        info = segment_details.get(seg_name, segment_details["Regular Customer"])

        return {
            "segment": seg_name,
            "segment_description": info["desc"],
            "characteristics": info["chars"],
            "recommended_strategy": info["strategy"],
            "rfm_score": {
                "recency_score": 4 if tenure > 12 else 3,
                "frequency_score": min(5, max(1, int(total_p / 10))),
                "monetary_score": min(5, max(1, int(aov / 100)))
            },
            "model_status": model_status,
            "is_demo": is_demo
        }

    def generate_business_advice(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Comprehensive AI Business Advisor engine calculating Health Score & SWOT recommendations."""
        # Grab live metrics if not supplied
        dash = analytics_engine.get_dashboard_metrics()
        kpis = dash["kpis"]

        revenue = float(request_data.get("revenue") or kpis["revenue"])
        profit = float(request_data.get("profit") or kpis["profit"])
        orders = int(request_data.get("orders") or kpis["orders"])
        churn_rate = float(request_data.get("churn_rate") or kpis["churn_rate"])
        sales_growth = float(request_data.get("sales_growth") or kpis["sales_growth"])
        profit_growth = float(request_data.get("profit_growth") or kpis["profit_growth"])
        
        profit_margin = safe_divide(profit, revenue) * 100.0
        retention_rate = max(0.0, 100.0 - churn_rate)

        # 1. Calculate weighted Business Health Score (0-100)
        # Margin: 25 pts (25% margin = 25pts)
        margin_score = int(np.clip(profit_margin * 1.0, 0, 25))
        # Growth: 25 pts (15% growth = 25pts)
        growth_score = int(np.clip(sales_growth * 1.6, 0, 25))
        # Retention: 25 pts (90% retention = 25pts)
        retention_score = int(np.clip((retention_rate / 100.0) * 25, 0, 25))
        # Inventory & Ops: 15 pts
        inventory_score = 13
        # Marketing Efficiency: 10 pts
        mkt_score = 9

        total_health_score = int(margin_score + growth_score + retention_score + inventory_score + mkt_score)
        total_health_score = max(5, min(98, total_health_score))

        if total_health_score >= 80:
            grade = "A (Excellent)"
            status = "Optimal Growth & Financial Resilience"
        elif total_health_score >= 65:
            grade = "B (Good)"
            status = "Strong Trajectory with Expansion Opportunities"
        elif total_health_score >= 45:
            grade = "C (Needs Attention)"
            status = "Margin Compression or Churn Pressure Detected"
        else:
            grade = "D (Critical)"
            status = "Immediate Strategic Intervention Required"

        # 2. Key Insights
        insights = [
            {
                "category": "Sales & Revenue",
                "title": "Top-Line Revenue Expansion",
                "description": f"Quarterly sales expanded at +{sales_growth}%, outperforming standard industry benchmarks."
            },
            {
                "category": "Profitability",
                "title": "Margin Efficiency",
                "description": f"Current blended profit margin is {profit_margin:.1f}%. Net earnings are ₹{profit:,.2f} on gross volume."
            },
            {
                "category": "Customer Loyalty",
                "title": "Customer Retention Index",
                "description": f"Retention is holding at {retention_rate:.1f}% with an annualized churn rate of {churn_rate:.1f}%."
            }
        ]

        # 3. Actionable Recommendations
        recommendations = [
            {
                "priority": "High",
                "title": "Dynamic Discount Governance",
                "action": "Cap ad-hoc checkout discounts at 12% across low-margin categories to protect bottom-line margins."
            },
            {
                "priority": "High",
                "title": "Automated Churn Interception",
                "action": "Trigger real-time personalized retention workflows for customers with >45 days since last transaction."
            },
            {
                "priority": "Medium",
                "title": "Cross-Sell Basket Optimization",
                "action": "Bundle top Electronics hardware with high-margin accessories to lift Average Order Value by 18%."
            }
        ]

        # 4. Warnings
        warnings = [
            {
                "severity": "High" if churn_rate > 12 else "Medium",
                "area": "Customer Churn Exposure",
                "details": f"Churn rate is currently {churn_rate:.1f}%. If unaddressed, this represents approximately ₹{(revenue * churn_rate / 100.0):,.0f} in annual revenue leakage."
            },
            {
                "severity": "Medium" if profit_growth < sales_growth else "Low",
                "area": "Margin Compression Gap",
                "details": f"Sales growth (+{sales_growth}%) is outstripping profit growth (+{profit_growth}%). Unit fulfillment and marketing costs require rationalization."
            }
        ]

        # 5. Opportunities
        opportunities = [
            {
                "potential": "High Growth",
                "title": "Regional Market Penetration",
                "strategy": "Expand dedicated regional distribution hubs in high-velocity territories to slash delivery turnaround to under 48 hours."
            },
            {
                "potential": "Quick Win",
                "title": "VIP High-Value Customer Program",
                "strategy": "Launch an invite-only subscription tier with priority dispatch and personalized concierge support."
            }
        ]

        exec_summary = (
            f"The business command center registers an overall Health Score of {total_health_score}/100 ({grade}). "
            f"Revenue velocity is solid at +{sales_growth}% periodic growth. Primary operational focus should be "
            f"tightening discount governance and launching targeted retention sequences to preserve the {profit_margin:.1f}% profit margin."
        )

        return {
            "health_score": {
                "score": total_health_score,
                "grade": grade,
                "status": status,
                "profit_margin_score": margin_score,
                "growth_score": growth_score,
                "retention_score": retention_score,
                "inventory_score": inventory_score,
                "marketing_efficiency_score": mkt_score
            },
            "insights": insights,
            "recommendations": recommendations,
            "warnings": warnings,
            "opportunities": opportunities,
            "executive_summary": exec_summary
        }

# Global singleton
ai_engine = AIEngine()
