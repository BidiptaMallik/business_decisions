import os
import sys
import json

from dotenv import load_dotenv
load_dotenv()

MONGO_DB_URL=os.getenv("MONGO_DB_URL")


import certifi ## python package used by python library to secure a http connection
ca=certifi.where()

import pandas as pd 
import numpy as np
import pymongo
from businessdecisions.logging.logger import logging
from businessdecisions.exception.exception import BusinessDecisionException

class BusinessDecisionExtract():
    def __init__(self):
        try:
            self.mongo_client=pymongo.MongoClient(MONGO_DB_URL)
        except Exception as e:
            raise BusinessDecisionException(e,sys)
        
    def csv_to_json_converter(self,file_path):
        try:
            data=pd.read_csv(file_path,encoding='latin1',low_memory=False)
            data.reset_index(drop=True,inplace=True)
            records=list(json.loads(data.T.to_json()).values())
            return records
        except Exception as e:
            raise BusinessDecisionException(e,sys)
    def insert_data_mongodb(self, records, database, collection, batch_size=5000):
   
        try:
            db = self.mongo_client[database]
            coll = db[collection]
            total_inserted = 0
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                coll.insert_many(batch)
                total_inserted += len(batch)
                print(f"  Inserted {total_inserted}/{len(records)}...")
            return total_inserted
        except Exception as e:
            raise BusinessDecisionException(e, sys)
            
        
if __name__=="__main__":
    
    DATABASE = "BusinessDecisionData"
    DATASETS={
        "churn":("BusinessDecisionData/churn_data.csv", "ChurnData"),
        "pricing":("BusinessDecisionData/pricing_data.csv", "PricingData"),
        "market":("BusinessDecisionData/market_data.csv", "MarketData"),
        "supplychain":("BusinessDecisionData/supplychain_data1.csv", "SupplyChainData"),
    }
    
    extractor=BusinessDecisionExtract()
    for module_name,(file_path,collection_name) in DATASETS.items():
        try:
            print(f"\nProcessing: {module_name}")
            records=extractor.csv_to_json_converter(file_path=file_path)
            
            no_of_records=extractor.insert_data_mongodb(records,DATABASE,collection_name)
            print(no_of_records)
        except Exception as e:
            print(f"{module_name}: FAILED — {e}")

    