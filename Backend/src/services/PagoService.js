import CrudService from "./CrudService.js";
import { reservaRepository, pagoRepository } from "../repositories/gestionRepositories.js";
import { exigir, idValido, montoValido, fechaValida, hoy, centavos } from "../utils/validaciones.js";

export default new CrudService(pagoRepository, ["reservaId", "monto", "fecha", "metodoPago", "estado"], (datos, id, anterior) => {
    const reserva = reservaRepository.findById(datos.reservaId);
    exigir(idValido(datos.reservaId) && reserva, "Seleccioná una reserva existente.");
    exigir(!anterior || anterior.reservaId === datos.reservaId, "Un pago conserva la reserva a la que pertenece.");
    exigir(montoValido(datos.monto), "El importe debe ser mayor a cero, con hasta dos decimales.");
    exigir(fechaValida(datos.fecha) && datos.fecha <= hoy(), "Ingresá una fecha de pago válida que no sea futura.");
    exigir(["tarjeta_simulada", "transferencia_simulada", "efectivo_simulado"].includes(datos.metodoPago), "Seleccioná un método de pago ficticio.");
    exigir(["aprobado", "rechazado", "anulado"].includes(datos.estado), "El estado del pago no es válido.");
    if (datos.estado === "aprobado") {
        exigir(reserva.estado !== "cancelada", "No se pueden aprobar pagos de una reserva cancelada.");
        const otrosPagos = pagoRepository.findAll().filter((pago) => pago.id !== id && pago.reservaId === datos.reservaId && pago.estado === "aprobado");
        const total = otrosPagos.reduce((suma, pago) => suma + centavos(pago.monto), 0) + centavos(datos.monto);
        exigir(total <= centavos(reserva.montoTotal), "El pago supera el saldo pendiente de la reserva.");
    }
});
