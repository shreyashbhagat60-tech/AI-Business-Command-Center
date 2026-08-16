import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
import logging

from .model_loader import model_registry

logger = logging.getLogger("ai_command_center.preprocessing")

DEFAULT_CATEGORIES = ["Electronics", "Furniture", "Clothing", "Grocery", "Home & Kitchen", "Fitness"]
DEFAULT_REGIONS = ["North", "South", "East", "West"]

def encode_category(category_name: str) -> int:
    """Encode category using loaded encoder or deterministic index fallback."""
    if model_registry.encoders and "category" in model_registry.encoders:
        encoder = model_registry.encoders["category"]
        try:
            return int(encoder.transform([category_name])[0])
        except Exception:
            pass
    try:
        return DEFAULT_CATEGORIES.index(category_name)
    except ValueError:
        return 0

def encode_region(region_name: str) -> int:
    """Encode region using loaded encoder or deterministic index fallback."""
    if model_registry.encoders and "region" in model_registry.encoders:
        encoder = model_registry.encoders["region"]
        try:
            return int(encoder.transform([region_name])[0])
        except Exception:
            pass
    try:
        return DEFAULT_REGIONS.index(region_name)
    except ValueError:
        return 0

def preprocess_sales(data: Dict[str, Any]) -> Tuple[np.ndarray, bool]:
    """
    Strictly orders and scales features for the sales prediction model.
    Expected features:
    ["age", "quantity", "unit_price", "discount", "cost", "marketing_spend",
     "customer_satisfaction", "delivery_time", "inventory", "returned", 
     "category_encoded", "region_encoded"]
    """
    cat_enc = encode_category(data.get("category", "Electronics"))
    reg_enc = encode_region(data.get("region", "West"))
    
    raw_dict = {
        "age": float(data.get("age", 35)),
        "quantity": float(data.get("quantity", 2)),
        "unit_price": float(data.get("unit_price", 450.0)),
        "discount": float(data.get("discount", 10.0)),
        "cost": float(data.get("cost", 280.0)),
        "marketing_spend": float(data.get("marketing_spend", 2500.0)),
        "customer_satisfaction": float(data.get("customer_satisfaction", 4.5)),
        "delivery_time": float(data.get("delivery_time", 3)),
        "inventory": float(data.get("inventory", 120)),
        "returned": float(data.get("returned", 0)),
        "category_encoded": float(cat_enc),
        "region_encoded": float(reg_enc),
    }
    
    # Check if feature_names ordering is available
    if model_registry.feature_names and "sales" in model_registry.feature_names:
        feature_order = model_registry.feature_names["sales"]
    else:
        feature_order = [
            "age", "quantity", "unit_price", "discount", "cost", 
            "marketing_spend", "customer_satisfaction", "delivery_time", 
            "inventory", "returned", "category_encoded", "region_encoded"
        ]
        
    ordered_values = [raw_dict.get(feat, 0.0) for feat in feature_order]
    X = np.array(ordered_values).reshape(1, -1)
    
    # Scale if scaler is available
    scaled = False
    if model_registry.scalers and "sales" in model_registry.scalers:
        try:
            X = model_registry.scalers["sales"].transform(X)
            scaled = True
        except Exception as e:
            logger.warning(f"Sales scaling error: {e}")
            
    return X, scaled

def preprocess_profit(data: Dict[str, Any]) -> Tuple[np.ndarray, bool]:
    """
    Strictly orders and scales features for the profit prediction model.
    Expected features:
    ["unit_price", "quantity", "cost", "discount", "marketing_spend", 
     "customer_satisfaction", "delivery_time", "returned", 
     "category_encoded", "region_encoded"]
    """
    cat_enc = encode_category(data.get("category", "Electronics"))
    reg_enc = encode_region(data.get("region", "North"))
    
    raw_dict = {
        "unit_price": float(data.get("unit_price", 500.0)),
        "quantity": float(data.get("quantity", 3)),
        "cost": float(data.get("cost", 300.0)),
        "discount": float(data.get("discount", 10.0)),
        "marketing_spend": float(data.get("marketing_spend", 2000.0)),
        "customer_satisfaction": float(data.get("customer_satisfaction", 4.2)),
        "delivery_time": float(data.get("delivery_time", 3)),
        "returned": float(data.get("returned", 0)),
        "category_encoded": float(cat_enc),
        "region_encoded": float(reg_enc),
    }
    
    if model_registry.feature_names and "profit" in model_registry.feature_names:
        feature_order = model_registry.feature_names["profit"]
    else:
        feature_order = [
            "unit_price", "quantity", "cost", "discount", 
            "marketing_spend", "customer_satisfaction", "delivery_time", 
            "returned", "category_encoded", "region_encoded"
        ]
        
    ordered_values = [raw_dict.get(feat, 0.0) for feat in feature_order]
    X = np.array(ordered_values).reshape(1, -1)
    
    scaled = False
    if model_registry.scalers and "profit" in model_registry.scalers:
        try:
            X = model_registry.scalers["profit"].transform(X)
            scaled = True
        except Exception as e:
            logger.warning(f"Profit scaling error: {e}")
            
    return X, scaled

