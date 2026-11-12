import CrudService from "./CrudService.js";
import { huespedRepository, reservaRepository } from "../repositories/gestionRepositories.js";
import { exigir, texto } from "../utils/validaciones.js";

export default new CrudService(huespedRepository, ["nombre", "email", "telefono", "documento"], (datos, id) => {
    exigir(texto(datos.nombre) && texto(datos.documento) && texto(datos.telefono), "Completá nombre, documento y teléfono.");
    exigir(datos.nombre.length <= 120 && datos.documento.length <= 40 && datos.telefono.length <= 40,
        "El nombre admite hasta 120 caracteres; documento y teléfono, hasta 40.");
    exigir(typeof datos.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email), "Ingresá un email válido.");
    exigir(datos.email.length <= 200, "El email admite hasta 200 caracteres.");
    exigir(!huespedRepository.findAll().some((huesped) => huesped.id !== id && (
        huesped.documento === datos.documento || huesped.email.toLowerCase() === datos.email.toLowerCase()
    )), "Ya existe un huésped con ese documento o email.");
}, (huesped) => {
    exigir(!reservaRepository.findAll().some((reserva) => reserva.huespedId === huesped.id), "Este huésped tiene reservas. Eliminá primero las reservas vinculadas.");
});
