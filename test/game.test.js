// Un test por escenario de openspec: reglas-partida.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  COLUMNAS,
  FILAS,
  buscarCeldasGanadoras,
  crearPartida,
  jugar,
} from '../js/game.js';

// --- Ayudas ---

// Congela el estado: si el motor lo modificara, el test fallaría.
function congelar(valor) {
  if (typeof valor === 'object' && valor !== null) {
    Object.values(valor).forEach(congelar);
    Object.freeze(valor);
  }
  return valor;
}

// Construye un estado en curso desde un dibujo, con la fila superior primero.
function desdeDibujo(turno, ...filasDeArribaHaciaAbajo) {
  const estado = crearPartida();
  filasDeArribaHaciaAbajo.toReversed().forEach((dibujo, fila) => {
    [...dibujo].forEach((celda, columna) => {
      estado.tablero[fila][columna] = celda === '.' ? 0 : Number(celda);
    });
  });
  return congelar({ ...estado, turno });
}

function jugarOk(estado, columna) {
  const jugada = jugar(congelar(estado), columna);
  assert.equal(jugada.ok, true, `la jugada en la columna ${columna} debería ser válida`);
  return jugada.estado;
}

function secuencia(...columnas) {
  return columnas.reduce(jugarOk, crearPartida());
}

function assertRechazo(estado, columna, motivo) {
  const copia = structuredClone(estado);
  const jugada = jugar(congelar(estado), columna);
  assert.equal(jugada.ok, false);
  assert.equal(jugada.motivo, motivo);
  assert.deepEqual(jugada.estado, copia);
}

function assertVictoria(estado, ganador) {
  assert.equal(estado.resultado.tipo, 'victoria');
  assert.equal(estado.resultado.ganador, ganador);
}

// Compara celdas sin importar el orden, pero detectando repetidas.
function assertCeldas(celdas, esperadas) {
  const claves = celdas.map(({ fila, columna }) => `${fila},${columna}`).sort();
  assert.deepEqual(claves, esperadas.map(([f, c]) => `${f},${c}`).sort());
}

function todasLasLineas() {
  const lineas = [];
  for (const [df, dc] of [[0, 1], [1, 0], [1, 1], [-1, 1]]) {
    for (let f = 0; f < FILAS; f++) {
      for (let c = 0; c < COLUMNAS; c++) {
        const linea = [0, 1, 2, 3].map((k) => [f + df * k, c + dc * k]);
        const [ultimaFila, ultimaColumna] = linea[3];
        if (ultimaFila >= 0 && ultimaFila < FILAS && ultimaColumna < COLUMNAS) lineas.push(linea);
      }
    }
  }
  return lineas;
}

function sinLineas(tablero) {
  return tablero.every((fila, f) =>
    fila.every((_, c) => buscarCeldasGanadoras(tablero, f, c).length === 0));
}

const contarFichas = (tablero) => tablero.flat().filter((celda) => celda !== 0).length;

// Tableros con 41 fichas y solo la esquina superior izquierda libre; juega el 2.
const casiEmpate = () => desdeDibujo(2,
  '.211221',
  '1122112',
  '2211221',
  '1122112',
  '2211221',
  '1122112');

const casiVictoria = () => desdeDibujo(2,
  '.222111',
  '1122112',
  '2211221',
  '1122112',
  '2211221',
  '1122112');

// --- Escenarios ---

describe('Inicio de la partida', () => {
  test('Partida nueva', () => {
    const { tablero, turno, resultado } = crearPartida();
    assert.equal(tablero.length, 6);
    assert.ok(tablero.every((fila) => fila.length === 7));
    assert.equal(contarFichas(tablero), 0);
    assert.deepEqual(resultado, { tipo: 'en-curso' });
    assert.equal(turno, 1);
  });
});

describe('Caída por gravedad', () => {
  test('Columna vacía', () => {
    const { tablero } = secuencia(3);
    assert.equal(tablero[0][3], 1);
    assert.equal(contarFichas(tablero), 1);
  });

  test('Columna con fichas', () => {
    const { tablero } = secuencia(3, 3, 3);
    assert.deepEqual(tablero.map((fila) => fila[3]), [1, 2, 1, 0, 0, 0]);
    assert.equal(contarFichas(tablero), 3);
  });

  test('Última celda de la columna', () => {
    const { tablero } = secuencia(3, 3, 3, 3, 3, 3);
    assert.deepEqual(tablero.map((fila) => fila[3]), [1, 2, 1, 2, 1, 2]);
  });
});

describe('Alternancia de turnos', () => {
  test('Turno del Jugador 1 al Jugador 2', () => {
    assert.equal(secuencia(0).turno, 2);
  });

  test('Turno del Jugador 2 al Jugador 1', () => {
    assert.equal(secuencia(0, 1).turno, 1);
  });
});

