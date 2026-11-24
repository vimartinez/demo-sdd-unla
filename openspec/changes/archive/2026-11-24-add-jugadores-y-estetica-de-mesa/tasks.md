# Tasks

## 1. Reglas de configuración

- [x] 1.1 Crear `js/jugadores.js` con la paleta, los nombres por defecto y la validación de nombres; verificar con tests de "Elección de nombre" y "Nombres distintos" en `test/jugadores.test.js`
- [x] 1.2 Agregar la validación de colores y los valores iniciales; verificar con tests de "Colores iniciales" y "Configuración con colores iguales"
- [x] 1.3 Actualizar en `README.md` qué cubren los tests y verificar que `npm test` pasa, con `js/game.js` y `test/game.test.js` sin cambios

## 2. Pantalla de inicio

- [x] 2.1 Separar `index.html` en las secciones de inicio y partida, y crear el formulario en `js/inicio.js`; verificar "Configuración antes de la partida" y "Etiquetas"
- [x] 2.2 Implementar la muestra de ficha y los colores no disponibles; verificar "Elección de color" y los dos primeros escenarios de "Colores distintos"
- [x] 2.3 Mostrar y anunciar errores conservando lo ingresado; verificar "Errores de configuración"
- [x] 2.4 Conectar inicio y partida en `js/main.js`, con el foco en la primera columna; verificar "Comenzar con el teclado", también con Enter mantenido y con doble clic en "Empezar"
- [x] 2.5 Agregar "Cambiar jugadores" con los datos actuales; verificar los dos escenarios de "Cambiar jugadores"
- [x] 2.6 Documentar en `README.md` la configuración previa y verificar que el texto coincide con la pantalla

## 3. Nombres en la partida

- [x] 3.1 Usar los nombres en turno y resultado; verificar "Estado de la partida visible" y "Caracteres especiales" con `<b>Ana</b>`
- [x] 3.2 Usar los nombres en la descripción de columnas; verificar "Consultar una columna" en el árbol de accesibilidad
- [x] 3.3 Conservar jugadores al reiniciar; verificar los dos escenarios de "Control de reinicio"

## 4. Apariencia de juego de mesa

- [x] 4.1 Estilar mesa, tablero azul y huecos; verificar "Apariencia de juego de mesa" e "Identidad propia" con capturas
- [x] 4.2 Dibujar fichas redondas con volumen, color elegido y marca; verificar "Fichas distinguibles" con los cinco colores y en escala de grises
- [x] 4.3 Adaptar vista previa, foco y celdas ganadoras; verificar "Vista previa de la caída", "Resaltado de las líneas ganadoras" y que el foco se vea sobre el azul y la madera
- [x] 4.4 Estilar la pantalla de inicio; verificar a 320 px "Configuración accesible" y "Adaptación al tamaño de pantalla" con nombres de 12 caracteres

## 5. Animaciones

- [x] 5.1 Implementar la caída con rebote solo en la ficha nueva; verificar los tres escenarios de "Animación de caída", midiendo menos de un segundo
- [x] 5.2 Implementar el festejo y retirarlo al reiniciar o cambiar jugadores; verificar los cuatro escenarios de "Animación de victoria"
- [x] 5.3 Ocultar los adornos a tecnologías de asistencia y omitir animaciones con movimiento reducido; verificar "Efectos decorativos" y "Movimiento reducido"

## 6. Verificación integral

- [x] 6.1 Ejecutar `npm test` y comprobar que pasan los tests del motor y de configuración
- [x] 6.2 Recorrer en el navegador todos los escenarios de `interfaz-juego`, incluidos los que este change no modifica, y comprobar que la consola no muestra errores
- [x] 6.3 Ejecutar `openspec validate add-jugadores-y-estetica-de-mesa --strict` y comprobar que no informa problemas
