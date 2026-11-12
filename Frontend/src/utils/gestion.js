export const moneda = (valor) => new Intl.NumberFormat("es-AR", {
  style: "currency", currency: "ARS"
}).format(valor);

export const fecha = (valor) => new Intl.DateTimeFormat("es-AR", { timeZone: "UTC" })
  .format(new Date(`${valor}T00:00:00Z`));

export function hoy() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const parte = (tipo) => partes.find((p) => p.type === tipo).value;
  return `${parte("year")}-${parte("month")}-${parte("day")}`;
}

export const buscar = (lista, id) => lista.find((registro) => registro.id === Number(id));
export const nombreHuesped = (datos, id) => buscar(datos.huespedes, id)?.nombre ?? "Huésped eliminado";
export const nombreUnidad = (datos, id) => buscar(datos.unidades, id)?.nombre ?? "Unidad eliminada";
export const totalPagado = (datos, id) => datos.pagos.filter((pago) => pago.reservaId === Number(id) && pago.estado === "aprobado")
  .reduce((total, pago) => total + Math.round(pago.monto * 100), 0) / 100;
export const saldoReserva = (datos, reserva) => Math.round((reserva.montoTotal - totalPagado(datos, reserva.id)) * 100) / 100;
export const nombreReserva = (datos, id) => {
  const reserva = buscar(datos.reservas, id);
  return reserva ? `#${reserva.id} · ${nombreHuesped(datos, reserva.huespedId)} · ${nombreUnidad(datos, reserva.unidadId)}` : "Reserva eliminada";
};

export function prepararRegistro(valores, campos) {
  return Object.fromEntries(campos.map((campo) => [campo.name,
    campo.type === "number" || campo.numeric ? Number(valores[campo.name]) : String(valores[campo.name] ?? "").trim()
  ]));
}

export function validarRegistro(valores, campos, recurso) {
  const errores = {};
  for (const campo of campos) {
    const valor = String(valores[campo.name] ?? "").trim();
    if (!valor) errores[campo.name] = "Completá este campo.";
    else if (campo.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) errores[campo.name] = "Ingresá un email válido.";
    else if (campo.type === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(valor)
      || Number.isNaN(new Date(`${valor}T00:00:00Z`).getTime())
      || new Date(`${valor}T00:00:00Z`).toISOString().slice(0, 10) !== valor)) errores[campo.name] = "Ingresá una fecha válida.";
    else if (campo.type === "number") {
      const numero = Number(valor);
      if (!Number.isFinite(numero) || numero < campo.min || (campo.max != null && numero > campo.max)
        || (campo.step === "1" && !Number.isInteger(numero))
        || (campo.step === "0.01" && Math.abs(numero * 100 - Math.round(numero * 100)) > 0.00001)) {
        errores[campo.name] = campo.step === "1" ? "Ingresá un número entero válido." : "Ingresá un importe positivo con hasta dos decimales.";
      }
    }
    if (campo.maxLength && valor.length > campo.maxLength) errores[campo.name] = `Usá hasta ${campo.maxLength} caracteres.`;
  }
  if (recurso === "reservas" && valores.fechaFin <= valores.fechaInicio) errores.fechaFin = "La salida debe ser posterior al ingreso.";
  if ((recurso === "pagos" || recurso === "resenas") && valores.fecha > hoy()) errores.fecha = "La fecha no puede ser futura.";
  return errores;
}
