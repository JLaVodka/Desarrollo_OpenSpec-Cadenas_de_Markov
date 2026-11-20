# Design

## Context

La implementación vigente permite únicamente `http://localhost:5173` y `http://127.0.0.1:5173`. Vite puede seleccionar 5174 u otro puerto si el predeterminado está ocupado, lo que provoca un preflight CORS HTTP 400 aunque ambos servidores sean locales. Véase la motivación en `proposal.md` y el contrato actualizado en `specs/prediction-api/spec.md`.

## Goals / Non-Goals

**Goals:**
- Permitir puertos de desarrollo alternativos para los dos nombres de loopback usados por Vite.
- Conservar el rechazo de orígenes remotos.

**Non-Goals:**
- Abrir CORS a cualquier host ni permitir credenciales.
- Cambiar los endpoints, los datos o el puerto de Vite.

## Decisions

- Configurar `allow_origin_regex` para aceptar únicamente `http(s)://localhost[:puerto]` y `http(s)://127.0.0.1[:puerto]`. Esto permite el fallback de Vite sin enumerar puertos ni usar `*`.
- Mantener `allow_credentials=False` y los métodos/cabeceras mínimos ya definidos. Alternativa: aceptar cualquier origen con comodín; se descarta porque no es necesario para desarrollo local.
- Probar el preflight mediante FastAPI TestClient con puerto alternativo y confirmar que un origen externo no recibe `Access-Control-Allow-Origin`.

## Risks / Trade-offs

- [Una app local puede usar cualquier puerto en loopback] → el permiso sigue limitado al equipo local y no incluye hosts de red.
- [La prueba TestClient requiere sockets del entorno de ejecución] → ejecutar Pytest con permisos locales cuando el sandbox restrinja socketpair.

## Migration Plan

No requiere migración ni cambios del frontend. Reiniciar FastAPI después de actualizar el backend; la política CORS nueva se aplica al iniciar el proceso.
