import { NotFoundError } from "../exceptions/AppError.js";
import { limpiar, validarCampos } from "../utils/validaciones.js";

export default class CrudService {
    constructor(repository, campos, validar, antesDeEliminar = () => {}) {
        this.repository = repository;
        this.campos = campos;
        this.validar = validar;
        this.antesDeEliminar = antesDeEliminar;
    }

    getAll() { return this.repository.findAll(); }
    getById(id) {
        const registro = this.repository.findById(id);
        if (!registro) throw new NotFoundError("El registro solicitado no existe.");
        return registro;
    }
    create(datos) {
        validarCampos(datos, this.campos);
        const preparado = limpiar(datos);
        this.validar(preparado);
        return this.repository.create(preparado);
    }
    update(id, datos) {
        const anterior = this.getById(id);
        validarCampos(datos, this.campos);
        const preparado = { ...anterior, ...limpiar(datos) };
        this.validar(preparado, id, anterior);
        return this.repository.update(id, preparado);
    }
    delete(id) {
        const registro = this.getById(id);
        this.antesDeEliminar(registro);
        return this.repository.delete(id);
    }
}
