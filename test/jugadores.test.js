// Escenarios de openspec: configuracion-jugadores que no necesitan navegador.
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { COLORES, configuracionInicial, validarConfiguracion } from '../js/jugadores.js';

const validar = (nombre1, nombre2, color1 = 'mandarina', color2 = 'lila') =>
  validarConfiguracion([
    { nombre: nombre1, color: color1 },
    { nombre: nombre2, color: color2 },
  ]);

function nombres(configuracion) {
  assert.equal(configuracion.ok, true);
  return configuracion.jugadores.map(({ nombre }) => nombre);
}

function assertError(configuracion, campo, jugador, mensaje) {
  assert.equal(configuracion.ok, false);
  assert.equal(configuracion.errores.length, 1);
  const [error] = configuracion.errores;
  assert.equal(error.campo, campo);
  assert.equal(error.jugador, jugador);
  assert.match(error.mensaje, mensaje);
}

describe('Elección de nombre', () => {
  test('Nombre elegido', () => {
    assert.deepEqual(nombres(validar('Ana', 'Beto')), ['Ana', 'Beto']);
  });

  test('Espacios sobrantes', () => {
    assert.deepEqual(nombres(validar('  Ana ', '\tBeto  ')), ['Ana', 'Beto']);
  });

  test('Nombre vacío', () => {
    assert.deepEqual(nombres(validar('', '   ')), ['Jugador 1', 'Jugador 2']);
  });

  test('Nombre de 12 caracteres', () => {
    assert.deepEqual(nombres(validar('abcdefghijkl', '  🎲🎲🎲🎲🎲🎲🎲🎲🎲🎲🎲🎲  ')),
      ['abcdefghijkl', '🎲🎲🎲🎲🎲🎲🎲🎲🎲🎲🎲🎲']);
  });

  test('Nombre demasiado largo', () => {
    assertError(validar('abcdefghijklm', 'Beto'), 'nombre', 1, /12 caracteres/);
    assertError(validar('Ana', 'abcdefghijklm'), 'nombre', 2, /12 caracteres/);
  });

  test('Caracteres especiales', () => {
    assert.deepEqual(nombres(validar('<b>Ñandú</b>', '& "Íñigo"')), ['<b>Ñandú</b>', '& "Íñigo"']);
  });
});

describe('Nombres distintos', () => {
  test('Nombres iguales', () => {
    assertError(validar('Ana', 'ana'), 'nombre', 2, /distintos/);
    assertError(validar(' Ñandú', 'ÑANDÚ '), 'nombre', 2, /distintos/);
  });

  test('Choque con el nombre por defecto', () => {
    assertError(validar('Jugador 2', ''), 'nombre', 2, /distintos/);
    assertError(validar('', 'jugador 1'), 'nombre', 2, /distintos/);
  });
});

describe('Elección de color', () => {
  test('Colores iniciales', () => {
    assert.deepEqual(configuracionInicial().map(({ color }) => color), ['mandarina', 'lila']);
    assert.equal(validarConfiguracion(configuracionInicial()).ok, true);
  });

  test('Color reconocible sin verlo', () => {
    assert.deepEqual(COLORES.map(({ nombre }) => nombre),
      ['Mandarina', 'Menta', 'Rosa', 'Lila', 'Crema']);
  });

  test('Color fuera de la lista', () => {
    assertError(validar('Ana', 'Beto', 'rojo', 'lila'), 'color', 1, /lista/);
  });
});

describe('Colores distintos', () => {
  test('Configuración con colores iguales', () => {
    assertError(validar('Ana', 'Beto', 'rosa', 'rosa'), 'color', 2, /distintos/);
  });
});

describe('Errores de configuración', () => {
  test('Rechazo', () => {
    const entrada = [{ nombre: 'Ana', color: 'rosa' }, { nombre: 'ana', color: 'rosa' }];
    const copia = structuredClone(entrada);
    const { ok, errores } = validarConfiguracion(entrada);
    assert.equal(ok, false);
    assert.deepEqual(errores.map(({ campo }) => campo), ['nombre', 'color']);
    assert.deepEqual(entrada, copia);
  });
});
