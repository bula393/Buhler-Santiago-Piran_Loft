import Unidad from "../models/Unidad.js";
import unidadRepository from "../repositories/UnidadRepository.js";
import { Messages } from "../enums/Messages.js";
import { BadRequestError, NotFoundError } from "../exceptions/AppError.js";
import { reservaRepository } from "../repositories/gestionRepositories.js";
import { exigir } from "../utils/validaciones.js";

const camposRequeridos = ["nombre", "descripcion", "capacidad", "direccion", "disponible"];
const camposPermitidos = [...camposRequeridos, "latitud", "longitud"];

class UnidadService {
    getAll() { return unidadRepository.findAll(); }

    getById(id) {
        const unidad = unidadRepository.findById(id);
        if (!unidad) throw new NotFoundError(Messages.UNIDAD_NOT_FOUND);
        return unidad;
    }

    create(datos) {
        this.#validarDatos(datos, true);
        const unidad = new Unidad(
            undefined, datos.nombre.trim(), datos.descripcion.trim(),
            datos.capacidad, datos.direccion.trim(), datos.disponible
        );
        unidad.latitud = datos.latitud ?? null;
        unidad.longitud = datos.longitud ?? null;
        this.#validarUbicacion(unidad);
        return unidadRepository.create(unidad);
    }

    update(id, datos) {
        const anterior = this.getById(id);
        this.#validarDatos(datos, false);
        this.#validarUbicacion({ ...anterior, ...datos });
        exigir(!reservaRepository.findAll().some((reserva) => reserva.unidadId === id
            && reserva.estado !== "cancelada" && reserva.cantidadHuespedes > (datos.capacidad ?? anterior.capacidad)),
        "La capacidad no puede ser menor a la cantidad de huéspedes de una reserva existente.");
        const actualizados = Object.fromEntries(
            Object.entries(datos).map(([campo, valor]) => [
                campo, typeof valor === "string" ? valor.trim() : valor
            ])
        );
        return unidadRepository.update(id, actualizados);
    }

    delete(id) {
        this.getById(id);
        exigir(!reservaRepository.findAll().some((reserva) => reserva.unidadId === id),
            "Esta unidad tiene reservas. Eliminá primero las reservas vinculadas.");
        const eliminada = unidadRepository.delete(id);
        if (!eliminada) throw new NotFoundError(Messages.UNIDAD_NOT_FOUND);
        return eliminada;
    }

    #validarDatos(datos, completo) {
        if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
        const claves = Object.keys(datos);
        const camposDesconocidos = claves.some((campo) => !camposPermitidos.includes(campo));
        const requeridos = completo ? camposRequeridos : claves;
        const faltanCampos = requeridos.some((campo) =>
            !Object.prototype.hasOwnProperty.call(datos, campo)
        );
        if (claves.length === 0 || camposDesconocidos || faltanCampos) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }

        const { nombre, descripcion, capacidad, direccion, disponible } = datos;
        if (
            (nombre !== undefined && (typeof nombre !== "string" || !nombre.trim())) ||
            (descripcion !== undefined && typeof descripcion !== "string") ||
            (capacidad !== undefined && (!Number.isInteger(capacidad) || capacidad <= 0)) ||
            (direccion !== undefined && (typeof direccion !== "string" || !direccion.trim())) ||
            (disponible !== undefined && typeof disponible !== "boolean")
        ) {
            throw new BadRequestError(Messages.INVALID_DATA);
        }
    }

    #validarUbicacion({ latitud, longitud }) {
        const sinUbicacion = latitud == null && longitud == null;
        exigir(sinUbicacion || (typeof latitud === "number" && Number.isFinite(latitud) && Math.abs(latitud) <= 90
            && typeof longitud === "number" && Number.isFinite(longitud) && Math.abs(longitud) <= 180),
        "Ingresá latitud y longitud válidas, o dejá ambas vacías.");
    }
}
export default new UnidadService();


