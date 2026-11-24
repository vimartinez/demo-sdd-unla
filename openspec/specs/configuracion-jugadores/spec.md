# configuracion-jugadores Specification

## Purpose
Define cómo las dos personas eligen su nombre y el color de su ficha antes de jugar, y qué combinaciones son válidas.

## Requirements

### Requirement: Configuración antes de la partida
El sistema MUST pedir la configuración de los dos jugadores antes de la primera partida, y no permitir jugar hasta confirmarla.

#### Scenario: Al abrir la página
- **WHEN** se abre la página
- **THEN** se ve la configuración de ambos jugadores y no se puede jugar

#### Scenario: Confirmar
- **GIVEN** una configuración válida
- **WHEN** se la confirma
- **THEN** comienza una partida nueva con esos nombres y colores, y el turno del Jugador 1

### Requirement: Elección de nombre
Cada jugador MUST poder elegir un nombre de hasta 12 caracteres, sin contar espacios al comienzo y al final.

#### Scenario: Nombre elegido
- **WHEN** un jugador escribe un nombre válido y se confirma
- **THEN** la partida lo identifica con ese nombre

#### Scenario: Espacios sobrantes
- **WHEN** un jugador escribe un nombre con espacios al comienzo o al final
- **THEN** la partida usa el nombre sin esos espacios

#### Scenario: Nombre vacío
- **WHEN** un jugador deja el nombre vacío o solo con espacios
- **THEN** la partida usa "Jugador 1" o "Jugador 2", según corresponda

#### Scenario: Nombre de 12 caracteres
- **WHEN** un jugador elige un nombre de 12 caracteres
- **THEN** el nombre se acepta completo

#### Scenario: Nombre demasiado largo
- **WHEN** se confirma un nombre de más de 12 caracteres
- **THEN** la configuración se rechaza e indica el largo máximo

#### Scenario: Caracteres especiales
- **WHEN** un jugador elige un nombre con acentos, símbolos o etiquetas como `<b>`
- **THEN** el nombre se muestra tal como fue escrito

### Requirement: Nombres distintos
Los nombres efectivos de ambos jugadores MUST ser distintos, sin diferenciar mayúsculas de minúsculas.

#### Scenario: Nombres iguales
- **WHEN** se confirman "Ana" y "ana"
- **THEN** la configuración se rechaza e indica que los nombres deben ser distintos

#### Scenario: Choque con el nombre por defecto
- **WHEN** el primer jugador elige "Jugador 2" y el segundo deja su nombre vacío
- **THEN** la configuración se rechaza e indica que los nombres deben ser distintos

### Requirement: Elección de color
Cada jugador MUST poder elegir el color de su ficha entre mandarina, menta, rosa, lila y crema.

#### Scenario: Colores iniciales
- **WHEN** se abre la configuración por primera vez
- **THEN** el Jugador 1 tiene mandarina y el Jugador 2 tiene lila

#### Scenario: Cambiar el color
- **WHEN** un jugador elige un color libre
- **THEN** la muestra de su ficha toma ese color

#### Scenario: Color reconocible sin verlo
- **WHEN** se recorren las opciones de color
- **THEN** cada una tiene su nombre en texto

### Requirement: Colores distintos
Los dos jugadores MUST tener colores distintos.

#### Scenario: Color usado por el rival
- **WHEN** un jugador tiene un color elegido
- **THEN** ese color aparece como no disponible para el otro

#### Scenario: Color liberado
- **WHEN** un jugador cambia su color
- **THEN** el color anterior vuelve a estar disponible para el otro

#### Scenario: Configuración con colores iguales
- **WHEN** se intenta confirmar una configuración con el mismo color para ambos
- **THEN** la configuración se rechaza e indica que los colores deben ser distintos

### Requirement: Errores de configuración
Una configuración rechazada MUST mostrar el motivo en texto, conservar lo ingresado y no comenzar la partida.

#### Scenario: Rechazo
- **WHEN** se confirma una configuración inválida
- **THEN** se muestra y se anuncia el motivo, y los datos ingresados no cambian

#### Scenario: Corrección
- **GIVEN** un error visible
- **WHEN** se corrige la configuración y se confirma
- **THEN** el error desaparece y comienza la partida

### Requirement: Cambiar jugadores
El sistema MUST permitir volver a la configuración en cualquier momento de la partida, con los datos actuales cargados.

#### Scenario: Volver a la configuración
- **GIVEN** una partida en curso o terminada
- **WHEN** se elige cambiar jugadores
- **THEN** se ve la configuración con los nombres y colores actuales, y la partida se abandona

#### Scenario: Volver a empezar
- **GIVEN** que se volvió a la configuración
- **WHEN** se la confirma
- **THEN** comienza una partida nueva con el tablero vacío

### Requirement: Configuración accesible
La configuración MUST poder completarse solo con teclado, con etiquetas para cada dato, y verse sin desplazamiento horizontal desde 320 px.

#### Scenario: Solo teclado
- **WHEN** se recorre la configuración con teclado
- **THEN** se pueden elegir nombres y colores y confirmar, con el foco siempre visible

#### Scenario: Comenzar con el teclado
- **WHEN** se confirma con Enter
- **THEN** el foco pasa a la primera columna y no se juega ninguna ficha, aunque la tecla siga presionada

#### Scenario: Etiquetas
- **WHEN** un lector de pantalla enfoca un dato
- **THEN** lee qué dato es y a qué jugador corresponde

#### Scenario: Pantalla angosta
- **WHEN** se abre la configuración a 320 px de ancho
- **THEN** se ve completa sin desplazamiento horizontal