def preprocess_churn(data: Dict[str, Any]) -> Tuple[np.ndarray, bool]:
    """
    Strictly orders and scales features for the churn classification model.
    Expected features:
    ["age", "tenure_months", "purchase_frequency", "total_purchases",
     "average_order_value", "customer_satisfaction", "returned", 
     "discount", "delivery_time", "region_encoded"]
    """
    reg_enc = encode_region(data.get("region", "South"))
    
    raw_dict = {
        "age": float(data.get("age", 32)),
        "tenure_months": float(data.get("tenure_months", 14)),
        "purchase_frequency": float(data.get("purchase_frequency", 4)),
        "total_purchases": float(data.get("total_purchases", 18)),
        "average_order_value": float(data.get("average_order_value", 180.0)),
        "customer_satisfaction": float(data.get("customer_satisfaction", 3.8)),
        "returned": float(data.get("returned", 0)),
        "discount": float(data.get("discount", 10.0)),
        "delivery_time": float(data.get("delivery_time", 4)),
        "region_encoded": float(reg_enc)
    }
    
    if model_registry.feature_names and "churn" in model_registry.feature_names:
        feature_order = model_registry.feature_names["churn"]
    else:
        feature_order = [
            "age", "tenure_months", "purchase_frequency", "total_purchases",
            "average_order_value", "customer_satisfaction", "returned", 
            "discount", "delivery_time", "region_encoded"
        ]
        
    ordered_values = [raw_dict.get(feat, 0.0) for feat in feature_order]
    X = np.array(ordered_values).reshape(1, -1)
    
    scaled = False
    if model_registry.scalers and "churn" in model_registry.scalers:
        try:
            X = model_registry.scalers["churn"].transform(X)
            scaled = True
        except Exception as e:
            logger.warning(f"Churn scaling error: {e}")
            
    return X, scaled

def preprocess_segmentation(data: Dict[str, Any]) -> Tuple[np.ndarray, bool]:
    """
    Strictly orders and scales features for the customer segmentation model.
    Expected features:
    ["age", "tenure_months", "purchase_frequency", "total_purchases",
     "average_order_value", "customer_satisfaction", "discount"]
    """
    raw_dict = {
        "age": float(data.get("age", 38)),
        "tenure_months": float(data.get("tenure_months", 24)),
        "purchase_frequency": float(data.get("purchase_frequency", 8)),
        "total_purchases": float(data.get("total_purchases", 45)),
        "average_order_value": float(data.get("average_order_value", 420.0)),
        "customer_satisfaction": float(data.get("customer_satisfaction", 4.6)),
        "discount": float(data.get("discount", 8.0))
    }
    
    if model_registry.feature_names and "segmentation" in model_registry.feature_names:
        feature_order = model_registry.feature_names["segmentation"]
    else:
        feature_order = [
            "age", "tenure_months", "purchase_frequency", "total_purchases",
            "average_order_value", "customer_satisfaction", "discount"
        ]
        
    ordered_values = [raw_dict.get(feat, 0.0) for feat in feature_order]
    X = np.array(ordered_values).reshape(1, -1)
    
    scaled = False
    if model_registry.scalers and "segmentation" in model_registry.scalers:
        try:
            X = model_registry.scalers["segmentation"].transform(X)
            scaled = True
        except Exception as e:
            logger.warning(f"Segmentation scaling error: {e}")
            
    return X, scaled
