import Unidad from "../models/Unidad.js";
import unidadRepository from "../repositories/UnidadRepository.js";
import { Messages } from "../enums/Messages.js";
import { BadRequestError, NotFoundError } from "../exceptions/AppError.js";

const camposPermitidos = ["nombre", "descripcion", "capacidad", "direccion", "disponible"];

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
        return unidadRepository.create(unidad);
    }

    update(id, datos) {
        this.getById(id);
        this.#validarDatos(datos, false);
        const actualizados = Object.fromEntries(
            Object.entries(datos).map(([campo, valor]) => [
                campo, typeof valor === "string" ? valor.trim() : valor
            ])
        );
        return unidadRepository.update(id, actualizados);
    }

    delete(id) {
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
        const camposRequeridos = completo ? camposPermitidos : claves;
        const faltanCampos = camposRequeridos.some((campo) =>
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
}
export default new UnidadService();


