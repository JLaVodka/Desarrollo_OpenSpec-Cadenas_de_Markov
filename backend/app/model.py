"""Mathematical model for a three-state first-order Markov chain."""

from collections.abc import Sequence

import numpy as np

STATES = ("P", "C", "A")
STATE_NAMES = ("Patrullando", "Persiguiendo", "Atacando")
HORIZONS = (1, 3, 5, 10)
INITIAL_STATE = np.array([1.0, 0.0, 0.0], dtype=float)
DEFAULT_MATRIX = np.array(
    [[0.75, 0.25, 0.0], [0.10, 0.60, 0.30], [0.20, 0.30, 0.50]],
    dtype=float,
)
ROW_SUM_TOLERANCE = 1e-12


class MatrixValidationError(ValueError):
    """Raised when a transition matrix is not a valid stochastic matrix."""


def validate_matrix(matrix: Sequence[Sequence[float]]) -> np.ndarray:
    """Return a numeric 3x3 stochastic matrix or raise a clear validation error."""
    try:
        values = np.asarray(matrix, dtype=float)
    except (TypeError, ValueError) as exc:
        raise MatrixValidationError("La matriz debe contener valores numéricos.") from exc

    if values.shape != (3, 3):
        raise MatrixValidationError("La matriz debe tener exactamente 3 filas y 3 columnas.")
    if not np.isfinite(values).all():
        raise MatrixValidationError("Todas las probabilidades deben ser números finitos.")
    if (values < 0).any() or (values > 1).any():
        raise MatrixValidationError("Cada probabilidad debe estar entre 0 y 1 inclusive.")

    row_sums = values.sum(axis=1)
    for index, row_sum in enumerate(row_sums, start=1):
        if not np.isclose(row_sum, 1.0, atol=ROW_SUM_TOLERANCE, rtol=0.0):
            raise MatrixValidationError(
                f"La fila {index} debe sumar 1; actualmente suma {row_sum:.12g}."
            )
    return values


def predict(matrix: Sequence[Sequence[float]]) -> dict[str, object]:
    """Calculate state distributions for the fixed academic prediction horizons."""
    transition = validate_matrix(matrix)
    predictions = []
    for steps in HORIZONS:
        distribution = INITIAL_STATE @ np.linalg.matrix_power(transition, steps)
        # Suppress harmless floating-point noise while preserving the mathematical result.
        distribution[np.abs(distribution) < 1e-15] = 0.0
        predictions.append(
            {"steps": steps, "probabilities": [float(value) for value in distribution]}
        )
    return {
        "initial_state": INITIAL_STATE.tolist(),
        "steps": list(HORIZONS),
        "predictions": predictions,
    }
