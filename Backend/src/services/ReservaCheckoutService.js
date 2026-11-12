import reservaService from "./ReservaService.js";
import pagoService from "./PagoService.js";
import { reservaRepository } from "../repositories/gestionRepositories.js";
import { exigir, hoy, validarCampos } from "../utils/validaciones.js";

export function crearReservaConPago(datos) {
    validarCampos(datos, ["huespedId", "unidadId", "fechaInicio", "fechaFin", "estado", "montoTotal", "cantidadHuespedes", "metodoPago"]);
    const { metodoPago, ...datosReserva } = datos;
    exigir(["tarjeta_simulada", "transferencia_simulada", "efectivo_simulado"].includes(metodoPago), "Seleccioná cómo simular el pago de la reserva.");
    exigir(datosReserva.estado !== "cancelada", "Una nueva reserva con pago no puede estar cancelada.");
    const reserva = reservaService.create(datosReserva);
    try {
        const pago = pagoService.create({ reservaId: reserva.id, monto: reserva.montoTotal, fecha: hoy(), metodoPago, estado: "aprobado" });
        return { reserva, pago };
    } catch (error) {
        // Las operaciones son síncronas: ante un pago fallido no queda una reserva sin su pago.
        reservaRepository.delete(reserva.id);
        throw error;
    }
}
