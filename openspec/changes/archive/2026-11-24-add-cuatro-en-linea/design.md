# Design

## Context

El repositorio solo contiene README, LICENSE y un `.gitignore` de plantilla Java: no hay código, build ni convenciones que respetar. El stack está decidido: HTML, CSS y JavaScript vanilla en un servidor local. La motivación está en `proposal.md`, y los requisitos en `specs/reglas-partida/spec.md` y `specs/interfaz-juego/spec.md`.

Como el proyecto es material de clase, conviene que cada archivo se pueda leer y explicar por separado.

## Goals / Non-Goals

**Goals:**

- Que las reglas se prueben sin navegador.
- Que cada escenario de `reglas-partida` tenga un test fácil de ubicar.
- Que no haya paso de build ni dependencias que instalar.

**Non-Goals:**

- Automatizar pruebas en el navegador: `interfaz-juego` se verifica manualmente.
- Preparar extensiones para CPU, online o marcador.
- Soportar navegadores sin módulos ES.

## Decisions

### 1. Motor puro separado de la vista

```
   clic / teclado
        |
        v
   +---------+   jugar(estado, columna)    +-----------+
   |  ui.js  | --------------------------> |  game.js  |
   |         | <-------------------------- |           |
   +---------+  nuevo estado o rechazo     +-----------+
        |                                        ^
        v                                        |
       DOM                                 game.test.js
```

- `index.html`: estructura estática.
- `css/styles.css`: estética y estados visuales.
- `js/game.js`: reglas, sin DOM ni efectos.
- `js/ui.js`: dibuja un estado y captura la entrada.
- `js/main.js`: guarda el estado actual y conecta los otros dos.
- `test/game.test.js`: tests del motor.

*Alternativa:* un solo script que lea el tablero desde el DOM. Son menos archivos, pero probar las reglas exigiría un navegador.

### 2. Estado inmutable

```
estado = {
  tablero:   6 filas x 7 columnas, cada celda 0 | 1 | 2; fila 0 = inferior
  turno:     1 | 2
  resultado: { tipo: 'en-curso' }
           | { tipo: 'victoria', ganador, celdas: [{ fila, columna }] }
           | { tipo: 'empate' }
}
```

`crearPartida()` devuelve el estado inicial. `jugar(estado, columna)` devuelve `{ ok: true, estado }` con un estado nuevo, o `{ ok: false, motivo, estado }` con el mismo estado. Los motivos son `partida-terminada`, `columna-invalida` y `columna-llena`, evaluados en ese orden. Reiniciar es llamar otra vez a `crearPartida()`.

Un rechazo es un resultado esperado del juego, por eso es un valor y no una excepción.

*Alternativa:* un objeto mutable con métodos. Resulta familiar, pero obliga a copiar el estado en los tests para comprobar que una jugada rechazada no cambió nada.

### 3. Victoria calculada desde la última jugada

`buscarCeldasGanadoras(tablero, fila, columna)` recorre las 4 direcciones en ambos sentidos desde la última ficha. Cada dirección con 4 o más fichas contiguas aporta sus celdas, sin repetir. Si el resultado está vacío y no quedan celdas libres, es empate; como la victoria se evalúa antes, prevalece.

La función se exporta para probar las 69 líneas con cada una de sus 4 celdas como última jugada (276 casos) sin construir partidas completas.

*Alternativa:* recorrer todo el tablero en cada jugada. El costo es irrelevante, pero no aprovecha que solo la última ficha puede crear una línea.

### 4. Cada columna es un botón

La vista crea 7 `<button>`, cada uno con 6 celdas decorativas. Así, el clic en cualquier celda, el foco, Enter y Espacio son nativos. Solo se agrega código para las flechas.

- **Nombre accesible:** `aria-label` con el número de columna y sus fichas de abajo hacia arriba.
- **Columna llena o partida terminada:** `aria-disabled` en lugar de `disabled`, para no perder el foco y poder mostrar el aviso.
- **Actualización:** se modifican los elementos existentes, sin recrearlos, para conservar el foco.
- **Vista previa:** hay una sola columna activa, la última señalada o enfocada.

*Alternativas:* 42 celdas con manejadores propios, que exigirían rehacer la semántica de teclado; o `<canvas>`, que obligaría a duplicar el tablero para lectores de pantalla.

### 5. Protección contra jugadas accidentales

- Se ignoran los `click` con `event.detail > 1`, que corresponden al segundo clic de un doble clic.
- Se cancelan los `keydown` de Enter o Espacio con `event.repeat`.

*Alternativa:* bloquear la entrada un tiempo fijo después de cada jugada. Es simple, pero también frena jugadas rápidas legítimas en otras columnas.

### 6. Textos en dos regiones

Turno y resultado van en una región, y los avisos en otra, ambas con `aria-live="polite"`. Así un aviso no tapa a quién le toca.

### 7. Identidad "Hilera": pizarrón y tiza

Tablero verde pizarrón con trazos de tiza. El Jugador 1 usa un círculo durazno y el Jugador 2 una cruz celeste, dibujados con CSS. La vista previa es la misma forma, atenuada y con trazo punteado. Las celdas ganadoras llevan un marco, además de mayor brillo.

Los colores se definen como variables CSS, y los tamaños se calculan según el ancho disponible para cumplir con 320 px. La animación de caída es breve y se omite con `prefers-reduced-motion`.

### 8. Servidor y tests con lo que ya está instalado

`package.json` sin dependencias, con `"type": "module"`, `npm test` (`node --test`) y `npm start` (`python3 -m http.server 8000 --bind 127.0.0.1`). Cada test lleva el nombre de su escenario, agrupado por requisito.

*Alternativas:* un servidor propio en Node, que sería código ajeno a los specs; o `npx serve`, que descarga paquetes.

## Risks / Trade-offs

- [Abrir `index.html` con doble clic falla, porque los módulos ES no suelen cargar desde `file://`] → El README indica usar el servidor y la página muestra un mensaje si el script no llega a cargar.
- [Algunos Windows sirven los `.js` con un tipo MIME incorrecto o no tienen el comando `python3`] → El README ofrece Live Server de VS Code como alternativa.
- [La interfaz no tiene tests automáticos] → `tasks.md` incluye una verificación manual por escenario; la lógica vive en el motor, que sí los tiene.
- [`event.detail` también descarta dos jugadas legítimas muy rápidas en el mismo lugar] → Se acepta: basta con repetir el clic.
- [Reiniciar sin confirmación puede borrar una partida por error] → Se acepta en partidas sueltas; el control queda separado del tablero.