describe('Rechazo de jugadas inválidas', () => {
  test('Columna llena', () => {
    assertRechazo(secuencia(0, 0, 0, 0, 0, 0), 0, 'columna-llena');
  });

  test('Columna inexistente', () => {
    for (const columna of [-1, 7, 1.5, NaN, Infinity, '3', null, undefined]) {
      assertRechazo(secuencia(0), columna, 'columna-invalida');
    }
  });
});

describe('Victoria por alineación', () => {
  test('Línea horizontal', () => {
    assertVictoria(secuencia(0, 0, 1, 1, 2, 2, 3), 1);
  });

  test('Línea vertical', () => {
    assertVictoria(secuencia(6, 0, 1, 0, 1, 0, 2, 0), 2);
  });

  test('Diagonal ascendente', () => {
    const estado = desdeDibujo(1,
      '..12...',
      '.121...',
      '1212...');
    assertVictoria(jugarOk(estado, 3), 1);
  });

  test('Diagonal descendente', () => {
    const estado = desdeDibujo(1,
      '...21..',
      '...121.',
      '...2121');
    assertVictoria(jugarOk(estado, 3), 1);
  });

  test('Ficha que completa la línea desde el medio', () => {
    assertVictoria(jugarOk(desdeDibujo(2, '22.2...'), 2), 2);
  });

  test('Más de 4 fichas', () => {
    assertVictoria(jugarOk(desdeDibujo(1, '11.11..'), 2), 1);
    assertVictoria(jugarOk(desdeDibujo(1, '111.111'), 3), 1);
  });

  test('Línea interrumpida por el rival', () => {
    const estado = jugarOk(desdeDibujo(1, '1121...'), 4);
    assert.equal(estado.resultado.tipo, 'en-curso');
  });

  test('Sin continuidad entre bordes', () => {
    const estado = jugarOk(desdeDibujo(1,
      '1......',
      '22...11'), 1);
    assert.equal(estado.resultado.tipo, 'en-curso');
  });

  test('Cobertura de todas las líneas', () => {
    const lineas = todasLasLineas();
    assert.equal(lineas.length, 69);

    let casos = 0;
    for (const linea of lineas) {
      const { tablero } = crearPartida();
      for (const [f, c] of linea) tablero[f][c] = 1;
      for (const [f, c] of linea) {
        assertCeldas(buscarCeldasGanadoras(tablero, f, c), linea);
        casos++;
      }
    }
    assert.equal(casos, 276);
  });
});

describe('Identificación de las líneas ganadoras', () => {
  test('Una línea de 4', () => {
    const estado = secuencia(0, 0, 1, 1, 2, 2, 3);
    assertVictoria(estado, 1);
    assertCeldas(estado.resultado.celdas, [[0, 0], [0, 1], [0, 2], [0, 3]]);
  });

  test('Una línea más larga', () => {
    const estado = jugarOk(desdeDibujo(1, '11.11..'), 2);
    assertCeldas(estado.resultado.celdas, [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]);
  });

  test('Varias líneas en una jugada', () => {
    // La última ficha es la esquina de una fila y una columna.
    const estado = jugarOk(desdeDibujo(1,
      '.111...',
      '1222...',
      '1212...',
      '1221...'), 0);
    assertVictoria(estado, 1);
    assertCeldas(estado.resultado.celdas, [
      [3, 0], [3, 1], [3, 2], [3, 3],
      [2, 0], [1, 0], [0, 0],
    ]);
  });
});

describe('Empate', () => {
  test('Tablero lleno sin línea', () => {
    const previo = casiEmpate();
    assert.equal(contarFichas(previo.tablero), 41);
    assert.ok(sinLineas(previo.tablero));
    assert.deepEqual(jugarOk(previo, 0).resultado, { tipo: 'empate' });
  });

  test('La última ficha gana', () => {
    const previo = casiVictoria();
    assert.equal(contarFichas(previo.tablero), 41);
    assert.ok(sinLineas(previo.tablero));
    const estado = jugarOk(previo, 0);
    assert.equal(contarFichas(estado.tablero), 42);
    assertVictoria(estado, 2);
  });
});

describe('Partida terminada', () => {
  test('Jugada después de una victoria', () => {
    assertRechazo(secuencia(0, 0, 1, 1, 2, 2, 3), 6, 'partida-terminada');
  });

  test('Jugada después de un empate', () => {
    const empate = jugarOk(casiEmpate(), 0);
    for (let columna = 0; columna < COLUMNAS; columna++) {
      assertRechazo(empate, columna, 'partida-terminada');
    }
  });
});

describe('Reinicio de la partida', () => {
  const assertNueva = (estado) => {
    assert.equal(contarFichas(estado.tablero), 0);
    assert.equal(estado.turno, 1);
    assert.deepEqual(estado.resultado, { tipo: 'en-curso' });
  };

  test('Reinicio con la partida en curso', () => {
    assert.equal(secuencia(0, 1, 2).turno, 2);
    assertNueva(crearPartida());
  });

  test('Reinicio con la partida terminada', () => {
    assertVictoria(secuencia(0, 0, 1, 1, 2, 2, 3), 1);
    assertNueva(crearPartida());
  });
});
