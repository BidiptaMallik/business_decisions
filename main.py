import sys
from businessdecisions.components.data_ingestion import DataIngestion
from businessdecisions.components.data_validation import DataValidation
from businessdecisions.components.data_transformation import DataTransformation
from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.components.model_trainer import ModelTrainer
from businessdecisions.logging.logger import logging
from businessdecisions.entity.config_entity import TrainingPipelineConfig,DataIngestionConfig,DataValidationConfig,DataTransformationConfig,ModelTrainerConfig


    
        
def run_pipeline(module_name):
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

        data_transformation_config=DataTransformationConfig(training_pipeline_config,module_name)
        data_transformation=DataTransformation(data_validation_artifact,data_transformation_config)
        logging.info("Initiating data transformation")
        data_transformation_artifact=data_transformation.initiate_data_transformation()
        print(data_transformation_artifact)

        model_trainer_config = ModelTrainerConfig(training_pipeline_config, module_name)
        model_trainer = ModelTrainer(model_trainer_config, data_transformation_artifact)
        model_trainer_artifact = model_trainer.initiate_model_trainer()
        print(model_trainer_artifact)


if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            # single module: python main.py churn
            run_pipeline(sys.argv[1])
        else:
            # no argument: run all 4
            for module in ["churn", "pricing", "market", "supplychain"]:
                print(f"\n{'='*60}\nRunning: {module}\n{'='*60}\n")
                run_pipeline(module)

    
    except Exception as e:
        raise BusinessDecisionException(e,sys)