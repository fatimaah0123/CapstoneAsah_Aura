import os
import sys
import json
import numpy as np
import pandas as pd
import joblib

# --- Tambahkan path Pipeline ---
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../Pipeline'))

from preprocessing_pipeline import PreprocessingPipeline

# --- Load preprocessing pipeline ---
pkl_path = os.path.join(current_dir, '../Model/preprocessing_pipeline.pkl')
preprocessor = PreprocessingPipeline.load(pkl_path)

# --- Load RUL model ---
rul_model_path = os.path.join(current_dir, '../Model/rul_model.pkl')
rul_model = joblib.load(rul_model_path)

# --- Fungsi prediksi RUL ---
def predict_rul(data_list):
    # Transform data menjadi fitur
    if isinstance(data_list, dict):
        features = preprocessor.transform_single(data_list)
    elif isinstance(data_list, list):
        features = preprocessor.transform_batch(data_list)
    else:
        raise ValueError("Input harus dict atau list of dict")
    
    # Prediksi RUL
    rul_pred = rul_model.predict(features)
    
    # Kembalikan sebagai list agar JSON serializable
    return rul_pred.tolist()

# --- Eksekusi jika dipanggil via CLI / PythonShell ---
if __name__ == "__main__":
    input_json = sys.stdin.read()
    try:
        data_list = json.loads(input_json)
        output = predict_rul(data_list)
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
