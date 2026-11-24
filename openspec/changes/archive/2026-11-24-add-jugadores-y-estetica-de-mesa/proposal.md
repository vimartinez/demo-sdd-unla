# Proposal

## Why

La primera versión cumple las reglas, pero se ve como un pizarrón y trata a las dos personas como "Jugador 1" y "Jugador 2". Se busca que parezca un juego de mesa y que cada persona juegue con su nombre y su color.

## What Changes

- Pantalla previa a la partida donde cada jugador elige nombre y color de ficha.
- Los nombres y colores elegidos se usan en el turno, el resultado, las fichas, la vista previa y la descripción para lectores de pantalla.
- Control "Cambiar jugadores" para volver a esa pantalla; "Reiniciar" conserva nombres y colores.
- Apariencia de juego de mesa: tablero azul con bordes redondeados y fichas redondas.
- Las fichas se distinguen por color y por una marca grabada, en lugar de círculo contra cruz.
- Animación de caída con rebote y animación de festejo al ganar.

Las reglas de la partida no cambian. Quedan fuera: marcador, alternancia de quién empieza, sonido, recordar jugadores al recargar, y colores libres fuera de la paleta.

### Conflicto con los specs vigentes

- **"Fichas distinguibles"** exige distinguir por forma. Como ahora todas las fichas son redondas, se reemplaza por una marca grabada; se conserva la lectura sin color.
- **"Identidad propia"** excluye los colores de versiones comerciales. Se permite el azul pedido, pero se mantiene un diseño propio: tablero laqueado apoyado en una mesa de madera, huecos cuadrados de esquinas redondeadas, fichas grabadas, y una paleta sin rojo ni amarillo.

### Supuestos

- Nombre de hasta 12 caracteres; si queda vacío se usa "Jugador 1" o "Jugador 2". Los dos nombres deben ser distintos.
- Cinco colores (mandarina, menta, rosa, lila y crema), sin repetir. Vienen preseleccionados mandarina y lila.
- "Cambiar jugadores" abandona la partida sin confirmación, igual que "Reiniciar".
- Siempre empieza el Jugador 1.
- El empate no tiene festejo.

## Capabilities

### New Capabilities

- `configuracion-jugadores`: elección y validación del nombre y el color de cada jugador antes de la partida.

### Modified Capabilities

- `interfaz-juego`: cambian el tablero al abrir, cómo se distinguen las fichas, los textos con nombres, la vista previa, el reinicio, la información para lectores de pantalla y la identidad; se agregan apariencia de mesa y animaciones.

## Impact

- **Código modificado**: `index.html`, `css/styles.css`, `js/ui.js` y `js/main.js`.
- **Código nuevo**: módulos para validar y pedir la configuración, y sus tests.
- **Sin cambios**: `js/game.js` y `test/game.test.js`.
- **Documentación**: `README.md`.
- **Dependencias**: ninguna nueva.
