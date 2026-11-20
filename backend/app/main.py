"""FastAPI application for Markov-chain prediction."""

from typing import Annotated

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.model import MatrixValidationError, predict, validate_matrix

app = FastAPI(
    title="Enemy Behavior Predictor API",
    description="Predicción académica con una cadena de Markov de tres estados.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=False,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    matrix: Annotated[list[list[float]], Field(description="Matriz 3x3 en orden P, C, A")]

    @field_validator("matrix")
    @classmethod
    def matrix_must_be_valid(cls, value: list[list[float]]) -> list[list[float]]:
        try:
            validate_matrix(value)
        except MatrixValidationError as exc:
            raise ValueError(str(exc)) from exc
        return value


class PredictionItem(BaseModel):
    steps: int
    probabilities: list[float]


class PredictionResponse(BaseModel):
    initial_state: list[float]
    steps: list[int]
    predictions: list[PredictionItem]


@app.post("/api/predict", response_model=PredictionResponse)
def create_prediction(request: PredictionRequest) -> dict[str, object]:
    try:
        return predict(request.matrix)
    except MatrixValidationError as exc:
        # Defensive guard: request validation should have rejected this already.
        raise HTTPException(status_code=422, detail=str(exc)) from exc
