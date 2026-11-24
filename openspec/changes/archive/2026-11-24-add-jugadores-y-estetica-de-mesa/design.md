# Design

## Context

El motor (`js/game.js`) identifica a los jugadores como 1 y 2, y la vista (`js/ui.js`) escribe "Jugador 1" y "Jugador 2" en tres lugares: estado, resultado y descripción de columnas. Las fichas se dibujan con `data-jugador` y variables CSS, y ya existe una animación `caer` breve, sin rebote y sin requisito que la respalde.

Los motivos, el conflicto con los specs vigentes y los supuestos están en `proposal.md`. Siguen vigentes la ausencia de dependencias y de build.

## Goals / Non-Goals

**Goals:**

- No tocar el motor ni sus tests: nombre y color son datos de presentación.
- Probar las reglas de configuración sin navegador.
- Que las animaciones sean solo CSS y nunca condicionen el estado.

**Non-Goals:**

- Automatizar pruebas en el navegador.
- Persistir la configuración.
- Temas o paletas configurables.

## Decisions

### 1. Nombre y color fuera del motor

```
  inicio.js --(entrada)--> jugadores.js --(jugadores | errores)--+
  formulario               validación pura                       |
                                                                 v
  game.js <---- jugar() ----------- main.js ----- dibujar(estado, jugadores) ---> ui.js
  (sin cambios: 1 | 2)          {estado, jugadores}
```

- `js/jugadores.js`: paleta, nombres por defecto y `validarConfiguracion()`, sin DOM.
- `js/inicio.js`: formulario, colores no disponibles y errores.
- `js/main.js`: alterna entre las dos pantallas y guarda `estado` y `jugadores`.
- `js/ui.js`: recibe `jugadores` para escribir nombres y aplicar colores.

*Alternativa:* guardar nombre y color en el estado del motor. Mezclaría presentación con reglas y obligaría a cambiar sus tests.

### 2. Validación como valor

`validarConfiguracion([{ nombre, color }, { nombre, color }])` devuelve `{ ok: true, jugadores }` con los nombres efectivos, o `{ ok: false, errores: [{ campo, jugador, mensaje }] }`, igual que `jugar()` trata los rechazos. Los pasos son: recortar espacios, aplicar el nombre por defecto, controlar largo (en caracteres, no en unidades UTF-16), comparar nombres sin distinguir mayúsculas y comparar colores.

El campo no usa `maxlength`, porque cortaría el texto en silencio en vez de mostrar el motivo.

### 3. Dos secciones en la misma página

`index.html` tiene la sección de inicio y la de partida, y se muestra una por vez con `hidden`. El inicio es un `<form>` con un `<fieldset>` por jugador, un `<input type="text">` y un grupo de `<input type="radio">` con etiquetas de texto: Enter, flechas y lectura son nativos. El color del rival queda `disabled`. El error se muestra en una región `role="alert"` y se asocia al campo con `aria-describedby`.

Al comenzar, el foco pasa a la primera columna. Si Enter sigue presionado, la repetición ya se descarta con `event.repeat`; si hubo doble clic en "Empezar", el segundo clic se descarta con `event.detail`.

Los nombres se escriben con `textContent` y atributos, nunca con HTML.

*Alternativa:* `<dialog>` sobre el tablero. Suma manejo de cierre con Escape, que permitiría saltear la configuración.

### 4. Colores por variable CSS

`main.js` fija `--color-1` y `--color-2` en la sección de partida, y las fichas usan la variable según `data-jugador`.

| Color | Valor | Contraste con el hueco `#16305c` |
|---|---|---|
| Mandarina | `#f2913d` | 5,5 |
| Menta | `#7fd6a8` | 7,5 |
| Rosa | `#f08bb4` | 5,6 |
| Lila | `#b79cf0` | 5,6 |
| Crema | `#f3e6c8` | 10,5 |

Todos superan 3:1 contra el hueco. La marca grabada usa `#2a1f1a`, con al menos 6,8 sobre cualquier color.

*Alternativa:* `<input type="color">`. Permitiría colores ilegibles sobre el azul o casi iguales entre sí.

### 5. Fichas redondas con marca

Un disco con degradado y sombras interiores para el volumen. La marca es fija por jugador, para no depender del color: **anillo** para el primero y **rombo** para el segundo, en `::before`. La vista previa usa la misma ficha atenuada, con borde punteado.

### 6. Tablero propio

Mesa de madera hecha con degradados CSS y tablero azul laqueado (`#2456a6`) de bordes redondeados, visto desde arriba, con canto y sombra. Los huecos son cuadrados de esquinas redondeadas y fondo `#16305c`. No hay patas, perforaciones circulares ni rejilla vertical, y la paleta excluye rojo y amarillo, para separarse de versiones comerciales.

### 7. Caída

Se reemplaza `caer` por una animación con rebote que se aplica solo a la ficha nueva, con una clase que la vista pone al detectar el cambio de celda vacía a ocupada. La duración es `300 ms + 70 ms` por fila recorrida, hasta 720 ms. El estado se actualiza de inmediato, así que no se bloquea la entrada.

*Alternativa:* bloquear hasta que termine. Frena el juego y obliga a manejar animaciones canceladas.

### 8. Festejo

Al detectar victoria, la vista agrega la clase `festejo` y una capa `aria-hidden` con unos 40 papelitos, con `pointer-events: none`. Un `animation-delay` igual a la duración de la caída lo hace empezar después. Las fichas ganadoras crecen y vuelven, escalonadas. Todo termina antes de los 4 segundos, contados desde que empieza, y `dibujar()` retira la capa cuando el estado deja de ser victoria.

Los papelitos usan el color de quien ganó más blanco. El marco de las celdas ganadoras no depende de la animación.

Con `prefers-reduced-motion: reduce` no se crea la capa ni se aplican animaciones.

*Alternativas:* `<canvas>` con `requestAnimationFrame`, con más código; o una librería de confeti, que agrega una dependencia.

## Risks / Trade-offs

- [El azul con fichas redondas recuerda a versiones comerciales] → Se aplica la decisión 6 y se verifica con los escenarios de "Identidad propia".
- [Dos fichas cayendo en la misma columna pueden superponerse un instante] → Es solo visual; el estado ya es correcto.
- [Los papelitos pueden ser pesados en equipos lentos] → Pocos elementos, que solo animan `transform` y `opacity`.
- [Nombres largos pueden partir la línea a 320 px] → Máximo de 12 caracteres y texto con ajuste de línea.
- ["Cambiar jugadores" descarta la partida sin aviso] → Se acepta, igual que en "Reiniciar"; queda separado del tablero.
