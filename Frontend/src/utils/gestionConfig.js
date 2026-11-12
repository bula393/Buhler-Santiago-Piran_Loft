import { fecha, hoy, moneda, nombreHuesped, nombreUnidad, nombreReserva, saldoReserva } from "./gestion.js";

const opcion = (value, label) => ({ value, label });
export const estadosReserva = [opcion("pendiente", "Pendiente"), opcion("confirmada", "Confirmada"), opcion("finalizada", "Finalizada"), opcion("cancelada", "Cancelada")];
export const estadosPago = [opcion("aprobado", "Aprobado"), opcion("rechazado", "Rechazado"), opcion("anulado", "Anulado")];
export const metodosPago = [opcion("tarjeta_simulada", "Tarjeta simulada"), opcion("transferencia_simulada", "Transferencia simulada"), opcion("efectivo_simulado", "Efectivo simulado")];
export const etiquetaEstado = (valor) => [...estadosReserva, ...estadosPago].find((op) => op.value === valor)?.label ?? valor;

export const gestionConfig = {
  huespedes: {
    titulo: "Huéspedes", singular: "huésped", accion: "Nuevo huésped",
    descripcion: "Los datos de contacto de quienes se alojan con vos.",
    vacio: "Registrá el primer huésped para poder crear una reserva.",
    iniciales: () => ({ nombre: "", email: "", telefono: "", documento: "" }),
    campos: () => [
      { name: "nombre", label: "Nombre completo", autoComplete: "name", maxLength: 120 },
      { name: "email", label: "Email", type: "email", autoComplete: "email", maxLength: 200 },
      { name: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel", maxLength: 40 },
      { name: "documento", label: "Documento", maxLength: 40 }
    ],
    columnas: [
      { label: "Huésped", valor: (r) => r.nombre },
      { label: "Contacto", valor: (r) => `${r.email} · ${r.telefono}` },
      { label: "Documento", valor: (r) => r.documento }
    ]
  },
  reservas: {
    titulo: "Reservas", singular: "reserva", accion: "Nueva reserva",
    descripcion: "Organizá los ingresos, las salidas y el estado de cada estadía.",
    vacio: "Creá una reserva vinculando un huésped con una unidad disponible.",
    iniciales: () => ({ huespedId: "", unidadId: "", fechaInicio: "", fechaFin: "", cantidadHuespedes: "1", estado: "confirmada", montoTotal: "", metodoPago: "tarjeta_simulada" }),
    campos: (datos, actual) => {
      const vinculada = Boolean(actual && (datos.pagos.some((r) => r.reservaId === actual.id) || datos.resenas.some((r) => r.reservaId === actual.id)));
      return [
      { name: "huespedId", label: "Huésped", as: "select", numeric: true, disabled: vinculada, options: datos.huespedes.map((r) => opcion(r.id, r.nombre)) },
      { name: "unidadId", label: "Alojamiento", as: "select", numeric: true, disabled: vinculada, options: datos.unidades.map((r) => opcion(r.id, `${r.nombre} · capacidad ${r.capacidad}${r.disponible ? "" : " · no disponible"}`)) },
      { name: "fechaInicio", label: "Fecha de ingreso", type: "date", disabled: vinculada },
      { name: "fechaFin", label: "Fecha de salida", type: "date", disabled: vinculada },
      { name: "cantidadHuespedes", label: "Cantidad de huéspedes", type: "number", min: 1, step: "1" },
      { name: "montoTotal", label: "Total de la estadía (ARS)", type: "number", min: 0.01, max: 100000000, step: "0.01" },
      { name: "estado", label: "Estado", as: "select", options: actual ? estadosReserva : estadosReserva.filter((op) => op.value !== "cancelada") },
      ...(!actual ? [{ name: "metodoPago", label: "Cómo pagar la reserva (simulación)", as: "select", options: metodosPago }] : [])
      ];
    },
    columnas: [
      { label: "Reserva", valor: (r, d) => `#${r.id} · ${nombreHuesped(d, r.huespedId)}` },
      { label: "Alojamiento", valor: (r, d) => `${nombreUnidad(d, r.unidadId)} · ${r.cantidadHuespedes} ${r.cantidadHuespedes === 1 ? "huésped" : "huéspedes"}` },
      { label: "Estadía", valor: (r) => `${fecha(r.fechaInicio)} — ${fecha(r.fechaFin)}` },
      { label: "Total / saldo", valor: (r, d) => `${moneda(r.montoTotal)} · saldo ${moneda(saldoReserva(d, r))}` },
      { label: "Estado", valor: (r) => r.estado, estado: true }
    ]
  },
  pagos: {
    titulo: "Pagos ficticios", singular: "pago", accion: "Registrar pago ficticio",
    descripcion: "Simulá pagos parciales o totales y consultá el saldo de cada reserva.",
    aviso: "Modo de práctica: no se cobra dinero ni se solicitan datos de tarjetas o cuentas bancarias.",
    vacio: "Registrá un pago ficticio sobre una reserva para actualizar su saldo.",
    iniciales: () => ({ reservaId: "", monto: "", fecha: hoy(), metodoPago: "tarjeta_simulada", estado: "aprobado" }),
    campos: (datos, actual) => [
      { name: "reservaId", label: "Reserva", as: "select", numeric: true, disabled: Boolean(actual), options: datos.reservas.filter((r) => r.estado !== "cancelada" || r.id === actual?.reservaId).map((r) => opcion(r.id, `${nombreReserva(datos, r.id)} · saldo ${moneda(saldoReserva(datos, r))}`)) },
      { name: "monto", label: "Importe ficticio (ARS)", type: "number", min: 0.01, max: 100000000, step: "0.01" },
      { name: "fecha", label: "Fecha del pago", type: "date", max: hoy() },
      { name: "metodoPago", label: "Método de simulación", as: "select", options: metodosPago },
      { name: "estado", label: "Resultado de la simulación", as: "select", options: estadosPago }
    ],
    columnas: [
      { label: "Reserva", valor: (r, d) => nombreReserva(d, r.reservaId) },
      { label: "Importe", valor: (r) => moneda(r.monto) },
      { label: "Fecha", valor: (r) => fecha(r.fecha) },
      { label: "Método", valor: (r) => metodosPago.find((op) => op.value === r.metodoPago)?.label ?? r.metodoPago },
      { label: "Resultado", valor: (r) => r.estado, estado: true }
    ]
  },
  resenas: {
    titulo: "Reseñas", singular: "reseña", accion: "Nueva reseña",
    descripcion: "Guardá la experiencia de tus huéspedes después de cada estadía.",
    vacio: "Las reservas finalizadas pueden recibir una reseña con puntaje de 1 a 5.",
    iniciales: () => ({ reservaId: "", puntaje: "5", comentario: "", fecha: hoy() }),
    campos: (datos, actual) => [
      { name: "reservaId", label: "Estadía finalizada", as: "select", numeric: true, disabled: Boolean(actual), options: datos.reservas.filter((r) => r.estado === "finalizada" && !datos.resenas.some((resena) => resena.reservaId === r.id && resena.id !== actual?.id)).map((r) => opcion(r.id, nombreReserva(datos, r.id))) },
      { name: "puntaje", label: "Puntaje", as: "select", numeric: true, options: [5, 4, 3, 2, 1].map((n) => opcion(n, `${n} de 5`)) },
      { name: "comentario", label: "Comentario", as: "textarea", rows: 4, maxLength: 2000 },
      { name: "fecha", label: "Fecha de la reseña", type: "date", max: hoy() }
    ],
    columnas: [
      { label: "Estadía", valor: (r, d) => nombreReserva(d, r.reservaId) },
      { label: "Puntaje", valor: (r) => `${r.puntaje} / 5` },
      { label: "Comentario", valor: (r) => r.comentario },
      { label: "Fecha", valor: (r) => fecha(r.fecha) }
    ]
  }
};
