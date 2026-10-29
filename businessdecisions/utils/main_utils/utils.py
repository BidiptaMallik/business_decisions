import yaml
import os
import sys
import numpy as np
import dill
import pickle
import pandas as pd

from businessdecisions.exception.exception import BusinessDecisionException
from businessdecisions.logging.logger import logging

# Compatibility patch for older scikit-learn models serialized with sklearn <= 1.6
try:
    import sklearn.compose._column_transformer as _ct
    if not hasattr(_ct, '_RemainderColsList'):
        class _RemainderColsList(list):
            """Compatibility stub for older scikit-learn ColumnTransformer objects."""
            pass
        _ct._RemainderColsList = _RemainderColsList
except Exception:
    pass


def read_yaml_file(file_path: str) -> dict:
    try:
        with open(file_path, "rb") as yaml_file:
            return yaml.safe_load(yaml_file)
    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def write_yaml_file(file_path: str, content: object, replace: bool = False) -> None:
    try:
        if replace:
            if os.path.exists(file_path):
                os.remove(file_path)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w") as file:
            yaml.dump(content, file)
    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def save_numpy_array_data(file_path: str, array: np.array):
    try:
        dir_path = os.path.dirname(file_path)
        os.makedirs(dir_path, exist_ok=True)
        with open(file_path, "wb") as file_obj:
            np.save(file_obj, array)
    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def load_numpy_array_data(file_path: str) -> np.array:
    try:
        with open(file_path, "rb") as file_obj:
            return np.load(file_obj)
    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def save_object(file_path: str, obj: object) -> None:
    try:
        logging.info("Entered the save_object method of MainUtils class")
        dir_path = os.path.dirname(file_path)
        os.makedirs(dir_path, exist_ok=True)
        with open(file_path, "wb") as file_obj:
            dill.dump(obj, file_obj)
        logging.info("Exited the save_object method of MainUtils class")
    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def load_object(file_path: str) -> object:
    try:
        if not os.path.exists(file_path):
            raise Exception(f"The file: {file_path} does not exist")

        with open(file_path, "rb") as file_obj:
            try:
                return dill.load(file_obj)
            except Exception:
                file_obj.seek(0)
                try:
                    return pickle.load(file_obj)
                except Exception:
                    file_obj.seek(0)
                    import joblib
                    return joblib.load(file_obj)

    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def evaluate_classification_models(X_train, y_train, X_test, y_test, models, param):
    from sklearn.model_selection import GridSearchCV
    from sklearn.metrics import f1_score
    try:
        report = {}
        for name, model in models.items():
            para = param.get(name, {})
            gs = GridSearchCV(model, para, cv=3, verbose=2)
            gs.fit(X_train, y_train)
            model.set_params(**gs.best_params_)
            model.fit(X_train, y_train)
            y_test_pred = model.predict(X_test)
            report[name] = f1_score(y_test, y_test_pred, average="weighted")
        return report
    except Exception as e:
        raise BusinessDecisionException(e, sys)


def evaluate_regression_models(X_train, y_train, X_test, y_test, models, param):
    from sklearn.model_selection import GridSearchCV
    from sklearn.metrics import r2_score
    try:
        report = {}
        for name, model in models.items():
            para = param.get(name, {})
            gs = GridSearchCV(model, para, cv=3, verbose=2)
            gs.fit(X_train, y_train)
            model.set_params(**gs.best_params_)
            model.fit(X_train, y_train)
            y_test_pred = model.predict(X_test)
            report[name] = r2_score(y_test, y_test_pred)
        return report
    except Exception as e:
        raise BusinessDecisionException(e, sys)