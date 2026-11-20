# Proposal

## Why

El repositorio aún no ofrece una aplicación que permita explorar de forma verificable una cadena de Markov aplicada al comportamiento hipotético de un enemigo. Se necesita una herramienta académica pequeña que conecte un modelo matemático correcto con una interfaz editable y resultados explicables.

## What Changes

- Incorporar cálculo de distribuciones de estado para una cadena homogénea de primer orden de tres estados, con estado inicial y horizontes fijos.
- Añadir una API HTTP que valide matrices de transición y devuelva las distribuciones solicitadas.
- Crear una interfaz web que permita editar la matriz como porcentajes, visualizar el grafo de estados, y consultar resultados en tabla y gráfica agrupada.
- Añadir pruebas automatizadas de modelo, API, interfaz e integración viable, además de documentación de instalación, uso y metodología SDD/OpenSpec.
- Mantener explícitamente fuera del alcance simulación de videojuego, estado inicial configurable, persistencia y cualquier función ajena a la demostración matemática.

## Capabilities

### New Capabilities
- `markov-prediction`: Modelo de tres estados, matriz editable validada y distribuciones para los horizontes requeridos.
- `prediction-api`: Contrato HTTP para calcular predicciones, validar entradas y comunicar errores.
- `prediction-interface`: Interfaz para editar y enviar la matriz, visualizar la cadena y consultar resultados numéricos y gráficos.

### Modified Capabilities

## Impact

El repositorio recibirá una aplicación frontend React con TypeScript y un backend Python con FastAPI y NumPy, sus pruebas y archivos de dependencias, el README y especificaciones OpenSpec. No se añadirán bases de datos ni servicios externos. La API mantendrá estado inicial `[1,0,0]` y horizontes `[1,3,5,10]` fijos; la matriz predeterminada será `[ [0.75,0.25,0], [0.10,0.60,0.30], [0.20,0.30,0.50] ]` en proporciones internamente y porcentajes en la interfaz.
