const unidades = [];
let siguienteId = 1;

class UnidadRepository {
    findAll() { return [...unidades]; }
    findById(id) { return unidades.find((unidad) => unidad.id === id) ?? null; }
    create(datos) {
        const unidad = { ...datos, id: siguienteId++ };
        unidades.push(unidad);
        return unidad;
    }
    update(id, datos) {
        const index = unidades.findIndex((unidad) => unidad.id === id);
        if (index === -1) return null;
        unidades[index] = { ...unidades[index], ...datos, id };
        return unidades[index];
    }
    delete(id) {
        const index = unidades.findIndex((unidad) => unidad.id === id);
        if (index === -1) return null;
        return unidades.splice(index, 1)[0];
    }
}
export default new UnidadRepository();


