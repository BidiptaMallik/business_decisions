import os 
import sys
import numpy as np
import pandas as pd


PIPELINE_NAME: str="BusinessDecisions"
ARTIFACT_DIR: str="Artifacts"
FILE_NAME:str ="data.csv"
TRAIN_FILE_NAME: str="train.csv"
TEST_FILE_NAME: str="test.csv"


DATA_INGESTION_DATABASE_NAME: str="BusinessDecisionData"
DATA_INGESTION_DIR_NAME: str="data_ingestion"
DATA_INGESTION_FEATURE_STORE_DIR: str="feature_store"
DATA_INGESTION_INGESTED_DIR: str="ingested"
DATA_INGESTION_TRAIN_SPLIT_RATIO: float=0.2

MODULE_CONFIG = {
    "churn": {
        "collection_name": "ChurnData",
        "target_column": "Churn",
    },
    "pricing": {
        "collection_name": "PricingData",
        "target_column": "UnitPrice",
    },
    "market": {
        "collection_name": "MarketData",
        "target_column": "status",
    },
    "supplychain": {
        "collection_name": "SupplyChainData",   
        "target_column": "Late_delivery_risk",
    },
}


DATA_VALIDATION_DIR_NAME: str = "data_validation"
DATA_VALIDATION_VALID_DIR: str = "validated"
DATA_VALIDATION_INVALID_DIR: str = "invalid"
DATA_VALIDATION_DRIFT_REPORT_DIR: str = "drift_report"
DATA_VALIDATION_DRIFT_REPORT_FILE_NAME: str = "report.yaml"

DATA_TRANSFORMATION_DIR_NAME: str = "data_transformation"
DATA_TRANSFORMATION_TRANSFORMED_DATA_DIR: str = "transformed"
DATA_TRANSFORMATION_TRANSFORMED_OBJECT_DIR: str = "transformed_object"
TRANSFORMED_TRAIN_FILE_NAME: str = "train.npy"
TRANSFORMED_TEST_FILE_NAME: str = "test.npy"
PREPROCESSING_OBJECT_FILE_NAME: str = "preprocessing.pkl"


MODEL_TRAINER_DIR_NAME: str = "model_trainer"
MODEL_TRAINER_TRAINED_MODEL_DIR: str = "trained_model"
MODEL_TRAINER_TRAINED_MODEL_NAME: str = "model.pkl"
MODEL_TRAINER_EXPECTED_SCORE: float = 0.6
MODEL_TRAINER_OVER_FITTING_UNDER_FITTING_THRESHOLD: float = 0.05

# which modules are classification vs regression
CLASSIFICATION_MODULES = ["churn", "market", "supplychain"]
REGRESSION_MODULES = ["pricing"]