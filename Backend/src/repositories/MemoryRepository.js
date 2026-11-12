// Repositorio compartido para los recursos de esta entrega. Persistencia en memoria.
export default class MemoryRepository {
    #registros = [];
    #siguienteId = 1;

    findAll() { return this.#registros.map((registro) => ({ ...registro })); }
    findById(id) { return this.#registros.find((registro) => registro.id === id) ?? null; }
    create(datos) {
        const registro = { ...datos, id: this.#siguienteId++ };
        this.#registros.push(registro);
        return registro;
    }
    update(id, datos) {
        const index = this.#registros.findIndex((registro) => registro.id === id);
        if (index === -1) return null;
        this.#registros[index] = { ...datos, id };
        return this.#registros[index];
    }
    delete(id) {
        const index = this.#registros.findIndex((registro) => registro.id === id);
        return index === -1 ? null : this.#registros.splice(index, 1)[0];
    }
}
