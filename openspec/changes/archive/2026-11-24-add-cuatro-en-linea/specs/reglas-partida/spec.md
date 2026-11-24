# Spec Delta

## Purpose

Define las reglas de una partida de alinear cuatro fichas entre dos jugadores: qué jugadas son válidas, cómo avanza el turno y cuándo termina la partida.

## ADDED Requirements

### Requirement: Inicio de la partida
Toda partida nueva MUST comenzar con un tablero vacío de 7 columnas y 6 filas, en curso y con el turno del Jugador 1.

#### Scenario: Partida nueva
- **WHEN** se inicia una partida
- **THEN** las 42 celdas están vacías
- **AND** la partida está en curso
- **AND** es el turno del Jugador 1

### Requirement: Caída por gravedad
Una ficha jugada en una columna MUST ocupar la celda vacía más baja de esa columna.

#### Scenario: Columna vacía
- **GIVEN** una columna sin fichas
- **WHEN** un jugador juega en esa columna
- **THEN** su ficha ocupa la fila inferior

#### Scenario: Columna con fichas
- **GIVEN** una columna con 2 fichas
- **WHEN** un jugador juega en esa columna
- **THEN** su ficha ocupa la tercera fila desde abajo
- **AND** las fichas anteriores no cambian

#### Scenario: Última celda de la columna
- **GIVEN** una columna con 5 fichas
- **WHEN** un jugador juega en esa columna
- **THEN** su ficha ocupa la fila superior

### Requirement: Alternancia de turnos
El turno MUST pasar al otro jugador después de cada jugada válida que no termina la partida.

#### Scenario: Turno del Jugador 1 al Jugador 2
- **GIVEN** una partida en curso con el turno del Jugador 1
- **WHEN** el Jugador 1 hace una jugada válida que no termina la partida
- **THEN** es el turno del Jugador 2

#### Scenario: Turno del Jugador 2 al Jugador 1
- **GIVEN** una partida en curso con el turno del Jugador 2
- **WHEN** el Jugador 2 hace una jugada válida que no termina la partida
- **THEN** es el turno del Jugador 1

### Requirement: Rechazo de jugadas inválidas
Una jugada en una columna llena o inexistente MUST rechazarse indicando el motivo, sin modificar el tablero ni el turno.

#### Scenario: Columna llena
- **GIVEN** una partida en curso y una columna con 6 fichas
- **WHEN** el jugador de turno juega en esa columna
- **THEN** la jugada se rechaza por columna llena
- **AND** el tablero y el turno no cambian

#### Scenario: Columna inexistente
- **GIVEN** una partida en curso
- **WHEN** el jugador de turno juega en una columna que no es una de las 7 del tablero
- **THEN** la jugada se rechaza por columna inválida
- **AND** el tablero y el turno no cambian

### Requirement: Victoria por alineación
La partida MUST terminar con la victoria de quien, con su jugada, alinea 4 o más fichas propias contiguas en horizontal, vertical o cualquiera de las dos diagonales.

#### Scenario: Línea horizontal
- **WHEN** un jugador completa 4 fichas contiguas en una fila
- **THEN** la partida termina con su victoria

#### Scenario: Línea vertical
- **WHEN** un jugador completa 4 fichas contiguas en una columna
- **THEN** la partida termina con su victoria

#### Scenario: Diagonal ascendente
- **WHEN** un jugador completa 4 fichas contiguas en una diagonal que sube hacia la derecha
- **THEN** la partida termina con su victoria

#### Scenario: Diagonal descendente
- **WHEN** un jugador completa 4 fichas contiguas en una diagonal que baja hacia la derecha
- **THEN** la partida termina con su victoria

#### Scenario: Ficha que completa la línea desde el medio
- **GIVEN** 3 fichas de un jugador en una fila con un hueco entre ellas
- **WHEN** ese jugador ocupa el hueco y quedan 4 fichas contiguas
- **THEN** la partida termina con su victoria

#### Scenario: Más de 4 fichas
- **WHEN** un jugador completa una línea de 5 o más fichas contiguas
- **THEN** la partida termina con su victoria

#### Scenario: Línea interrumpida por el rival
- **WHEN** un jugador reúne 4 fichas en una fila con una ficha rival entre ellas y sin 4 contiguas
- **THEN** la partida sigue en curso

#### Scenario: Sin continuidad entre bordes
- **GIVEN** fichas de un jugador al final de una fila y al comienzo de la fila siguiente
- **WHEN** ese jugador suma 4 fichas solo si se unen ambos bordes
- **THEN** la partida sigue en curso

#### Scenario: Cobertura de todas las líneas
- **WHEN** un jugador completa cualquiera de las 69 líneas de 4 celdas del tablero, con cualquiera de sus 4 celdas como última jugada
- **THEN** la línea se reconoce como ganadora

### Requirement: Identificación de las líneas ganadoras
Al terminar en victoria, la partida MUST informar el ganador y todas las celdas que forman líneas ganadoras con la última jugada.

#### Scenario: Una línea de 4
- **WHEN** un jugador gana con una sola línea de 4 fichas
- **THEN** se informan el ganador y exactamente esas 4 celdas

#### Scenario: Una línea más larga
- **WHEN** un jugador gana con una línea de 5 o más fichas
- **THEN** se informan todas las celdas de esa línea

#### Scenario: Varias líneas en una jugada
- **WHEN** una sola jugada completa dos líneas
- **THEN** se informan las celdas de ambas líneas, sin repetir la celda compartida

### Requirement: Empate
La partida MUST terminar en empate cuando se ocupa la última celda del tablero sin que esa jugada complete una línea.

#### Scenario: Tablero lleno sin línea
- **GIVEN** un tablero con 41 fichas y sin línea ganadora
- **WHEN** se juega la última ficha y no completa una línea
- **THEN** la partida termina en empate, sin ganador

#### Scenario: La última ficha gana
- **GIVEN** un tablero con 41 fichas y sin línea ganadora
- **WHEN** se juega la última ficha y completa una línea
- **THEN** la partida termina con la victoria de quien la jugó

### Requirement: Partida terminada
Una partida terminada MUST rechazar toda jugada posterior sin modificar el tablero ni el resultado.

#### Scenario: Jugada después de una victoria
- **GIVEN** una partida terminada en victoria
- **WHEN** se intenta jugar en una columna con espacio
- **THEN** la jugada se rechaza porque la partida terminó
- **AND** el tablero y el resultado no cambian

#### Scenario: Jugada después de un empate
- **GIVEN** una partida terminada en empate
- **WHEN** se intenta jugar en cualquier columna
- **THEN** la jugada se rechaza porque la partida terminó

### Requirement: Reinicio de la partida
Reiniciar MUST estar disponible en cualquier momento y dar comienzo a una partida nueva.

#### Scenario: Reinicio con la partida en curso
- **GIVEN** una partida en curso con fichas y el turno del Jugador 2
- **WHEN** se reinicia
- **THEN** el tablero queda vacío, la partida en curso y el turno es del Jugador 1

#### Scenario: Reinicio con la partida terminada
- **GIVEN** una partida terminada
- **WHEN** se reinicia
- **THEN** el tablero queda vacío, la partida en curso y sin resultado anterior
- **AND** es el turno del Jugador 1
