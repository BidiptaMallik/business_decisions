import sys
from businessdecisions.components.data_ingestion import DataIngestion
from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.logging.logger import logging
from businessdecisions.entity.config_entity import DataIngestionConfig
from businessdecisions.entity.config_entity import TrainingPipelineConfig

if __name__=="__main__":
    try:
        module_name = sys.argv[1] if len(sys.argv) > 1 else "churn"

        training_pipeline_config = TrainingPipelineConfig(module_name)
        dataingestionconfig = DataIngestionConfig(training_pipeline_config, module_name)
        dataingestion = DataIngestion(dataingestionconfig)
        logging.info(f"Initiated the data ingestion for module: {module_name}")
        
        dataingestionartifact = dataingestion.initiate_data_ingestion()
        print(dataingestionartifact)
    except Exception as e:
        raise BusinessDecisionException(e,sys)