# Proposal

## Why

La materia Proyecto de Software necesita un ejemplo completo y chico de Spec-Driven Development, y el repositorio todavía no tiene código ni specs. Un juego de alinear cuatro fichas tiene reglas conocidas por todos y casos borde interesantes, así que permite mostrar cómo cada requisito llega al código y a un test.

## What Changes

- Juego web para dos personas que comparten la misma pantalla, en partidas sueltas.
- Tablero de 7 columnas x 6 filas con caída por gravedad y turnos alternados.
- Victoria al alinear 4 o más fichas en horizontal, vertical o diagonal; empate si se llena el tablero sin línea.
- Rechazo de jugadas inválidas sin perder el turno.
- Interfaz con turno visible, vista previa de la caída, resaltado de las líneas ganadoras, resultado y reinicio.
- Uso con mouse o teclado; jugadores distinguidos por color y por forma.
- Nombre visible y estética propios.
- Ejecución en un servidor local, con instrucciones en el README.

Quedan fuera: juego contra la CPU, juego online, marcador, alternancia de quién empieza, deshacer, nombres personalizados, sonido y persistencia.

### Supuestos

Estos valores se propusieron durante la exploración y no se confirmaron uno por uno:

- Una línea de más de 4 fichas también gana.
- Se puede reiniciar en cualquier momento, sin confirmación, y siempre empieza el Jugador 1.
- El nombre visible es "Hilera", con estética de pizarrón y tiza.

## Capabilities

### New Capabilities

- `reglas-partida`: reglas de una partida: tablero, turnos, gravedad, jugadas inválidas, victoria, empate y reinicio.
- `interfaz-juego`: cómo las dos personas ven la partida y actúan sobre ella: tablero, turno, vista previa, entrada, resultado y accesibilidad.

### Modified Capabilities

Ninguna.

## Impact

- **Código nuevo**: página HTML, hoja de estilos, módulos JavaScript y tests. No hay código existente afectado.
- **Documentación**: el README suma cómo ejecutar el juego y los tests.
- **Dependencias**: ninguna de terceros. Para jugar hacen falta un navegador actual y un servidor local de archivos estáticos; para los tests, Node.js.
- **APIs y sistemas externos**: ninguno.
