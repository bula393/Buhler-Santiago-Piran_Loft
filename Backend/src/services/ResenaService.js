import CrudService from "./CrudService.js";
import { reservaRepository, resenaRepository } from "../repositories/gestionRepositories.js";
import { exigir, idValido, texto, fechaValida, hoy } from "../utils/validaciones.js";

export default new CrudService(resenaRepository, ["reservaId", "puntaje", "comentario", "fecha"], (datos, id, anterior) => {
    const reserva = reservaRepository.findById(datos.reservaId);
    exigir(idValido(datos.reservaId) && reserva, "Seleccioná una reserva existente.");
    exigir(!anterior || anterior.reservaId === datos.reservaId, "Una reseña conserva su reserva original.");
    exigir(reserva.estado === "finalizada", "Las reseñas solo se registran para estadías finalizadas.");
    exigir(Number.isInteger(datos.puntaje) && datos.puntaje >= 1 && datos.puntaje <= 5, "El puntaje debe ser un entero entre 1 y 5.");
    exigir(texto(datos.comentario) && datos.comentario.length <= 2000, "Ingresá un comentario de hasta 2000 caracteres.");
    exigir(fechaValida(datos.fecha) && datos.fecha >= reserva.fechaFin && datos.fecha <= hoy(), "La fecha de la reseña debe estar entre la salida y hoy.");
    exigir(!resenaRepository.findAll().some((resena) => resena.id !== id && resena.reservaId === datos.reservaId), "Esta reserva ya tiene una reseña.");
});
