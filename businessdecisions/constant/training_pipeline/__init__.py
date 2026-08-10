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