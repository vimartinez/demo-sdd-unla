// Vista: dibuja un estado y avisa qué quiso hacer la persona. No conoce las reglas del turno.

import { COLUMNAS, FILAS, filaDisponible } from './game.js';

const PAPELITOS = 40;

export function crearVista({ alJugar, alReiniciar, alCambiarJugadores }) {
  const partida = document.getElementById('partida');
  const tablero = document.getElementById('tablero');
  const textoEstado = document.getElementById('estado');
  const fichaEstado = document.getElementById('estado-ficha');
  const aviso = document.getElementById('aviso');
  const columnas = Array.from({ length: COLUMNAS }, (_, columna) => crearColumna(columna));

  let estadoActual = null;
  let papelitos = null;
  // Hay una sola vista previa: la de la última columna señalada o enfocada.
  let senalada = null;
  let enfocada = null;
  let activa = null;

  tablero.append(...columnas.map(({ boton }) => boton));
  columnas.forEach(({ boton }, columna) => conectarColumna(boton, columna));
  document.getElementById('reiniciar').addEventListener('click', alReiniciar);
  document.getElementById('cambiar').addEventListener('click', alCambiarJugadores);
  // Cada papelito se retira solo, y cada ficha deja de estar cayendo, al terminar su animación.
  partida.addEventListener('animationend', ({ target, animationName }) => {
    if (animationName === 'volar') target.remove();
    if (animationName === 'caer') target.classList.remove('cae');
  });

  function conectarColumna(boton, columna) {
    boton.addEventListener('click', (evento) => {
      // El segundo clic de un doble clic no juega por el rival.
      if (evento.detail > 1) return;
      alJugar(columna);
    });

    boton.addEventListener('keydown', (evento) => {
      // Si el foco vino de un clic, usar el teclado lo vuelve visible.
      enfocada = columna;
      activar(columna);
      if (evento.repeat && (evento.key === 'Enter' || evento.key === ' ')) {
        evento.preventDefault();
        return;
      }
      const paso = { ArrowLeft: -1, ArrowRight: 1 }[evento.key];
      if (paso) {
        evento.preventDefault();
        columnas[columna + paso]?.boton.focus();
      }
    });

    boton.addEventListener('pointerenter', () => {
      senalada = columna;
      activar(columna);
    });
    boton.addEventListener('pointerleave', () => {
      senalada = null;
      activar(enfocada);
    });
    boton.addEventListener('focus', () => {
      // El foco que deja un clic no cuenta: esa columna ya está señalada.
      if (!boton.matches(':focus-visible')) return;
      enfocada = columna;
      activar(columna);
    });
    boton.addEventListener('blur', () => {
      enfocada = null;
      activar(senalada);
    });
  }

  function activar(columna) {
    activa = columna;
    dibujarPrevia();
  }

  function dibujar(estado, jugadores) {
    const anterior = estadoActual;
    estadoActual = estado;
    const { tablero: celdas, resultado } = estado;
    const ganadoras = new Set((resultado.celdas ?? []).map(clave));

    columnas.forEach(({ boton, celdas: elementos }, columna) => {
      elementos.forEach((elemento, fila) => {
        const ficha = elemento.firstChild;
        const jugador = celdas[fila][columna];
        dibujarFicha(ficha, jugador);
        if (jugador === 0) ficha.classList.remove('cae');
        else if (anterior?.tablero[fila][columna] === 0) ficha.classList.add('cae');
        elemento.classList.toggle('ganadora', ganadoras.has(clave({ fila, columna })));
      });
      const llena = filaDisponible(celdas, columna) === -1;
      boton.setAttribute('aria-label', describirColumna(celdas, columna, jugadores));
      boton.setAttribute('aria-disabled', String(llena || resultado.tipo !== 'en-curso'));
    });

    dibujarEstado(estado, jugadores);
    dibujarPrevia();
    dibujarFestejo(resultado);
  }

  function dibujarEstado({ turno, resultado }, jugadores) {
    const nombre = jugadores[(resultado.ganador ?? turno) - 1].nombre;
    textoEstado.textContent = {
      'en-curso': `Turno de ${nombre}`,
      victoria: `¡Ganó ${nombre}!`,
      empate: 'Empate: no quedan lugares libres.',
    }[resultado.tipo];
    dibujarFicha(fichaEstado, resultado.tipo === 'empate' ? 0 : (resultado.ganador ?? turno));
  }

  function dibujarPrevia() {
    for (const { celdas } of columnas) {
      for (const celda of celdas) {
        if ('previa' in celda.firstChild.dataset) {
          delete celda.firstChild.dataset.previa;
          delete celda.firstChild.dataset.jugador;
        }
      }
    }
    if (activa === null || estadoActual.resultado.tipo !== 'en-curso') return;
    const fila = filaDisponible(estadoActual.tablero, activa);
    if (fila === -1) return;
    const ficha = columnas[activa].celdas[fila].firstChild;
    ficha.dataset.previa = '';
    ficha.dataset.jugador = estadoActual.turno;
  }

  function dibujarFestejo({ tipo, ganador, celdas }) {
    if (tipo !== 'victoria') {
      tablero.classList.remove('festejo');
      papelitos?.remove();
      papelitos = null;
      return;
    }
    // La primera celda es la de la última ficha: el festejo espera a que caiga.
    partida.style.setProperty('--caida-final', FILAS - celdas[0].fila);
    celdas.forEach(({ fila, columna }, orden) => {
      columnas[columna].celdas[fila].style.setProperty('--orden', orden);
    });
    tablero.classList.add('festejo');
    if (!papelitos && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      papelitos = crearPapelitos(ganador);
      partida.append(papelitos);
    }
  }

  // Olvida la columna señalada o enfocada al dejar la pantalla de partida.
  function salir() {
    senalada = null;
    enfocada = null;
    activar(null);
  }

  function enfocarTablero() {
    columnas[0].boton.focus();
  }

  function avisar(texto) {
    aviso.textContent = texto;
  }

  return { dibujar, avisar, enfocarTablero, salir };
}

