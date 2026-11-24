// Reglas de la configuración de jugadores. Sin DOM.

export const LARGO_MAXIMO = 12;

export const COLORES = [
  { id: 'mandarina', nombre: 'Mandarina', valor: '#f2913d' },
  { id: 'menta', nombre: 'Menta', valor: '#7fd6a8' },
  { id: 'rosa', nombre: 'Rosa', valor: '#f08bb4' },
  { id: 'lila', nombre: 'Lila', valor: '#b79cf0' },
  { id: 'crema', nombre: 'Crema', valor: '#f3e6c8' },
];

export const NOMBRES_POR_DEFECTO = ['Jugador 1', 'Jugador 2'];

// Lo que muestra el formulario la primera vez.
export function configuracionInicial() {
  return [
    { nombre: '', color: 'mandarina' },
    { nombre: '', color: 'lila' },
  ];
}

export function valorDeColor(id) {
  return COLORES.find((color) => color.id === id)?.valor;
}

// Recibe [{ nombre, color }, { nombre, color }]. Los errores indican el jugador (1 o 2).
export function validarConfiguracion(entrada) {
  const jugadores = entrada.map(({ nombre, color }, i) => ({
    nombre: nombre.trim() || NOMBRES_POR_DEFECTO[i],
    color,
  }));
  const errores = [
    ...jugadores.flatMap(errorDeLargo),
    ...errorDeNombresIguales(jugadores),
    ...jugadores.flatMap(errorDeColorInexistente),
    ...errorDeColoresIguales(jugadores),
  ];
  return errores.length > 0 ? { ok: false, errores } : { ok: true, jugadores };
}

// Cuenta caracteres y no unidades UTF-16: un emoji simple vale uno.
function errorDeLargo({ nombre }, i) {
  if ([...nombre].length <= LARGO_MAXIMO) return [];
  return [{
    campo: 'nombre',
    jugador: i + 1,
    mensaje: `El nombre del jugador ${i + 1} puede tener hasta ${LARGO_MAXIMO} caracteres.`,
  }];
}

function errorDeNombresIguales([primero, segundo]) {
  const normalizar = ({ nombre }) => nombre.normalize().toLocaleLowerCase('es');
  if (normalizar(primero) !== normalizar(segundo)) return [];
  return [{ campo: 'nombre', jugador: 2, mensaje: 'Los nombres deben ser distintos.' }];
}

function errorDeColorInexistente({ color }, i) {
  if (valorDeColor(color)) return [];
  return [{
    campo: 'color',
    jugador: i + 1,
    mensaje: `Elegí un color de la lista para el jugador ${i + 1}.`,
  }];
}

function errorDeColoresIguales([primero, segundo]) {
  if (primero.color !== segundo.color) return [];
  return [{ campo: 'color', jugador: 2, mensaje: 'Los colores deben ser distintos.' }];
}
