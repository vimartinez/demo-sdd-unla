# Tasks

## 1. Base del proyecto

- [x] 1.1 Crear `package.json` sin dependencias, con `"type": "module"` y los scripts `start` y `test`; verificar que `npm pkg get type scripts dependencies` muestra lo esperado
- [x] 1.2 Crear `index.html` con título "Hilera", regiones de estado y de avisos, contenedor del tablero, control de reinicio y mensaje para cuando el script no carga; verificar con `npm start` que la página abre en `http://127.0.0.1:8000`
- [x] 1.3 Documentar en `README.md` requisitos, cómo ejecutar el juego y la alternativa con Live Server; verificar ejecutando los comandos tal como están escritos

## 2. Motor: tablero y jugadas

- [x] 2.1 Implementar `crearPartida()` en `js/game.js` y verificar con los tests de "Inicio de la partida" y "Reinicio de la partida"
- [x] 2.2 Implementar en `jugar()` la gravedad y los turnos sin modificar el estado recibido; verificar con los tests de "Caída por gravedad" y "Alternancia de turnos"
- [x] 2.3 Implementar los rechazos por columna llena e inválida (fuera de rango, no entera y no numérica); verificar con los tests de "Rechazo de jugadas inválidas"

## 3. Motor: fin de la partida

- [x] 3.1 Implementar `buscarCeldasGanadoras()` y verificar con un test que recorre las 69 líneas con cada una de sus 4 celdas como última jugada (276 casos)
- [x] 3.2 Integrar la victoria en `jugar()` y verificar con los tests de "Victoria por alineación", incluidos línea interrumpida y bordes sin continuidad
- [x] 3.3 Informar ganador y celdas; verificar con los tests de "Identificación de las líneas ganadoras", incluidas línea larga y varias líneas sin celdas repetidas
- [x] 3.4 Implementar el empate y su prioridad frente a la victoria; verificar con los tests de "Empate"
- [x] 3.5 Rechazar jugadas con la partida terminada y verificar con los tests de "Partida terminada"
- [x] 3.6 Documentar `npm test` en `README.md` y verificar que el comando termina sin fallas

## 4. Interfaz: ver y jugar

- [x] 4.1 Crear en `js/ui.js` los 7 botones de columna con sus 6 celdas y dibujar un estado sin recrear elementos; verificar en el navegador "Tablero visible"
- [x] 4.2 Definir en `css/styles.css` la estética de pizarrón y tiza con círculo y cruz; verificar "Identidad propia" y, con una captura en escala de grises, "Fichas distinguibles"
- [x] 4.3 Conectar motor y vista en `js/main.js` y habilitar el clic; verificar "Jugar con el mouse"
- [x] 4.4 Mostrar turno y resultado en la región de estado; verificar "Estado de la partida visible" con victoria y empate
- [x] 4.5 Conectar el reinicio y verificar "Control de reinicio" con partida en curso y terminada

## 5. Interfaz: ayudas y accesibilidad

- [x] 5.1 Implementar la vista previa con una sola columna activa; verificar los tres escenarios de "Vista previa de la caída"
- [x] 5.2 Agregar las flechas, el foco visible y la conservación del foco; verificar "Jugar con el teclado" sin usar el mouse
- [x] 5.3 Ignorar el segundo clic y las teclas repetidas; verificar "Protección contra jugadas accidentales"
- [x] 5.4 Mostrar y retirar el aviso de columna llena; verificar los dos escenarios de "Aviso de columna llena"
- [x] 5.5 Resaltar las celdas ganadoras con marco y brillo; verificar "Resaltado de las líneas ganadoras" con una y con varias líneas
- [x] 5.6 Agregar `aria-label`, `aria-disabled` y `aria-live`; verificar con un lector de pantalla o con el árbol de accesibilidad "Información para lectores de pantalla"
- [x] 5.7 Ajustar tamaños y animación, respetando `prefers-reduced-motion`; verificar a 320 px "Adaptación al tamaño de pantalla"

## 6. Verificación integral

- [x] 6.1 Ejecutar `npm test` y comprobar que cada escenario de `reglas-partida` tiene al menos un test con su nombre
- [x] 6.2 Jugar en el navegador una victoria, un empate y un reinicio a mitad de partida, y comprobar que la consola no muestra errores
- [x] 6.3 Ejecutar `openspec validate add-cuatro-en-linea --strict` y comprobar que no informa problemas
