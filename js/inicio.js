// Pantalla de inicio: pide nombre y color de cada jugador.

import {
  COLORES,
  NOMBRES_POR_DEFECTO,
  configuracionInicial,
  validarConfiguracion,
  valorDeColor,
} from './jugadores.js';

export function crearInicio({ alEmpezar }) {
  const formulario = document.getElementById('inicio');
  const error = document.getElementById('inicio-error');
  const campos = NOMBRES_POR_DEFECTO.map((_, i) => crearCampos(i + 1));

  document.getElementById('inicio-jugadores').append(...campos.map(({ grupo }) => grupo));
  cargar(configuracionInicial());

  formulario.addEventListener('change', actualizarColores);
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    confirmar();
  });

  // Una tecla o un doble clic que vienen de "Cambiar jugadores" no empiezan otra partida.
  formulario.addEventListener('keydown', (evento) => {
    if (evento.repeat && evento.key === 'Enter') evento.preventDefault();
  });
  document.getElementById('empezar').addEventListener('click', (evento) => {
    if (evento.detail > 1) evento.preventDefault();
  });

  function confirmar() {
    const configuracion = validarConfiguracion(leer());
    mostrarErrores(configuracion.errores ?? []);
    if (configuracion.ok) alEmpezar(configuracion.jugadores);
  }

  function leer() {
    return campos.map(({ nombre, colores }) => ({
      nombre: nombre.value,
      color: colores.find((opcion) => opcion.checked)?.value,
    }));
  }

  function cargar(jugadores) {
    jugadores.forEach(({ nombre, color }, i) => {
      campos[i].nombre.value = nombre;
      for (const opcion of campos[i].colores) opcion.checked = opcion.value === color;
    });
    actualizarColores();
  }

  // El color de cada jugador queda no disponible para el otro.
  function actualizarColores() {
    const elegidos = leer().map(({ color }) => color);
    campos.forEach(({ grupo, colores }, i) => {
      grupo.style.setProperty(`--color-${i + 1}`, valorDeColor(elegidos[i]));
      for (const opcion of colores) opcion.disabled = opcion.value === elegidos[1 - i];
    });
  }

  function mostrarErrores(errores) {
    error.textContent = errores.map(({ mensaje }) => mensaje).join(' ');
    campos.forEach(({ nombre }, i) => {
      const invalido = errores.some(({ campo, jugador }) => campo === 'nombre' && jugador === i + 1);
      nombre.setAttribute('aria-invalid', String(invalido));
      if (invalido) nombre.setAttribute('aria-describedby', error.id);
      else nombre.removeAttribute('aria-describedby');
    });
    if (errores.length === 0) return;
    const { campo, jugador } = errores[0];
    const { nombre, colores } = campos[jugador - 1];
    (campo === 'nombre' ? nombre : colores.find((opcion) => opcion.checked) ?? colores[0]).focus();
  }

  function mostrar(jugadores) {
    cargar(jugadores);
    formulario.hidden = false;
    campos[0].nombre.focus();
  }

  function ocultar() {
    formulario.hidden = true;
  }

  return { mostrar, ocultar };
}

function crearCampos(jugador) {
  const grupo = crear('fieldset', { className: 'jugador' });
  const titulo = crear('legend', { textContent: `Jugador ${jugador}` });

  const muestra = crear('span', { className: 'muestra' });
  muestra.setAttribute('aria-hidden', 'true');
  const ficha = crear('span', { className: 'ficha' });
  ficha.dataset.jugador = jugador;
  muestra.append(ficha);

  const nombre = crear('input', {
    type: 'text',
    id: `nombre-${jugador}`,
    className: 'nombre',
    placeholder: NOMBRES_POR_DEFECTO[jugador - 1],
    autocomplete: 'off',
  });
  const etiqueta = crear('label', { htmlFor: nombre.id, textContent: 'Nombre' });
  etiqueta.append(crear('span', { className: 'solo-lectores', textContent: ` del jugador ${jugador}` }));

  const paleta = crear('fieldset', { className: 'paleta' });
  const tituloPaleta = crear('legend', { textContent: 'Color de ficha' });
  tituloPaleta.append(crear('span', { className: 'solo-lectores', textContent: ` del jugador ${jugador}` }));
  paleta.append(tituloPaleta);

  const colores = COLORES.map(({ id, nombre: nombreColor, valor }) => {
    const opcion = crear('input', { type: 'radio', name: `color-${jugador}`, value: id });
    const contenedor = crear('label', { className: 'opcion' });
    const disco = crear('span', { className: 'disco' });
    disco.style.setProperty('--color', valor);
    contenedor.append(opcion, disco, crear('span', { textContent: nombreColor }));
    paleta.append(contenedor);
    return opcion;
  });

  grupo.append(titulo, muestra, etiqueta, nombre, paleta);
  return { grupo, nombre, colores };
}

function crear(etiqueta, propiedades) {
  return Object.assign(document.createElement(etiqueta), propiedades);
}