// Cada columna es un botón: el clic, el foco, Enter y Espacio son nativos.
function crearColumna(columna) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'columna';
  boton.dataset.columna = columna;

  // celdas[0] es la inferior, igual que en el motor.
  const celdas = Array.from({ length: FILAS }, (_, fila) => {
    const celda = document.createElement('span');
    celda.className = 'celda';
    celda.setAttribute('aria-hidden', 'true');
    celda.style.setProperty('--caida', FILAS - fila);
    const ficha = document.createElement('span');
    ficha.className = 'ficha';
    celda.append(ficha);
    return celda;
  });
  boton.append(...celdas.toReversed());
  return { boton, celdas };
}

function dibujarFicha(elemento, jugador) {
  delete elemento.dataset.previa;
  if (jugador === 0) delete elemento.dataset.jugador;
  else elemento.dataset.jugador = jugador;
}

function crearPapelitos(ganador) {
  const capa = document.createElement('div');
  capa.className = 'papelitos';
  capa.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < PAPELITOS; i++) {
    const papelito = document.createElement('span');
    const azar = (minimo, maximo) => minimo + Math.random() * (maximo - minimo);
    papelito.className = 'papelito';
    papelito.style.setProperty('--color', i % 3 === 0 ? '#fff' : `var(--color-${ganador})`);
    papelito.style.setProperty('--x', `${azar(0, 100)}%`);
    papelito.style.setProperty('--desvio', `${azar(-80, 80)}px`);
    papelito.style.setProperty('--giro', `${azar(-540, 540)}deg`);
    papelito.style.setProperty('--demora', `${azar(0, 900)}ms`);
    papelito.style.setProperty('--duracion', `${azar(1800, 2800)}ms`);
    capa.append(papelito);
  }
  return capa;
}

function describirColumna(tablero, columna, jugadores) {
  const fichas = tablero
    .map((fila) => fila[columna])
    .filter((jugador) => jugador !== 0)
    .map((jugador) => jugadores[jugador - 1].nombre);
  if (fichas.length === 0) return `Columna ${columna + 1}: vacía`;
  const llena = fichas.length === FILAS ? ', llena' : '';
  return `Columna ${columna + 1}${llena}, de abajo hacia arriba: ${fichas.join(', ')}`;
}

function clave({ fila, columna }) {
  return `${fila},${columna}`;
}
