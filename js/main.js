// Guarda la partida y los jugadores, y alterna entre las pantallas de inicio y partida.

import { crearPartida, jugar } from './game.js';
import { crearInicio } from './inicio.js';
import { valorDeColor } from './jugadores.js';
import { crearVista } from './ui.js';

const partida = document.getElementById('partida');

let estado = crearPartida();
let jugadores = null;

const inicio = crearInicio({
  alEmpezar(elegidos) {
    jugadores = elegidos;
    jugadores.forEach(({ color }, i) => {
      partida.style.setProperty(`--color-${i + 1}`, valorDeColor(color));
    });
    inicio.ocultar();
    partida.hidden = false;
    mostrar(crearPartida());
    vista.enfocarTablero();
  },
});

const vista = crearVista({
  alJugar(columna) {
    const jugada = jugar(estado, columna);
    if (jugada.ok) mostrar(jugada.estado);
    else if (jugada.motivo === 'columna-llena') {
      vista.avisar(`La columna ${columna + 1} está llena. Elegí otra.`);
    }
  },
  alReiniciar() {
    mostrar(crearPartida());
  },
  alCambiarJugadores() {
    // Se abandona la partida antes de salir, para no dejar un festejo en curso.
    mostrar(crearPartida());
    vista.salir();
    partida.hidden = true;
    inicio.mostrar(jugadores);
  },
});

function mostrar(nuevoEstado) {
  estado = nuevoEstado;
  vista.avisar('');
  vista.dibujar(estado, jugadores);
}

document.getElementById('sin-script').remove();
