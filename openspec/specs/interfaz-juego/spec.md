# interfaz-juego Specification

## Purpose
Define cómo dos personas que comparten una pantalla ven el estado de la partida y actúan sobre ella con mouse o teclado.

## Requirements

### Requirement: Tablero visible
Durante la partida, la interfaz MUST mostrar las 7 columnas y 6 filas del tablero con el contenido actual de cada celda.

#### Scenario: Al abrir el juego
- **GIVEN** la página recién abierta
- **WHEN** se confirma la configuración de los jugadores
- **THEN** se ve un tablero vacío de 7 columnas por 6 filas

#### Scenario: Después de una jugada
- **WHEN** un jugador hace una jugada válida
- **THEN** su ficha aparece en la celda que ocupó
- **AND** las demás celdas no cambian

### Requirement: Fichas distinguibles
Todas las fichas MUST ser redondas y distinguirse por el color elegido por cada jugador y también por una marca grabada propia de cada uno.

#### Scenario: Vista sin color
- **GIVEN** un tablero con fichas de ambos jugadores
- **WHEN** se lo ve en escala de grises
- **THEN** se reconoce a qué jugador pertenece cada ficha

#### Scenario: Color elegido
- **WHEN** un jugador juega una ficha
- **THEN** la ficha es redonda, del color que eligió y con su marca

### Requirement: Estado de la partida visible
La interfaz MUST mostrar en texto, con los nombres elegidos, el turno actual o, si la partida terminó, su resultado.

#### Scenario: Turno actual
- **GIVEN** una partida en curso
- **WHEN** cambia el turno
- **THEN** el texto nombra al jugador de turno y muestra su ficha

#### Scenario: Victoria
- **WHEN** un jugador gana
- **THEN** el texto anuncia qué jugador ganó y ya no indica un turno

#### Scenario: Empate
- **WHEN** la partida termina en empate
- **THEN** el texto anuncia el empate y ya no indica un turno

### Requirement: Vista previa de la caída
Durante una partida en curso, la interfaz MUST mostrar dónde caería la ficha del jugador de turno en la columna señalada o enfocada.

#### Scenario: Columna con espacio
- **WHEN** se señala o enfoca una columna con espacio
- **THEN** la celda vacía más baja muestra una vista previa, distinta de una ficha jugada, con el color y la marca del jugador de turno

#### Scenario: Salir de la columna
- **WHEN** se deja de señalar o enfocar la columna
- **THEN** su vista previa desaparece

#### Scenario: Sin destino posible
- **WHEN** se señala o enfoca una columna llena, o cualquier columna con la partida terminada
- **THEN** no se muestra ninguna vista previa

### Requirement: Jugar con el mouse
La interfaz MUST permitir jugar haciendo clic en cualquier celda de la columna elegida.

#### Scenario: Clic en una columna
- **GIVEN** una partida en curso
- **WHEN** se hace clic en cualquier celda de una columna con espacio
- **THEN** la ficha del jugador de turno cae en esa columna

### Requirement: Jugar con el teclado
La interfaz MUST permitir elegir columna, jugar y reiniciar usando solo el teclado, con el foco siempre visible.

#### Scenario: Moverse entre columnas
- **GIVEN** el foco en una columna
- **WHEN** se presiona flecha izquierda o derecha
- **THEN** el foco pasa a la columna vecina en ese sentido, o no cambia si está en el borde

#### Scenario: Jugar en la columna enfocada
- **GIVEN** una partida en curso y el foco en una columna con espacio
- **WHEN** se presiona Enter o Espacio
- **THEN** la ficha del jugador de turno cae en esa columna
- **AND** el foco permanece en esa columna

#### Scenario: Reiniciar con el teclado
- **WHEN** se llega al control de reinicio con Tab y se presiona Enter o Espacio
- **THEN** comienza una partida nueva

### Requirement: Protección contra jugadas accidentales
Una acción repetida involuntariamente MUST NOT generar una jugada por el rival.

#### Scenario: Doble clic
- **WHEN** se hace doble clic en una columna
- **THEN** se juega una sola ficha

#### Scenario: Tecla mantenida
- **WHEN** se mantiene presionada Enter o Espacio sobre una columna
- **THEN** se juega como máximo una ficha

### Requirement: Aviso de columna llena
La interfaz MUST avisar en texto cuando se intenta jugar en una columna llena, sin dejar de mostrar a quién le toca.

#### Scenario: Intento en columna llena
- **GIVEN** una partida en curso
- **WHEN** se intenta jugar en una columna llena
- **THEN** se muestra un aviso de columna llena
- **AND** el tablero y el turno mostrados no cambian

#### Scenario: El aviso se retira
- **GIVEN** un aviso de columna llena visible
- **WHEN** se hace una jugada válida o se reinicia
- **THEN** el aviso desaparece

### Requirement: Resaltado de las líneas ganadoras
Al terminar en victoria, la interfaz MUST resaltar todas las celdas ganadoras sin depender solo del color.

