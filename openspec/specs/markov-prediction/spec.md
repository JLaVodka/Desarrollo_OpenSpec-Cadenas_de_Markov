# markov-prediction Specification

## Purpose
Define el comportamiento observable del modelo probabilístico de tres estados y los resultados de predicción que permiten explicar una cadena de Markov homogénea de primer orden.

## Requirements

### Requirement: El modelo define tres estados ordenados
El sistema SHALL usar únicamente los estados P (Patrullando), C (Persiguiendo) y A (Atacando), en ese orden para filas, columnas y distribuciones.

#### Scenario: Estados disponibles
- **WHEN** se presenta o calcula una distribución
- **THEN** sus componentes corresponden en orden a P, C y A

### Requirement: El modelo acepta únicamente matrices de transición válidas
El sistema SHALL aceptar una matriz 3×3 cuyos valores sean finitos, estén entre 0 y 1 inclusive y cuyas filas sumen 1 con tolerancia absoluta máxima de 1e-12.

#### Scenario: Matriz válida
- **WHEN** se presenta una matriz 3×3 no negativa, acotada y con cada fila sumando 1 dentro de tolerancia
- **THEN** el modelo la acepta

#### Scenario: Matriz con dimensiones incorrectas
- **WHEN** una matriz no tiene tres filas o alguna fila no tiene tres valores
- **THEN** el modelo la rechaza como inválida

#### Scenario: Probabilidad fuera de rango o no finita
- **WHEN** una entrada es negativa, mayor que 1, NaN o infinita
- **THEN** el modelo la rechaza como inválida

#### Scenario: Fila que no suma uno
- **WHEN** una fila se desvía de 1 por más de 1e-12
- **THEN** el modelo la rechaza como inválida

### Requirement: El modelo calcula distribuciones en horizontes fijos
El sistema SHALL iniciar en S₀=[1,0,0] y devolver Sₙ=S₀×Pⁿ para n en [1,3,5,10], reutilizando la misma matriz en cada paso.

#### Scenario: Predicción con la matriz predeterminada
- **WHEN** se calcula usando [[0.75,0.25,0],[0.10,0.60,0.30],[0.20,0.30,0.50]]
- **THEN** las distribuciones en pasos 1, 3, 5 y 10, en orden P/C/A, son aproximadamente [0.75,0.25,0], [0.489375,0.371875,0.13875], [0.39887344,0.39452969,0.20659687] y [0.35746622,0.40273584,0.23979794], con tolerancia absoluta 1e-7

#### Scenario: Distribuciones conservan probabilidad
- **WHEN** se calcula una distribución para una matriz válida
- **THEN** todos sus componentes están entre 0 y 1 y su suma es 1 dentro de tolerancia numérica 1e-9

#### Scenario: La distribución representa el estado en un paso
- **WHEN** se interpreta el resultado en el horizonte n
- **THEN** cada valor representa la probabilidad de estar en el estado correspondiente después de n pasos y no la probabilidad acumulada de haberlo visitado

### Requirement: Las transiciones satisfacen la propiedad de Markov de primer orden
La probabilidad de transición al siguiente estado SHALL depender únicamente del estado actual y la matriz SHALL permanecer igual en todos los pasos de una predicción.

#### Scenario: Transición homogénea de primer orden
- **WHEN** el proceso llega al estado i en el paso n
- **THEN** las probabilidades para el siguiente estado j son las de la fila i de la misma matriz, independientemente de la trayectoria previa
