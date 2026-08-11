import sys
from businessdecisions.components.data_ingestion import DataIngestion
from businessdecisions.components.data_validation import DataValidation
from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.logging.logger import logging
from businessdecisions.entity.config_entity import TrainingPipelineConfig,DataIngestionConfig,DataValidationConfig

if __name__=="__main__":
    try:
        module_name = sys.argv[1] if len(sys.argv) > 1 else "churn"

        training_pipeline_config = TrainingPipelineConfig(module_name)
        dataingestionconfig = DataIngestionConfig(training_pipeline_config, module_name)
        dataingestion = DataIngestion(dataingestionconfig)
        logging.info(f"Initiated the data ingestion for module: {module_name}")
        
        dataingestionartifact = dataingestion.initiate_data_ingestion()
        print(dataingestionartifact)

        data_validation_config = DataValidationConfig(training_pipeline_config, module_name)
        data_validation = DataValidation(dataingestionartifact, data_validation_config)
        logging.info("Initiating data validation")
        data_validation_artifact = data_validation.initiate_data_validation()
        print(data_validation_artifact)

    except Exception as e:
        raise BusinessDecisionException(e,sys)