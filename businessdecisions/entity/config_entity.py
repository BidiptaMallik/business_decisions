from datetime import datetime
import os 
from businessdecisions.constant import training_pipeline

class TrainingPipelineConfig:
    def __init__(self,module_name,timestamp=datetime.now()):
        timestamp=timestamp.strftime("%m_%d_%Y_%H_%M_%S")
        self.pipeline_name=training_pipeline.PIPELINE_NAME
        self.artifact_name=training_pipeline.ARTIFACT_DIR
        self.artifact_dir = os.path.join(
            self.artifact_name,
            module_name,
            timestamp
        )
        self.timestamp: str=timestamp

class DataIngestionConfig:
    def __init__(self,training_pipeline_config:TrainingPipelineConfig, module_name: str):
        module_settings = training_pipeline.MODULE_CONFIG[module_name]

        self.data_ingestion_dir:str=os.path.join(
            training_pipeline_config.artifact_dir,training_pipeline.DATA_INGESTION_DIR_NAME
        )
        self.feature_store_file_path:str=os.path.join(
            self.data_ingestion_dir,training_pipeline.DATA_INGESTION_FEATURE_STORE_DIR,training_pipeline.FILE_NAME
        )
        self.training_file_path:str=os.path.join(
            self.data_ingestion_dir,training_pipeline.DATA_INGESTION_INGESTED_DIR,training_pipeline.TRAIN_FILE_NAME
        )
        self.testing_file_path:str=os.path.join(
            self.data_ingestion_dir,training_pipeline.DATA_INGESTION_INGESTED_DIR,training_pipeline.TEST_FILE_NAME
        )
        
        self.train_test_split_ratio: float=training_pipeline.DATA_INGESTION_TRAIN_SPLIT_RATIO
        self.collection_name: str = module_settings["collection_name"]
        self.database_name: str=training_pipeline.DATA_INGESTION_DATABASE_NAME
        self.target_column: str = module_settings["target_column"]
        self.module_name: str = module_name