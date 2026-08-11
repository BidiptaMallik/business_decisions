import os
import sys
import yaml
import pandas as pd

from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.logging.logger import logging
from businessdecisions.entity.artifact_entity import DataIngestionArtifact, DataValidationArtifact
from businessdecisions.entity.config_entity import DataValidationConfig


class DataValidation:
    def __init__(self, data_ingestion_artifact: DataIngestionArtifact, data_validation_config: DataValidationConfig):
        try:
            self.data_ingestion_artifact = data_ingestion_artifact
            self.data_validation_config = data_validation_config

            schema_path = f"data_schema/{data_validation_config.module_name}_schema.yaml"
            with open(schema_path, "r") as f:
                self.schema = yaml.safe_load(f)
        except Exception as e:
            raise BusinessDecisionException(e, sys)

    @staticmethod
    def read_data(file_path) -> pd.DataFrame:
        try:
            return pd.read_csv(file_path)
        except Exception as e:
            raise BusinessDecisionException(e, sys)

    def validate_number_of_columns(self, dataframe: pd.DataFrame) -> bool:
        expected_columns = [list(col.keys())[0] for col in self.schema["columns"]]
        actual_columns = list(dataframe.columns)
        logging.info(f"Expected columns: {len(expected_columns)}, Found: {len(actual_columns)}")
        return set(expected_columns).issubset(set(actual_columns))

    def initiate_data_validation(self) -> DataValidationArtifact:
        try:
            train_file_path = self.data_ingestion_artifact.trained_file_path
            test_file_path = self.data_ingestion_artifact.test_file_path

            train_dataframe = DataValidation.read_data(train_file_path)
            test_dataframe = DataValidation.read_data(test_file_path)

            status_train = self.validate_number_of_columns(train_dataframe)
            status_test = self.validate_number_of_columns(test_dataframe)
            validation_status = status_train and status_test

            if not validation_status:
                logging.warning("Column validation failed — check schema vs actual dataset columns")

            os.makedirs(self.data_validation_config.valid_data_dir, exist_ok=True)
            os.makedirs(self.data_validation_config.invalid_data_dir, exist_ok=True)

            if validation_status:
                train_dataframe.to_csv(self.data_validation_config.valid_train_file_path, index=False, header=True)
                test_dataframe.to_csv(self.data_validation_config.valid_test_file_path, index=False, header=True)
            else:
                train_dataframe.to_csv(self.data_validation_config.invalid_train_file_path, index=False, header=True)
                test_dataframe.to_csv(self.data_validation_config.invalid_test_file_path, index=False, header=True)

            data_validation_artifact = DataValidationArtifact(
                validation_status=validation_status,
                valid_train_file_path=self.data_validation_config.valid_train_file_path if validation_status else None,
                valid_test_file_path=self.data_validation_config.valid_test_file_path if validation_status else None,
                invalid_train_file_path=self.data_validation_config.invalid_train_file_path if not validation_status else None,
                invalid_test_file_path=self.data_validation_config.invalid_test_file_path if not validation_status else None,
                drift_report_file_path=self.data_validation_config.drift_report_file_path,
            )
            return data_validation_artifact

        except Exception as e:
            raise BusinessDecisionException(e, sys)