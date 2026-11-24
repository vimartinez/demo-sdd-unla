# demo-sdd-unla
Demo de spec-driven Development para la materia Proyecto de Sofware - UNLa

## Hilera

Juego para dos personas en la misma pantalla: gana quien alinea cuatro fichas en horizontal, vertical o diagonal.

Antes de empezar, cada jugador elige su nombre (hasta 12 caracteres) y el color de su ficha: mandarina, menta, rosa, lila o crema. Los nombres y los colores no se pueden repetir. Con el nombre vacío se juega como "Jugador 1" o "Jugador 2".

Durante la partida, "Reiniciar" empieza otra con los mismos jugadores y "Cambiar jugadores" vuelve a la elección de nombres y colores.

### Requisitos

- Un navegador actual.
- Python 3, para el servidor local.

### Ejecutar el juego

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Si tenés Node.js instalado, `npm start` ejecuta ese mismo comando.

Después abrí <http://127.0.0.1:8000>. Para detener el servidor, presioná `Ctrl+C`.

Abrir `index.html` con doble clic no alcanza: el navegador no carga los módulos de JavaScript sin un servidor.

Si en Windows no existe el comando `python3` o el juego no carga, usá la extensión Live Server de VS Code: abrí `index.html` y elegí "Open with Live Server".

### Ejecutar los tests

Los tests cubren las reglas de la partida y la validación de nombres y colores. Necesitan Node.js 20 o posterior. No hay que instalar paquetes.

```bash
npm test
```
