# Enemy Behavior Predictor

Aplicación web académica para explorar una cadena de Markov homogénea de primer orden aplicada al comportamiento hipotético de un enemigo genérico.

## Objetivo académico

La aplicación permite editar una matriz de transición válida y observar la distribución probabilística del estado del modelo después de 1, 3, 5 y 10 ciclos de decisión. Los valores son supuestos ilustrativos: no describen un videojuego real ni constituyen una IA de juego.

## Modelo de Markov

Los estados se mantienen en este orden en filas, columnas, vectores y respuestas:

| Símbolo | Estado |
|---|---|
| P | Patrullando |
| C | Persiguiendo |
| A | Atacando |

La matriz predeterminada es:

```text
       P     C     A
P   0.75  0.25  0.00
C   0.10  0.60  0.30
A   0.20  0.30  0.50
```

Cada fila expresa la probabilidad del estado siguiente condicionado al actual. Las filas deben sumar 1 y todos los valores deben pertenecer al intervalo [0,1]. El estado inicial es fijo: `S₀ = [1, 0, 0]`. Los horizontes fijos son `[1, 3, 5, 10]` ciclos de decisión; un paso no representa segundos ni frames.

El cálculo es `Sₙ = S₀ × Pⁿ`, implementado en el backend con NumPy. La propiedad de Markov de primer orden es:

```text
P(Xₙ₊₁ = j | Xₙ = i, ..., X₀) = P(Xₙ₊₁ = j | Xₙ = i)
```

La salida representa la probabilidad de estar en un estado en el paso `n`; no es la probabilidad acumulada de haber visitado ese estado en algún momento.

Resultados de referencia para la matriz predeterminada:

| Pasos | Patrullando | Persiguiendo | Atacando |
|---:|---:|---:|---:|
| 1 | 75.000000% | 25.000000% | 0.000000% |
| 3 | 48.937500% | 37.187500% | 13.875000% |
| 5 | 39.887344% | 39.452969% | 20.659687% |
| 10 | 35.746622% | 40.273584% | 23.979794% |

## Tecnologías

- Frontend: React 18, TypeScript, Vite, Recharts.
- Backend: Python 3.10+, FastAPI, NumPy.
- Pruebas: Pytest para backend, Vitest con React Testing Library para interfaz y Playwright con Chromium para el recorrido E2E entre React y FastAPI.
- Comunicación: HTTP `POST /api/predict`; sin base de datos.

## Estructura

```text
backend/
  app/model.py          # validación y cálculos NumPy
  app/main.py           # FastAPI, contrato HTTP y CORS
  tests/                # pruebas del modelo y endpoint
frontend/
  src/App.tsx            # flujo, resultados y composición de página
  src/model.ts           # matriz inicial, validación de porcentajes y tipos
  src/components/        # editor, diagrama SVG y gráfica agrupada
  src/test/              # pruebas de interfaz
  e2e/prediction.spec.ts  # Playwright contra FastAPI real
openspec/
  config.yaml
  specs/
    markov-prediction/spec.md
    prediction-api/spec.md
    prediction-interface/spec.md
  changes/archive/2026-11-20-enemy-behavior-predictor/
    proposal.md, design.md, tasks.md, specs/
```

## Requisitos e instalación

Se requiere Python 3.10 o posterior, Node.js 18 o posterior y npm. Ejecuta cada componente en una terminal distinta, desde la raíz de este repositorio.

### Backend

En PowerShell:

```powershell
py -3 -m venv backend/.venv
# Si el launcher py no detecta Python, usa la ruta de la instalación:
& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" -m venv backend/.venv
backend/.venv/Scripts/Activate.ps1
python -m pip install -r backend/requirements.txt
Set-Location backend
python -m uvicorn app.main:app --reload
```

La API queda en `http://localhost:8000`; la documentación interactiva de FastAPI, en `http://localhost:8000/docs`.

### Frontend

En otra terminal:

```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

Abre `http://localhost:5173`. `VITE_API_URL` permite cambiar la URL base del backend; si se omite, se utiliza `http://localhost:8000`.

## API

- Método y ruta: `POST /api/predict`.
- Solicitud: `{ "matrix": [[0.75,0.25,0],[0.1,0.6,0.3],[0.2,0.3,0.5]] }`.
- Respuesta 200: `initial_state`, `steps` y `predictions`, cada una con el número de pasos y un vector de probabilidades en orden P/C/A.
- Errores: HTTP 422 para JSON ausente o mal formado, dimensiones incorrectas, valores no finitos/fuera de rango o filas que no suman 1 con tolerancia absoluta `1e-12`. El detalle identifica la entrada que debe corregirse.
- CORS permite `http://localhost:5173` y `http://127.0.0.1:5173` durante desarrollo.

## Pruebas

```powershell
# Backend, desde backend/ con el entorno virtual activo
python -m pytest

# Frontend, desde frontend/
npm test
npm run build

# E2E (Playwright inicia Vite y FastAPI; instalar Chromium una vez)
npx playwright install chromium
npm run test:e2e
```

Las pruebas backend comprueban valores de referencia, matrices inválidas y válidas, invariantes de las distribuciones y respuestas HTTP. Vitest comprueba valores precargados, edición, validación, solicitud HTTP y presentación de resultados. Vitest simula HTTP para aislar la interfaz; Playwright prueba el recorrido completo contra los procesos reales de Vite y FastAPI, incluida una vista móvil.

## Uso de la aplicación

1. Revisa el diagrama de estados y sus porcentajes.
2. Edita las nueve celdas de la matriz; cada fila debe sumar 100%.
3. Pulsa **Calcular predicción**. No se calcula automáticamente al editar.
4. Consulta las probabilidades de Patrullando, Persiguiendo y Atacando en los cuatro horizontes y compáralas en la gráfica agrupada.

## SDD y OpenSpec

El desarrollo comenzó inspeccionando el repositorio y verificando OpenSpec 1.14.3 y su documentación oficial. Se inicializó el esquema `spec-driven`; antes de implementar se elaboraron y validaron la propuesta, tres especificaciones, el diseño técnico y las tareas de aceptación. Tras pasar Pytest, Vitest, la compilación y Playwright, el cambio se archivó con OpenSpec el 20 de noviembre de 2026. Las especificaciones vigentes están en `openspec/specs/` y la propuesta, diseño y tareas se conservaron en `openspec/changes/archive/2026-11-20-enemy-behavior-predictor/`.
