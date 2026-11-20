# Design

## Context

El repositorio parte únicamente de un README y no contiene código, especificaciones de producto previas ni dependencias que deban conservarse. OpenSpec 1.14.3 está inicializado con el esquema `spec-driven`; el contrato está en `openspec/changes/enemy-behavior-predictor/specs/`. El entorno actual no tiene un intérprete Python accesible, por lo que la verificación del backend dependerá de disponer de Python compatible antes de cerrar la implementación.

## Goals / Non-Goals

**Goals:**
- Mantener el cálculo autoritativo en el backend y representar el mismo modelo en la interfaz.
- Separar validación de dominio, API y componentes visuales para facilitar explicación y pruebas.
- Mantener pocas dependencias y ejecución local simple, sin persistencia.

**Non-Goals:**
- Simular trayectorias o eventos aleatorios, estimar parámetros desde datos o ejecutar lógica de juego.
- Añadir usuarios, persistencia, configuración de horizontes o estado inicial.

## Decisions

1. **Monorepo con frontend y backend independientes.** Colocar el frontend en `frontend/` y el backend en `backend/`, con instrucciones de inicio desde la raíz. Alternativa: un único servidor que empaquete la SPA; se descarta para mantener explícita la comunicación HTTP React–FastAPI y simplificar desarrollo académico.

2. **Modelo como módulo Python puro y cálculo NumPy.** Mantener constante el orden de estados y horizontes; convertir la matriz validada a `numpy.ndarray`, calcular `S0 @ matrix_power(P, n)` y devolver números normalizados como probabilidades. Alternativa: multiplicación repetida; `matrix_power` refleja directamente la fórmula `Pⁿ` y es clara para los cuatro horizontes pequeños.

3. **Porcentajes en interfaz, proporciones en API.** La interfaz acepta y presenta porcentajes; divide por 100 al construir el cuerpo JSON. La respuesta usa proporciones para mantener el contrato matemático y el frontend convierte para mostrar. Alternativa: porcentajes en todo el transporte; se descarta para que la matriz del backend represente probabilidades convencionales en [0,1].

4. **Contrato API estable y explícito.** `POST /api/predict` recibe `{ "matrix": [[...], [...], [...]] }` y responde `{ "initial_state": [1,0,0], "steps": [1,3,5,10], "predictions": [{"steps": n, "probabilities": [p,c,a]}] }`. Respuestas 422 para estructura, rango o suma inválida, con detalle legible; errores inesperados se muestran como fallo genérico sin sobrescribir el último resultado correcto.

5. **Validación duplicada con tolerancias declaradas.** Cliente valida completitud, rango y cada fila con umbral de `0.0000000001` puntos porcentuales; backend vuelve a validar como autoridad con tolerancia absoluta `1e-12` sobre proporciones. La conversión exacta divide por 100, así que ambos umbrales son equivalentes a los redondeos normales de punto flotante. No se corrigen ni normalizan silenciosamente filas del usuario.

6. **Visualizaciones accesibles y de dependencias acotadas.** Usar SVG propio para el grafo (control preciso de bucles, dirección, etiquetas y ausencia de aristas nulas) y una biblioteca de gráficas React ligera para barras agrupadas. Alternativa: una sola biblioteca de diagramas de grafos; se evita por complejidad adicional y menor control sobre una visualización estática pequeña.

7. **Pruebas por capa.** Pytest cubre modelo y endpoint con resultados de referencia, errores e invariantes; Vitest con React Testing Library cubre edición, validación, petición y render de respuesta; Playwright cubre el recorrido HTTP completo solo si el entorno permite instalar/ejecutar sus navegadores. El backend se puede integrar con `TestClient` sin servidor externo y el frontend puede simular HTTP en unitarias.

8. **CORS restringido a desarrollo local.** Permitir el origen local del Vite configurado (por defecto `http://localhost:5173`), métodos y cabeceras necesarios. No usar comodín de orígenes junto con credenciales.

## Risks / Trade-offs

- [Python no está disponible en el entorno observado] → implementar y documentar el backend, comprobar sintaxis únicamente si aparece un intérprete, y registrar con precisión que Pytest no pudo ejecutarse mientras no haya Python; no declarar verificación aprobada sin ejecutarla.
- [La geometría SVG puede superponer etiquetas al cambiar valores] → usar posiciones deterministas para tres nodos, rutas separadas y pruebas que comprueben etiquetas y transiciones renderizadas.
- [Los mínimos errores de coma flotante pueden producir sumas ligeramente distintas] → tolerancias explícitas en cliente y servidor, comprobando que las distribuciones sigan sumando uno.
- [Playwright puede requerir descarga de navegadores] → mantener E2E como extra documentado y ejecutar las suites unitarias/API disponibles sin afirmar que E2E pasó si no fue viable.

## Migration Plan

No existe servicio previo ni datos que migrar. Preparar los directorios, dependencias y comandos de desarrollo; iniciar backend y frontend por separado; validar la API y completar el flujo de predicción; entregar el README con pasos de ejecución. Para retirar la aplicación basta eliminar los directorios y archivos añadidos en este cambio; no hay estado persistente.
