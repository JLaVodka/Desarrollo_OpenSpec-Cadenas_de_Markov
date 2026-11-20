# Spec Delta

## MODIFIED Requirements

### Requirement: La API permite la comunicación local desde el frontend
Durante desarrollo, la API SHALL permitir mediante CORS solicitudes HTTP desde orígenes `localhost` o `127.0.0.1` en cualquier puerto local, y SHALL rechazar orígenes no locales.

#### Scenario: Solicitud desde el frontend local
- **WHEN** el navegador frontend realiza una solicitud desde el origen de desarrollo permitido
- **THEN** la política CORS permite la solicitud HTTP al endpoint

#### Scenario: Preflight desde un puerto Vite alternativo
- **WHEN** el navegador solicita `POST /api/predict` con origen `http://localhost:5174` o `http://127.0.0.1:5173`
- **THEN** la política CORS permite el preflight y la solicitud HTTP

#### Scenario: Origen remoto rechazado
- **WHEN** el navegador solicita `POST /api/predict` desde un origen distinto de `localhost` o `127.0.0.1`
- **THEN** la política CORS rechaza el preflight y no autoriza la solicitud
