# Tasks

## 1. Estructura y herramientas

- [x] 1.1 Crear estructura `backend/` y `frontend/` con configuraciones mínimas Python/FastAPI y Vite/React/TypeScript; verificar que archivos de dependencias y scripts existen y que OpenSpec reconoce el cambio.
- [x] 1.2 Configurar comandos de desarrollo y dependencias separadas para frontend y backend; verificar instalación de dependencias disponible en el entorno y documentar cualquier bloqueo por falta de Python.

## 2. Modelo y API

- [x] 2.1 Implementar módulo de modelo con estados, matriz predeterminada, validación estricta y cálculo NumPy de horizontes fijos; verificar resultados de referencia e invariantes con pruebas Pytest.
- [x] 2.2 Implementar `POST /api/predict`, esquemas de solicitud/respuesta, errores 422 y CORS local; verificar contrato y validaciones con pruebas API Pytest.
- [x] 2.3 Documentar contrato HTTP, fórmulas, estados y supuestos en README o documentación de backend; verificar que solicitud y respuesta coincidan con el esquema OpenAPI de FastAPI.

## 3. Interfaz

- [x] 3.1 Implementar diseño adaptable y matriz editable en porcentaje con validación de filas antes de envío; verificar valores precargados, edición y errores con pruebas Vitest.
- [x] 3.2 Implementar diagrama SVG desde la última matriz calculada con transiciones positivas y bucles; verificar en pruebas Vitest nodos, etiquetas, bucles y omisión de transiciones nulas.
- [x] 3.3 Integrar botón explícito y cliente HTTP, resultados numéricos y gráfica agrupada; verificar petición, render de los cuatro horizontes y actualización visual con pruebas Vitest.

## 4. Integración y entrega

- [x] 4.1 Completar README con objetivo académico, explicación Markov, instalación, ejecución, pruebas, estructura y SDD/OpenSpec; verificar comandos e instrucciones contra archivos reales.
- [x] 4.2 Ejecutar validación OpenSpec estricta y las suites disponibles; iniciar frontend/backend y verificar un flujo válido, errores y diseño adaptable, registrando con precisión pruebas no ejecutables por limitaciones del entorno.
- [x] 4.3 Revisar que el alcance implementado coincide con specs y restricciones, y que el repositorio no incluye secretos ni artefactos innecesarios; verificar con revisión de diff y estado Git.

## Workflow follow-up

- Archivar el cambio con OpenSpec tras completar implementación y verificación, para actualizar las especificaciones principales.
- Validar el cambio archivado y confirmar que las specs archivadas reflejan el comportamiento real.