#### Scenario: Victoria con una línea
- **WHEN** un jugador gana con una línea
- **THEN** se resaltan las celdas de esa línea y ninguna otra

#### Scenario: Victoria con varias líneas
- **WHEN** un jugador gana completando más de una línea
- **THEN** se resaltan las celdas de todas esas líneas

### Requirement: Control de reinicio
Durante la partida y al terminar, la interfaz MUST ofrecer un control que inicia de inmediato una partida nueva con los mismos jugadores.

#### Scenario: Reiniciar
- **GIVEN** una partida en curso o terminada
- **WHEN** se activa el control de reinicio
- **THEN** se ve el tablero vacío, sin resaltados ni avisos, y el turno del Jugador 1

#### Scenario: Conservar jugadores
- **GIVEN** jugadores con nombre y color elegidos
- **WHEN** se activa el control de reinicio
- **THEN** la partida nueva conserva sus nombres y colores

### Requirement: Información para lectores de pantalla
La interfaz MUST exponer a tecnologías de asistencia el contenido de cada columna y anunciar los cambios de turno, los avisos y el resultado.

#### Scenario: Consultar una columna
- **WHEN** un lector de pantalla enfoca una columna
- **THEN** lee su número y el nombre del dueño de cada ficha, de abajo hacia arriba

#### Scenario: Anuncio de cambios
- **WHEN** cambia el turno, aparece un aviso o termina la partida
- **THEN** el nuevo texto se anuncia sin mover el foco

#### Scenario: Efectos decorativos
- **WHEN** se reproduce una animación
- **THEN** sus elementos decorativos no se anuncian ni reciben foco

### Requirement: Adaptación al tamaño de pantalla
El tablero completo MUST verse sin desplazamiento horizontal en anchos de 320 px en adelante.

#### Scenario: Pantalla angosta
- **WHEN** se abre el juego en una ventana de 320 px de ancho
- **THEN** se ven las 7 columnas sin desplazamiento horizontal

### Requirement: Identidad propia
La interfaz MUST usar un nombre y una estética propios, sin reproducir la marca, el diseño del tablero ni la combinación de colores de fichas de versiones comerciales.

#### Scenario: Identidad visible
- **WHEN** se abre la página
- **THEN** el título muestra el nombre propio del juego
- **AND** el tablero y las fichas siguen la estética propia definida para el juego

#### Scenario: Diseño propio
- **WHEN** se ve el tablero con fichas
- **THEN** los huecos son cuadrados de esquinas redondeadas y las fichas llevan marcas grabadas
- **AND** no hay fichas rojas ni amarillas

### Requirement: Apariencia de juego de mesa
La interfaz MUST presentar la partida como un juego de mesa: un tablero azul de bordes redondeados apoyado sobre una mesa, con fichas redondas con volumen.

#### Scenario: Tablero
- **WHEN** se ve la partida
- **THEN** el tablero es azul, tiene los bordes redondeados y se apoya sobre una superficie de madera

#### Scenario: Fichas con volumen
- **WHEN** hay fichas en el tablero
- **THEN** se ven redondas y con relieve

### Requirement: Animación de caída
Al jugarse, una ficha MUST verse caer desde la parte superior de su columna y rebotar al llegar, en menos de un segundo.

#### Scenario: Caída
- **WHEN** se hace una jugada válida
- **THEN** solo la ficha nueva cae hasta su celda y rebota

#### Scenario: Caída más larga
- **WHEN** una ficha cae hasta una fila más baja que otra
- **THEN** su animación dura más

#### Scenario: Jugar durante la caída
- **GIVEN** una ficha cayendo
- **WHEN** el rival hace una jugada válida
- **THEN** la jugada se acepta y ambas fichas terminan en su celda

### Requirement: Animación de victoria
Al ganar un jugador, la interfaz MUST festejar con una animación de las fichas ganadoras y papelitos, después de la caída y durante 4 segundos como máximo.

#### Scenario: Festejo
- **WHEN** un jugador gana
- **THEN** al terminar la caída, las fichas ganadoras se animan y caen papelitos

#### Scenario: Sin bloqueo
- **GIVEN** un festejo en curso
- **WHEN** se reinicia o se cambian los jugadores
- **THEN** la acción ocurre de inmediato y el festejo desaparece

#### Scenario: Empate
- **WHEN** la partida termina en empate
- **THEN** no hay festejo

#### Scenario: Sin destellos
- **WHEN** se reproduce el festejo
- **THEN** nada parpadea más de 3 veces por segundo

### Requirement: Movimiento reducido
Si el sistema pide reducir el movimiento, la interfaz MUST omitir las animaciones sin perder información.

#### Scenario: Preferencia activada
- **GIVEN** la preferencia de movimiento reducido
- **WHEN** se juega una ficha o alguien gana
- **THEN** la ficha aparece en su celda sin caer y no hay papelitos
- **AND** el resultado y las celdas ganadoras se ven igual
