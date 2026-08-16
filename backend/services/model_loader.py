import os
import logging
import joblib

logger = logging.getLogger("ai_command_center.model_loader")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class ModelRegistry:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_names = {}
        self.status = {
            "sales": False,
            "profit": False,
            "churn": False,
            "segmentation": False,
            "scalers_loaded": False,
            "encoders_loaded": False,
            "feature_names_loaded": False
        }
        self.load_all()

    def load_all(self):
        """Safely load all ML models, scalers, encoders, and feature orderings."""
        logger.info(f"Loading ML models from: {MODELS_DIR}")
        
        # 1. Feature Names
        feat_path = os.path.join(MODELS_DIR, "feature_names.pkl")
        if os.path.exists(feat_path):
            try:
                self.feature_names = joblib.load(feat_path)
                self.status["feature_names_loaded"] = True
                logger.info("Loaded feature_names.pkl")
            except Exception as e:
                logger.warning(f"Failed to load feature_names.pkl: {e}")

        # 2. Scalers
        scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
        if os.path.exists(scaler_path):
            try:
                self.scalers = joblib.load(scaler_path)
                self.status["scalers_loaded"] = True
                logger.info("Loaded scaler.pkl")
            except Exception as e:
                logger.warning(f"Failed to load scaler.pkl: {e}")

        # 3. Encoders
        encoder_path = os.path.join(MODELS_DIR, "encoder.pkl")
        if os.path.exists(encoder_path):
            try:
                self.encoders = joblib.load(encoder_path)
                self.status["encoders_loaded"] = True
                logger.info("Loaded encoder.pkl")
            except Exception as e:
                logger.warning(f"Failed to load encoder.pkl: {e}")

        # 4. Models
        model_files = {
            "sales": "sales_model.pkl",
            "profit": "profit_model.pkl",
            "churn": "churn_model.pkl",
            "segmentation": "segmentation_model.pkl"
        }

        for key, filename in model_files.items():
            model_path = os.path.join(MODELS_DIR, filename)
            if os.path.exists(model_path):
                try:
                    self.models[key] = joblib.load(model_path)
                    self.status[key] = True
                    logger.info(f"Successfully loaded model: {filename}")
                except Exception as e:
                    self.status[key] = False
                    logger.warning(f"Could not load model {filename}: {e}")
            else:
                self.status[key] = False
                logger.info(f"Model file not found (will use fallback demo mode): {filename}")

    def get_model(self, model_key: str):
        return self.models.get(model_key)

    def is_model_available(self, model_key: str) -> bool:
        return self.status.get(model_key, False)

    def get_status(self):
        return {
            "models": {
                "sales_model": "CONNECTED" if self.status["sales"] else "NOT AVAILABLE",
                "profit_model": "CONNECTED" if self.status["profit"] else "NOT AVAILABLE",
                "churn_model": "CONNECTED" if self.status["churn"] else "NOT AVAILABLE",
                "segmentation_model": "CONNECTED" if self.status["segmentation"] else "NOT AVAILABLE",
            },
            "auxiliary": {
                "scalers": "CONNECTED" if self.status["scalers_loaded"] else "NOT AVAILABLE",
                "encoders": "CONNECTED" if self.status["encoders_loaded"] else "NOT AVAILABLE",
                "feature_names": "CONNECTED" if self.status["feature_names_loaded"] else "NOT AVAILABLE"
            },
            "models_ready_count": sum(1 for k in ["sales", "profit", "churn", "segmentation"] if self.status[k]),
            "total_models": 4
        }

# Global singleton registry
model_registry = ModelRegistry()
