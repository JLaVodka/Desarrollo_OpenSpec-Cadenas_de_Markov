# Proposal

## Why

Vite cambia automáticamente de puerto cuando el predeterminado está ocupado, pero la API solo permite CORS desde el puerto 5173. En ese caso el navegador rechaza el preflight OPTIONS y la página no puede calcular predicciones.

## What Changes

- Permitir solicitudes de desarrollo desde cualquier puerto de `localhost` y `127.0.0.1`.
- Seguir rechazando orígenes que no sean locales y no habilitar credenciales CORS.
- Añadir pruebas para preflight desde puerto alternativo y para origen externo rechazado.

## Capabilities

### New Capabilities

### Modified Capabilities
- `prediction-api`: ampliar el requisito existente de CORS a puertos locales alternativos, preservando el límite de origen local.

## Impact

Se modifica únicamente la política CORS de FastAPI, las pruebas de endpoint, las instrucciones del README y la especificación `prediction-api`. No cambia la ruta, el cuerpo ni la respuesta de la API, y no se añaden dependencias.
