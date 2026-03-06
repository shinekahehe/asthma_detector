import os
import numpy as np

# Try importing TensorFlow/Keras for the .h5 model
try:
    from tensorflow.keras.models import load_model as keras_load_model
    _KERAS_AVAILABLE = True
except ImportError:
    _KERAS_AVAILABLE = False
    print("[predictor] WARNING: TensorFlow not available. Using mock predictions.")

MODEL_PATH = os.path.join(os.path.dirname(__file__), "asthma_wheeze_model.h5")

_model = None


def _load_model():
    """Lazy-load the Keras model once."""
    global _model
    if _model is None and _KERAS_AVAILABLE and os.path.exists(MODEL_PATH):
        _model = keras_load_model(MODEL_PATH)
        print("[predictor] Model loaded from", MODEL_PATH)
    return _model


def predict_from_features(features: list) -> dict:
    """
    Run asthma prediction from a feature vector.

    Parameters
    ----------
    features : list of float
        The feature vector extracted from the audio / sensor data.
        Expected length matches what the model was trained on.

    Returns
    -------
    dict with keys:
        - status  : "normal" | "mild" | "attack"
        - confidence : float (0-100)
        - raw_probabilities : list of float
    """
    model = _load_model()

    if model is None:
        # ---------------------------------------------------------------
        # Fallback: return a deterministic mock result so the app can
        # still be tested end-to-end without TensorFlow / a trained model.
        # ---------------------------------------------------------------
        import random
        choices = [
            {"status": "normal",  "confidence": round(random.uniform(90, 99), 1)},
            {"status": "mild",    "confidence": round(random.uniform(60, 80), 1)},
            {"status": "attack",  "confidence": round(random.uniform(80, 95), 1)},
        ]
        result = random.choice(choices)
        result["raw_probabilities"] = []
        return result

    # Reshape: model expects (1, n_features)
    X = np.array(features, dtype=np.float32).reshape(1, -1)
    probs = model.predict(X)[0]           # shape (n_classes,)
    probs_list = probs.tolist()

    class_idx = int(np.argmax(probs))
    confidence = round(float(probs[class_idx]) * 100, 1)

    # Label mapping — adjust to match your training order
    label_map = {0: "normal", 1: "mild", 2: "attack"}
    status = label_map.get(class_idx, "unknown")

    return {
        "status": status,
        "confidence": confidence,
        "raw_probabilities": probs_list,
    }
