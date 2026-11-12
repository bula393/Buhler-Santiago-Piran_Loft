import CrudService from "./CrudService.js";
import unidadRepository from "../repositories/UnidadRepository.js";
import { huespedRepository, reservaRepository, pagoRepository, resenaRepository } from "../repositories/gestionRepositories.js";
import { exigir, idValido, fechaValida, hoy, montoValido, centavos } from "../utils/validaciones.js";

export default new CrudService(reservaRepository,
    ["huespedId", "unidadId", "fechaInicio", "fechaFin", "estado", "montoTotal", "cantidadHuespedes"],
    (datos, id, anterior) => {
        const unidad = unidadRepository.findById(datos.unidadId);
        exigir(idValido(datos.huespedId) && huespedRepository.findById(datos.huespedId), "Seleccioná un huésped existente.");
        exigir(idValido(datos.unidadId) && unidad, "Seleccioná una unidad existente.");
        exigir(fechaValida(datos.fechaInicio) && fechaValida(datos.fechaFin) && datos.fechaInicio < datos.fechaFin, "La salida debe ser posterior al ingreso y ambas fechas deben ser válidas.");
        exigir(["pendiente", "confirmada", "finalizada", "cancelada"].includes(datos.estado), "El estado de la reserva no es válido.");
        exigir(montoValido(datos.montoTotal), "El total debe ser mayor a cero, con hasta dos decimales.");
        exigir(idValido(datos.cantidadHuespedes) && datos.cantidadHuespedes <= unidad.capacidad, "La cantidad de huéspedes supera la capacidad del alojamiento o no es válida.");
        if (datos.estado !== "cancelada") {
            exigir(unidad.disponible || (anterior && anterior.unidadId === datos.unidadId
                && anterior.fechaInicio === datos.fechaInicio && anterior.fechaFin === datos.fechaFin), "La unidad no está habilitada para nuevas reservas.");
            exigir(!reservaRepository.findAll().some((reserva) => reserva.id !== id
                && reserva.unidadId === datos.unidadId && reserva.estado !== "cancelada"
                && reserva.fechaInicio < datos.fechaFin && datos.fechaInicio < reserva.fechaFin), "La unidad ya tiene una reserva en esas fechas.");
        }
        exigir(datos.estado !== "finalizada" || datos.fechaFin <= hoy(), "Solo podés finalizar estadías cuya fecha de salida ya llegó.");
        const pagos = pagoRepository.findAll().filter((pago) => pago.reservaId === id);
        const pagado = pagos.filter((pago) => pago.estado === "aprobado").reduce((total, pago) => total + centavos(pago.monto), 0);
        exigir(centavos(datos.montoTotal) >= pagado, "El total no puede ser menor al monto ya pagado.");
        exigir(datos.estado !== "cancelada" || pagado === 0, "Anulá los pagos aprobados antes de cancelar la reserva.");
        const tieneResena = resenaRepository.findAll().some((resena) => resena.reservaId === id);
        exigir(!tieneResena || datos.estado === "finalizada", "Una reserva con reseña debe permanecer finalizada.");
        exigir(!(pagos.length || tieneResena) || (anterior.huespedId === datos.huespedId
            && anterior.unidadId === datos.unidadId && anterior.fechaInicio === datos.fechaInicio
            && anterior.fechaFin === datos.fechaFin), "Una reserva con pagos o reseñas conserva su huésped, unidad y fechas.");
    },
    (reserva) => {
        exigir(!pagoRepository.findAll().some((pago) => pago.reservaId === reserva.id)
            && !resenaRepository.findAll().some((resena) => resena.reservaId === reserva.id), "Eliminá primero los pagos ficticios y reseñas vinculados a esta reserva.");
    }
);
