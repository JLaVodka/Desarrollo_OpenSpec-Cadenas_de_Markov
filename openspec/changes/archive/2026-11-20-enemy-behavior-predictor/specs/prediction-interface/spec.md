# Spec Delta

## Purpose

Permitir que el estudiante modifique e interprete visualmente las probabilidades de transición y las distribuciones resultantes sin conocimientos de programación.

## ADDED Requirements

### Requirement: La interfaz muestra y permite editar la matriz
La interfaz SHALL presentar una matriz 3×3 en orden P, C, A, precargada con los valores predeterminados equivalentes a 75%, 25%, 0%; 10%, 60%, 30%; y 20%, 30%, 50%, permitiendo editar sus nueve porcentajes.

#### Scenario: Matriz predeterminada visible
- **WHEN** se carga la página
- **THEN** se muestran los tres estados y sus nueve probabilidades predeterminadas como porcentajes

#### Scenario: El usuario edita la matriz
- **WHEN** el usuario cambia una entrada de porcentaje
- **THEN** el nuevo valor queda disponible para validación y cálculo explícito

### Requirement: La interfaz valida la matriz antes del cálculo
La interfaz SHALL impedir el envío si faltan valores, no son numéricos, no son finitos, son menores que 0%, superan 100% o una fila no suma 100% con tolerancia de 0.0000000001 puntos porcentuales.

#### Scenario: Fila incompleta o inválida
- **WHEN** el usuario solicita un cálculo con una entrada vacía, no numérica o fuera de rango
- **THEN** el cálculo no se envía y se muestra un error que indica cómo corregirla

#### Scenario: Fila no suma cien
- **WHEN** el usuario solicita un cálculo y alguna fila difiere de 100% por más de la tolerancia
- **THEN** el cálculo no se envía y se identifica la fila que debe corregirse

### Requirement: El cálculo se solicita explícitamente
La interfaz SHALL enviar la matriz al backend mediante HTTP únicamente cuando el usuario active «Calcular predicción».

#### Scenario: Edición sin ejecutar
- **WHEN** el usuario modifica una o más probabilidades sin pulsar el botón
- **THEN** no se realiza ninguna solicitud de predicción y se conservan los resultados del último cálculo exitoso

#### Scenario: Error del backend
- **WHEN** la API rechaza la matriz o no está disponible
- **THEN** la interfaz muestra un mensaje comprensible y no presenta la solicitud fallida como un cálculo exitoso

### Requirement: El diagrama representa la matriz aplicada
La interfaz SHALL mostrar un diagrama diferenciado de los gráficos estadísticos, con nodos P/C/A, flechas para transiciones de probabilidad positiva, bucles para permanencia y etiquetas porcentuales tomadas del último cálculo exitoso.

#### Scenario: Grafo actualizado tras un cálculo
- **WHEN** un cálculo finaliza correctamente con una matriz
- **THEN** el diagrama muestra sus transiciones positivas y etiquetas correspondientes, incluidos los bucles de permanencia

#### Scenario: Transición con probabilidad cero
- **WHEN** una entrada de la matriz aplicada equivale a cero
- **THEN** no se dibuja una flecha de transición para esa conexión

### Requirement: La interfaz presenta resultados numéricos y una gráfica agrupada
La interfaz SHALL presentar para cada horizonte 1, 3, 5 y 10 una probabilidad legible de cada estado y una gráfica de barras agrupadas que compare los tres estados entre horizontes.

#### Scenario: Resultados tras respuesta exitosa
- **WHEN** el backend devuelve una predicción válida
- **THEN** se muestran los cuatro horizontes, porcentajes de P/C/A con dos decimales y la gráfica con esos mismos valores

#### Scenario: Visualizaciones permanecen consistentes
- **WHEN** ocurre un error al calcular una matriz editada
- **THEN** los resultados y visualizaciones anteriores permanecen identificados como el último cálculo exitoso

### Requirement: La interfaz explica el alcance y se adapta a la pantalla
La interfaz SHALL identificar la aplicación como un modelo probabilístico académico, aclarar que un paso es un ciclo de decisión, y ordenar título, diagrama, matriz, botón, resultados y gráfica en una presentación adaptable.

#### Scenario: Explicación del modelo
- **WHEN** se consulta la página
- **THEN** queda claro que no es un videojuego ni IA real y que las probabilidades son supuestos ilustrativos

#### Scenario: Pantalla estrecha
- **WHEN** la página se muestra en una pantalla estrecha
- **THEN** los controles y visualizaciones siguen siendo legibles y utilizables sin desbordamiento horizontal de la página
