import os
import sys
import numpy as np
import dill

from businessdecisions.exception.exception import BusinessDecisionException


def save_numpy_array_data(file_path: str, array: np.array):
    try:
        dir_path = os.path.dirname(file_path)
        os.makedirs(dir_path, exist_ok=True)
        with open(file_path, "wb") as file_obj:
            np.save(file_obj, array)
    except Exception as e:
        raise BusinessDecisionException(e, sys)


def save_object(file_path: str, obj: object):
    try:
        dir_path = os.path.dirname(file_path)
        os.makedirs(dir_path, exist_ok=True)
        with open(file_path, "wb") as file_obj:
            dill.dump(obj, file_obj)
    except Exception as e:
        raise BusinessDecisionException(e, sys)

def load_object(file_path: str) -> object:
    try:
        if not os.path.exists(file_path):
            raise Exception(f"The file: {file_path} does not exist")
        with open(file_path, "rb") as file_obj:
            return dill.load(file_obj)
    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def load_numpy_array_data(file_path: str) -> np.array:
    try:
        with open(file_path, "rb") as file_obj:
            return np.load(file_obj)
    except Exception as e:
        raise BusinessDecisionException(e, sys) from e


def evaluate_classification_models(X_train, y_train, X_test, y_test, models, param):
    from sklearn.model_selection import GridSearchCV
    from sklearn.metrics import f1_score
    try:
        report = {}
        for name, model in models.items():
            para = param.get(name, {})
            gs = GridSearchCV(model, para, cv=3)
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
            gs = GridSearchCV(model, para, cv=3)
            gs.fit(X_train, y_train)
            model.set_params(**gs.best_params_)
            model.fit(X_train, y_train)
            y_test_pred = model.predict(X_test)
            report[name] = r2_score(y_test, y_test_pred)
        return report
    except Exception as e:
        raise BusinessDecisionException(e, sys)