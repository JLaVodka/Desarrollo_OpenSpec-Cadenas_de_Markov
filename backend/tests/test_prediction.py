import numpy as np
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.model import DEFAULT_MATRIX, HORIZONS, MatrixValidationError, predict, validate_matrix

client = TestClient(app)


def test_default_matrix_matches_reference_distributions():
    result = predict(DEFAULT_MATRIX)
    expected = {
        1: [0.75, 0.25, 0.0],
        3: [0.489375, 0.371875, 0.13875],
        5: [0.3988734375, 0.3945296875, 0.206596875],
        10: [0.35746622, 0.40273584, 0.23979794],
    }
    assert result["steps"] == list(HORIZONS)
    for item in result["predictions"]:
        assert np.allclose(item["probabilities"], expected[item["steps"]], atol=1e-7)


def test_valid_custom_matrix_is_accepted():
    matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    assert np.array_equal(validate_matrix(matrix), np.eye(3))


@pytest.mark.parametrize(
    "matrix",
    [
        [[-0.1, 1.1, 0], [0, 1, 0], [0, 0, 1]],
        [[1.01, -0.01, 0], [0, 1, 0], [0, 0, 1]],
        [[0.5, 0.4, 0], [0, 1, 0], [0, 0, 1]],
        [[1, 0], [0, 1, 0], [0, 0, 1]],
        [[float("nan"), 0, 0], [0, 1, 0], [0, 0, 1]],
    ],
)
def test_invalid_matrices_are_rejected(matrix):
    with pytest.raises(MatrixValidationError):
        validate_matrix(matrix)


def test_every_distribution_is_a_probability_vector():
    for item in predict(DEFAULT_MATRIX)["predictions"]:
        values = np.asarray(item["probabilities"])
        assert (values >= 0).all()
        assert np.isclose(values.sum(), 1, atol=1e-9)


def test_prediction_endpoint_returns_fixed_contract():
    response = client.post("/api/predict", json={"matrix": DEFAULT_MATRIX.tolist()})
    assert response.status_code == 200
    body = response.json()
    assert body["initial_state"] == [1, 0, 0]
    assert body["steps"] == [1, 3, 5, 10]
    assert len(body["predictions"]) == 4


@pytest.mark.parametrize(
    "matrix",
    [
        [[-0.1, 1.1, 0], [0, 1, 0], [0, 0, 1]],
        [[1.01, -0.01, 0], [0, 1, 0], [0, 0, 1]],
        [[0.5, 0.4, 0], [0, 1, 0], [0, 0, 1]],
    ],
)
def test_prediction_endpoint_rejects_invalid_matrix(matrix):
    response = client.post("/api/predict", json={"matrix": matrix})
    assert response.status_code == 422
    assert "detail" in response.json()


def test_prediction_endpoint_rejects_missing_matrix():
    response = client.post("/api/predict", json={})
    assert response.status_code == 422
