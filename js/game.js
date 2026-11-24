// Reglas de la partida. Sin DOM ni efectos: cada jugada devuelve un estado nuevo.

export const FILAS = 6;
export const COLUMNAS = 7;
export const FICHAS_PARA_GANAR = 4;

const VACIA = 0;

// Horizontal, vertical y las dos diagonales.
const DIRECCIONES = [
  { df: 0, dc: 1 },
  { df: 1, dc: 0 },
  { df: 1, dc: 1 },
  { df: -1, dc: 1 },
];

// La fila 0 es la inferior.
export function crearPartida() {
  return {
    tablero: Array.from({ length: FILAS }, () => Array(COLUMNAS).fill(VACIA)),
    turno: 1,
    resultado: { tipo: 'en-curso' },
  };
}

export function jugar(estado, columna) {
  const motivo = motivoDeRechazo(estado, columna);
  if (motivo) return { ok: false, motivo, estado };

  const fila = filaDisponible(estado.tablero, columna);
  const tablero = colocar(estado.tablero, fila, columna, estado.turno);
  const resultado = evaluar(tablero, fila, columna);
  const turno = resultado.tipo === 'en-curso' ? rival(estado.turno) : estado.turno;

  return { ok: true, estado: { tablero, turno, resultado } };
}

// Fila donde caería una ficha, o -1 si la columna está llena.
export function filaDisponible(tablero, columna) {
  return tablero.findIndex((fila) => fila[columna] === VACIA);
}

// Celdas de todas las líneas que pasan por la ficha indicada.
export function buscarCeldasGanadoras(tablero, fila, columna) {
  const origen = { fila, columna };
  const otras = DIRECCIONES.flatMap(({ df, dc }) => {
    const vecinas = [
      ...contiguas(tablero, origen, df, dc),
      ...contiguas(tablero, origen, -df, -dc),
    ];
    return vecinas.length + 1 >= FICHAS_PARA_GANAR ? vecinas : [];
  });
  return otras.length > 0 ? [origen, ...otras] : [];
}

function motivoDeRechazo({ tablero, resultado }, columna) {
  if (resultado.tipo !== 'en-curso') return 'partida-terminada';
  if (!Number.isInteger(columna) || columna < 0 || columna >= COLUMNAS) return 'columna-invalida';
  if (filaDisponible(tablero, columna) === -1) return 'columna-llena';
  return null;
}

function colocar(tablero, fila, columna, jugador) {
  return tablero.map((celdas, f) => (f === fila ? celdas.with(columna, jugador) : [...celdas]));
}

// La victoria se evalúa antes que el empate: la última ficha puede ganar.
function evaluar(tablero, fila, columna) {
  const celdas = buscarCeldasGanadoras(tablero, fila, columna);
  if (celdas.length > 0) {
    return { tipo: 'victoria', ganador: tablero[fila][columna], celdas };
  }
  const lleno = tablero.every((celdasFila) => !celdasFila.includes(VACIA));
  return { tipo: lleno ? 'empate' : 'en-curso' };
}

// Celdas seguidas del mismo jugador en un sentido, sin contar la de origen.
function contiguas(tablero, { fila, columna }, df, dc) {
  const jugador = tablero[fila][columna];
  const celdas = [];
  let f = fila + df;
  let c = columna + dc;
  while (jugador !== VACIA && tablero[f]?.[c] === jugador) {
    celdas.push({ fila: f, columna: c });
    f += df;
    c += dc;
  }
  return celdas;
}

function rival(jugador) {
  return jugador === 1 ? 2 : 1;
}
