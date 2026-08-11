import sys
import os
import yaml
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from businessdecisions.entity.artifact_entity import (
    DataTransformationArtifact, DataValidationArtifact
)
from businessdecisions.entity.config_entity import DataTransformationConfig
from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.logging.logger import logging
from businessdecisions.utils.main_utils.utils import save_numpy_array_data, save_object


class DataTransformation:
    def __init__(self, data_validation_artifact: DataValidationArtifact,
                 data_transformation_config: DataTransformationConfig):
        try:
            self.data_validation_artifact = data_validation_artifact
            self.data_transformation_config = data_transformation_config
            self.module_name = data_transformation_config.module_name

            schema_path = f"data_schema/{self.module_name}_schema.yaml"
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

    def get_data_transformer_object(self) -> ColumnTransformer:
        logging.info("Building preprocessing pipeline from schema")
        try:
            numerical_cols = self.schema.get("numerical_columns", [])
            categorical_cols = self.schema.get("categorical_columns", [])

            num_pipeline = Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ])

            cat_pipeline = Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
            ])

            preprocessor = ColumnTransformer([
                ("num", num_pipeline, numerical_cols),
                ("cat", cat_pipeline, categorical_cols),
            ])
            return preprocessor
        except Exception as e:
            raise BusinessDecisionException(e, sys)

    def initiate_data_transformation(self) -> DataTransformationArtifact:
        logging.info(f"Starting data transformation for module: {self.module_name}")
        try:
            train_df = DataTransformation.read_data(self.data_validation_artifact.valid_train_file_path)
            test_df = DataTransformation.read_data(self.data_validation_artifact.valid_test_file_path)

            train_df = train_df.replace(r'^\s*$', np.nan, regex=True)
            test_df = test_df.replace(r'^\s*$', np.nan, regex=True)

            for col in self.schema.get("numerical_columns", []):
                if col in train_df.columns:
                    train_df[col] = pd.to_numeric(train_df[col], errors='coerce')
                if col in test_df.columns:
                    test_df[col] = pd.to_numeric(test_df[col], errors='coerce')

            target_column = self.schema["target_column"]
            drop_columns = self.schema.get("drop_columns", [])

            train_df = train_df.drop(columns=[c for c in drop_columns if c in train_df.columns])
            test_df = test_df.drop(columns=[c for c in drop_columns if c in test_df.columns])

            input_feature_train_df = train_df.drop(columns=[target_column], axis=1)
            target_feature_train_df = train_df[target_column]

            input_feature_test_df = test_df.drop(columns=[target_column], axis=1)
            target_feature_test_df = test_df[target_column]

            if target_feature_train_df.dtype == object:
                label_encoder = LabelEncoder()
                target_feature_train_df = label_encoder.fit_transform(target_feature_train_df)
                target_feature_test_df = label_encoder.transform(target_feature_test_df)
                save_object(
                    os.path.join(os.path.dirname(self.data_transformation_config.transformed_object_file_path), "label_encoder.pkl"),
                    label_encoder
                )

            preprocessor = self.get_data_transformer_object()
            preprocessor_object = preprocessor.fit(input_feature_train_df)

            transform_input_train_feature = preprocessor_object.transform(input_feature_train_df)
            transform_input_test_feature = preprocessor_object.transform(input_feature_test_df)

            train_arr = np.c_[transform_input_train_feature, np.array(target_feature_train_df)]
            test_arr = np.c_[transform_input_test_feature, np.array(target_feature_test_df)]

            save_numpy_array_data(self.data_transformation_config.transformed_train_file_path, array=train_arr)
            save_numpy_array_data(self.data_transformation_config.transformed_test_file_path, array=test_arr)
            save_object(self.data_transformation_config.transformed_object_file_path, preprocessor_object)

            data_transformation_artifact = DataTransformationArtifact(
                transformed_object_file_path=self.data_transformation_config.transformed_object_file_path,
                transformed_train_file_path=self.data_transformation_config.transformed_train_file_path,
                transformed_test_file_path=self.data_transformation_config.transformed_test_file_path
            )
            return data_transformation_artifact

        except Exception as e:
            raise BusinessDecisionException(e, sys)