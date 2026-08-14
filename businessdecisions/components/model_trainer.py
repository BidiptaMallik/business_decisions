import os
import sys
from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.logging.logger import logging
from businessdecisions.entity.artifact_entity import DataTransformationArtifact, ModelTrainerArtifact
from businessdecisions.entity.config_entity import ModelTrainerConfig
from businessdecisions.utils.main_utils.utils import (
    save_object, load_object, load_numpy_array_data,
    evaluate_classification_models, evaluate_regression_models
)
from businessdecisions.utils.ml_utils.metric.classification_metric import get_classification_score
from businessdecisions.utils.ml_utils.metric.regression_metric import get_regression_score
from businessdecisions.utils.ml_utils.model.estimator import BusinessModel
from businessdecisions.constant.training_pipeline import CLASSIFICATION_MODULES, REGRESSION_MODULES

from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import (
    RandomForestClassifier, RandomForestRegressor,
    GradientBoostingClassifier, GradientBoostingRegressor,
    AdaBoostClassifier,
)


import mlflow
import mlflow.sklearn 

class ModelTrainer:
    def __init__(self, model_trainer_config: ModelTrainerConfig, data_transformation_artifact: DataTransformationArtifact):
        try:
            self.model_trainer_config = model_trainer_config
            self.data_transformation_artifact = data_transformation_artifact
            self.module_name = model_trainer_config.module_name
        except Exception as e:
            raise BusinessDecisionException(e, sys)

    def train_model(self, x_train, y_train, x_test, y_test):
        try:
            print("\n" + "=" * 60)
            print(f"MODEL TRAINING STARTED: {self.module_name}")
            print("=" * 60)
            print(f"X_train shape: {x_train.shape}")
            print(f"X_test shape: {x_test.shape}")
            is_classification = self.module_name in CLASSIFICATION_MODULES

            if is_classification:
                models = {
                    "Random Forest": RandomForestClassifier(),
                    "Decision Tree": DecisionTreeClassifier(),
                    "Gradient Boosting": GradientBoostingClassifier(),
                    "Logistic Regression": LogisticRegression(max_iter=1000),
                    "AdaBoost": AdaBoostClassifier(),
                }
                params = {
                    "Decision Tree": {'criterion': ['gini', 'entropy']},
                    "Random Forest": {'n_estimators': [32, 64, 128]},
                    "Gradient Boosting": {'learning_rate': [.1, .05], 'n_estimators': [32, 64]},
                    "Logistic Regression": {},
                    "AdaBoost": {'learning_rate': [.1, .5], 'n_estimators': [32, 64]},
                }
                print("Starting classification model evaluation...")
                print("Models:", list(models.keys()))
                model_report = evaluate_classification_models(
                    X_train=x_train, y_train=y_train, X_test=x_test, y_test=y_test, models=models, param=params
                )
            else:
                models = {
                    "Random Forest": RandomForestRegressor(),
                    "Decision Tree": DecisionTreeRegressor(),
                    "Gradient Boosting": GradientBoostingRegressor(),
                    "Linear Regression": LinearRegression(),
                }
                params = {
                    "Decision Tree": {},
                    "Random Forest": {'n_estimators': [32, 64, 128]},
                    "Gradient Boosting": {'learning_rate': [.1, .05], 'n_estimators': [32, 64]},
                    "Linear Regression": {},
                }
                print("Starting regression model evaluation...")
                print("Models:", list(models.keys()))
                model_report = evaluate_regression_models(
                    X_train=x_train, y_train=y_train, X_test=x_test, y_test=y_test, models=models, param=params
                )

            best_model_score = max(model_report.values())
            best_model_name = max(model_report, key=model_report.get)
            best_model = models[best_model_name]

            logging.info(f"Best model for {self.module_name}: {best_model_name} (score={best_model_score:.4f})")

            y_train_pred = best_model.predict(x_train)
            y_test_pred = best_model.predict(x_test)

            if is_classification:
                train_metric = get_classification_score(y_true=y_train, y_pred=y_train_pred)
                test_metric = get_classification_score(y_true=y_test, y_pred=y_test_pred)
            else:
                train_metric = get_regression_score(y_true=y_train, y_pred=y_train_pred)
                test_metric = get_regression_score(y_true=y_test, y_pred=y_test_pred)

            self.track_mlflow(best_model, train_metric, run_name_suffix="train")
            self.track_mlflow(best_model, test_metric, run_name_suffix="test")

            preprocessor = load_object(file_path=self.data_transformation_artifact.transformed_object_file_path)
            model_dir_path = os.path.dirname(self.model_trainer_config.trained_model_file_path)
            os.makedirs(model_dir_path, exist_ok=True)

            business_model = BusinessModel(preprocessor=preprocessor, model=best_model)
            save_object(self.model_trainer_config.trained_model_file_path, obj=business_model)

            model_trainer_artifact = ModelTrainerArtifact(
                trained_model_file_path=self.model_trainer_config.trained_model_file_path,
                train_metric_artifact=train_metric,
                test_metric_artifact=test_metric
            )
            logging.info(f"Model trainer artifact: {model_trainer_artifact}")
            return model_trainer_artifact

        except Exception as e:
            raise BusinessDecisionException(e, sys)

    def initiate_model_trainer(self) -> ModelTrainerArtifact:
        try:
            train_file_path = self.data_transformation_artifact.transformed_train_file_path
            test_file_path = self.data_transformation_artifact.transformed_test_file_path

            train_arr = load_numpy_array_data(train_file_path)
            test_arr = load_numpy_array_data(test_file_path)

            x_train, y_train, x_test, y_test = (
                train_arr[:, :-1], train_arr[:, -1],
                test_arr[:, :-1], test_arr[:, -1],
            )
            return self.train_model(x_train, y_train, x_test, y_test)
        except Exception as e:
            raise BusinessDecisionException(e, sys)

    def track_mlflow(self,best_model,metric_artifact,run_name_suffix="train"):
        try:
            with mlflow.start_run(run_name=f"{self.module_name}_{run_name_suffix}"):
                mlflow.log_param("module",self.module_name)

                if hasattr(metric_artifact,"f1_score"):
                    mlflow.log_metric("f1_score", metric_artifact.f1_score)
                    mlflow.log_metric("precision", metric_artifact.precision_score)
                    mlflow.log_metric("recall_score", metric_artifact.recall_score)

                else:
                
                    mlflow.log_metric("r2_score", metric_artifact.r2_score)
                    mlflow.log_metric("mae", metric_artifact.mae)
                    mlflow.log_metric("rmse", metric_artifact.rmse)

                mlflow.sklearn.log_model(best_model, "model")
        except Exception as e:
            raise BusinessDecisionException(e, sys)