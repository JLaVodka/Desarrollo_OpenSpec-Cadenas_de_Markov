# Spec Delta

## Purpose

Ofrecer un contrato HTTP sencillo para que una interfaz cliente solicite distribuciones válidas del modelo y reciba resultados o errores de validación comprensibles.

## ADDED Requirements

### Requirement: La API calcula predicciones desde una matriz recibida
La API SHALL exponer POST `/api/predict`, recibir un objeto JSON con `matrix` como matriz 3×3 de probabilidades en proporciones y devolver las distribuciones de los horizontes fijos.

#### Scenario: Solicitud válida
- **WHEN** el cliente envía una matriz válida a POST `/api/predict`
- **THEN** la API responde HTTP 200 con el estado inicial, los pasos [1,3,5,10] y una distribución P/C/A para cada paso

#### Scenario: Solicitud sin matriz o mal formada
- **WHEN** el cuerpo no contiene `matrix` o su estructura no es 3×3 numérica
- **THEN** la API responde HTTP 422 con un detalle que identifica la entrada inválida

#### Scenario: Solicitud con probabilidades o sumas inválidas
- **WHEN** la matriz incluye un valor fuera de [0,1], no finito o una fila que no suma 1 dentro de 1e-12
- **THEN** la API responde HTTP 422 con un mensaje claro y no devuelve predicciones

### Requirement: La API mantiene fijos el estado inicial y los horizontes
La API SHALL calcular desde `[1,0,0]` y devolver exactamente los pasos `[1,3,5,10]`, sin aceptar parámetros para cambiarlos.

#### Scenario: Parámetros de cálculo
- **WHEN** la API responde a una solicitud válida
- **THEN** la respuesta informa el estado inicial fijo y exactamente cuatro resultados para 1, 3, 5 y 10 pasos

### Requirement: La API permite la comunicación local desde el frontend
Durante desarrollo, la API SHALL permitir mediante CORS las solicitudes del origen local configurado para el frontend.

#### Scenario: Solicitud desde el frontend local
- **WHEN** el navegador frontend realiza una solicitud desde el origen de desarrollo permitido
- **THEN** la política CORS permite la solicitud HTTP al endpoint
