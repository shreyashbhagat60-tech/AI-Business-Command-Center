import math
from typing import Any, Dict, List, Union

def safe_divide(numerator: Union[int, float], denominator: Union[int, float], default: float = 0.0) -> float:
    """Safely divide two numbers handling division by zero and None."""
    try:
        if denominator is None or numerator is None:
            return default
        if abs(float(denominator)) < 1e-9:
            return default
        res = float(numerator) / float(denominator)
        if math.isnan(res) or math.isinf(res):
            return default
        return round(res, 2)
    except Exception:
        return default

def format_currency(amount: Union[int, float], symbol: str = "₹") -> str:
    """Format numeric amount into human-readable currency with K/M/B suffixes."""
    if amount is None or math.isnan(amount):
        return f"{symbol}0"
    
    val = float(amount)
    sign = "-" if val < 0 else ""
    val = abs(val)
    
    if val >= 1_000_000_000:
        return f"{sign}{symbol}{val / 1_000_000_000:.2f}B"
    elif val >= 1_000_000:
        return f"{sign}{symbol}{val / 1_000_000:.2f}M"
    elif val >= 1_000:
        return f"{sign}{symbol}{val / 1_000:.2f}K"
    else:
        return f"{sign}{symbol}{val:.2f}"

def calculate_percentage_growth(current: float, previous: float) -> float:
    """Calculate percentage growth from previous to current period."""
    if previous is None or previous == 0:
        return 0.0
    growth = ((current - previous) / abs(previous)) * 100.0
    return round(growth, 2)
