import sys
import os
import pandas as pd
from typing import Dict, Any
from catboost import CatBoostRegressor
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
from uvicorn import run as app_run
from pydantic import BaseModel

from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.logging.logger import logging
from businessdecisions.utils.main_utils.utils import load_object

try:
    import sklearn.compose._column_transformer as _ct
    if not hasattr(_ct, '_RemainderColsList'):
        class _RemainderColsList(list):
            """Compatibility stub for older scikit-learn ColumnTransformer objects."""
            pass
        _ct._RemainderColsList = _RemainderColsList
except Exception:
    pass

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="./templates")


@app.exception_handler(BusinessDecisionException)
async def business_exception_handler(request: Request, exc: BusinessDecisionException):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc)}
    )



MODEL_PATHS = {
    "churn": {
        "format": "wrapped",
        "model": "models/churn/model.pkl",
    },
    "market": {
        "format": "wrapped",
        "model": "models/market/model.pkl",
    },
    "pricing": {
    "format": "catboost",
    "model": "models/pricing/quantity_prediction_model.cbm",
    },
    "supplychain": {
    "format": "separate",
    "model": "models/supplychain/best_model.pkl",
    "preprocessor": "models/supplychain/preprocessor (2).pkl",
},
}


def run_prediction(module_name: str, df: pd.DataFrame):
    """Shared prediction logic used by both endpoints below."""

    config = MODEL_PATHS[module_name]

    if not os.path.exists(config["model"]):
        raise FileNotFoundError(
            f"Model file not found at {config['model']} "
            f"for module '{module_name}'."
        )

    if config["format"] == "catboost":

        model = CatBoostRegressor()
        model.load_model(config["model"])

        model_features = model.feature_names_

        missing_features = [
            col for col in model_features
            if col not in df.columns
        ]

        if missing_features:
            raise ValueError(
                f"Missing features for pricing model: {missing_features}"
            )

        df = df[model_features]

        y_pred = model.predict(df)

        model = CatBoostRegressor()
        model.load_model(config["model"])

        print("MODEL FEATURES:", model.feature_names_)
        print("CAT FEATURES:", model.get_cat_feature_indices())

    
    elif config["format"] == "wrapped":

        business_model = load_object(config["model"])
        y_pred = business_model.predict(df)

    elif config["format"] == "separate":

        if not os.path.exists(config["preprocessor"]):
            raise FileNotFoundError(
                f"Preprocessor file not found at "
                f"{config['preprocessor']} "
                f"for module '{module_name}'."
            )

        model = load_object(config["model"])
        preprocessor = load_object(config["preprocessor"])

        x_transformed = preprocessor.transform(df)
        y_pred = model.predict(x_transformed)

    else:
        raise ValueError(
            f"Unknown model format: {config['format']}"
        )

    return y_pred


def decode_prediction(module_name: str, prediction):
    """
    Reverse LabelEncoder-encoded predictions back to human-readable text
    (e.g. 0 -> "No", 1 -> "Yes") when a label_encoder.pkl exists for the module.
    Modules with a numeric target (pricing, supplychain) have no encoder and
    are returned as-is.
    """
    label_encoder_path = f"models/{module_name}/label_encoder.pkl"
    if os.path.exists(label_encoder_path):
        label_encoder = load_object(label_encoder_path)
        return label_encoder.inverse_transform([int(prediction)])[0]
    return prediction


@app.get("/", tags=["authentication"])
async def index():
    return RedirectResponse(url="/docs")



class PredictionInput(BaseModel):
    data: Dict[str, Any]


@app.post("/predict-single/{module_name}")
async def predict_single_route(module_name: str, input_data: PredictionInput):
    """
    Single prediction using manually entered field values — no file upload.

    Example body for churn:
    {
      "data": {
        "gender": "Male",
        "SeniorCitizen": 0,
        "Partner": "Yes",
        "Dependents": "No",
        "tenure": 12,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "DSL",
        "OnlineSecurity": "Yes",
        "OnlineBackup": "No",
        "DeviceProtection": "Yes",
        "TechSupport": "No",
        "StreamingTV": "No",
        "StreamingMovies": "No",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 55.5,
        "TotalCharges": 650.3
      }
    }
    """
    try:
        if module_name not in MODEL_PATHS:
            return {"error": f"Unknown module: {module_name}. Valid options: {list(MODEL_PATHS.keys())}"}

        df = pd.DataFrame([input_data.data])
        y_pred = run_prediction(module_name, df)
        prediction = decode_prediction(module_name, y_pred[0])

        return {
            "module": module_name,
            "prediction": str(prediction),
            "input": input_data.data
        }
    except Exception as e:
        raise BusinessDecisionException(e, sys)



@app.post("/predict-batch/{module_name}")
async def predict_batch_route(module_name: str, request: Request, file: UploadFile = File(...)):
    """
    Upload a CSV and get predictions for every row, rendered as an HTML table.
    """
    try:
        if module_name not in MODEL_PATHS:
            return Response(f"Unknown module: {module_name}. Valid options: {list(MODEL_PATHS.keys())}")

        df = pd.read_csv(file.file)
        y_pred = run_prediction(module_name, df)
        df['predicted_column'] = [decode_prediction(module_name, p) for p in y_pred]

        os.makedirs("prediction_output", exist_ok=True)
        df.to_csv(f"prediction_output/{module_name}_output.csv", index=False)

        table_html = df.head(50).to_html(classes='table table-striped')
        return templates.TemplateResponse(
            name="table.html",
            request=request,
            context={"table": table_html}
        )
    except Exception as e:
        raise BusinessDecisionException(e, sys)


if __name__ == "__main__":
    app_run(app, host="localhost", port=8000)