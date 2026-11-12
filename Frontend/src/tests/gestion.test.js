import test from "node:test";
import assert from "node:assert/strict";
import { gestionConfig } from "../utils/gestionConfig.js";
import { prepararRegistro, validarRegistro, saldoReserva, totalPagado } from "../utils/gestion.js";
import { prepararUnidad, validarUnidad, aValoresFormulario } from "../utils/unidadFormulario.js";
import { coordenadasValidas } from "../utils/ubicacion.js";

const datos = { huespedes: [{ id: 1, nombre: "Prueba" }], unidades: [{ id: 1, nombre: "Loft", capacidad: 2, disponible: true }],
  reservas: [{ id: 1, montoTotal: 1000 }], pagos: [
    { id: 1, reservaId: 1, estado: "aprobado", monto: 250.1 },
    { id: 2, reservaId: 1, estado: "rechazado", monto: 900 },
    { id: 3, reservaId: 1, estado: "anulado", monto: 500 }
  ], resenas: [] };

test("Los pagos rechazados y anulados no descuentan saldo", () => {
  assert.equal(totalPagado(datos, 1), 250.1);
  assert.equal(saldoReserva(datos, datos.reservas[0]), 749.9);
});

test("Los formularios detectan fechas imposibles, intervalos y decimales", () => {
  const campos = gestionConfig.reservas.campos(datos);
  const valores = { huespedId: "1", unidadId: "1", fechaInicio: "2020-01-01", fechaFin: "2020-01-03", cantidadHuespedes: "2", montoTotal: "1000.25", estado: "pendiente", metodoPago: "tarjeta_simulada" };
  assert.deepEqual(validarRegistro(valores, campos, "reservas"), {});
  assert.ok(validarRegistro({ ...valores, fechaInicio: "2020-02-30" }, campos, "reservas").fechaInicio);
  assert.ok(validarRegistro({ ...valores, fechaFin: valores.fechaInicio }, campos, "reservas").fechaFin);
  assert.ok(validarRegistro({ ...valores, cantidadHuespedes: "1.5" }, campos, "reservas").cantidadHuespedes);
  assert.ok(validarRegistro({ ...valores, montoTotal: "1.001" }, campos, "reservas").montoTotal);
  const preparado = prepararRegistro(valores, campos);
  assert.equal(preparado.huespedId, 1);
  assert.equal(preparado.montoTotal, 1000.25);
});

test("La ubicación es opcional, acepta cero y valida ambas coordenadas", () => {
  const unidad = { nombre: "Loft", direccion: "Dirección", descripcion: "", capacidad: "2", disponible: true, latitud: "", longitud: "" };
  assert.deepEqual(validarUnidad(unidad), {});
  assert.equal(prepararUnidad(unidad).latitud, null);
  assert.ok(validarUnidad({ ...unidad, latitud: "95", longitud: "0" }).latitud);
  assert.ok(validarUnidad({ ...unidad, latitud: "0", longitud: "" }).longitud);
  assert.equal(coordenadasValidas("0", "0"), true);
  assert.equal(coordenadasValidas("", "0"), false);
  assert.equal(coordenadasValidas(-34.6, -58.3), true);
  assert.equal(aValoresFormulario({ ...unidad, latitud: 0, longitud: 0 }).latitud, "0");
});
