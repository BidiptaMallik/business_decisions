import sys
import numpy as np
from businessdecisions.entity.artifact_entity import RegressionMetricArtifact
from businessdecisions.exception.exception import BusinessDecisionException
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

def get_regression_score(y_true, y_pred) -> RegressionMetricArtifact:
    try:
        r2 = r2_score(y_true, y_pred)
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        return RegressionMetricArtifact(r2_score=r2, mae=mae, rmse=rmse)
    except Exception as e:
        raise BusinessDecisionException(e, sys)