class Tarifa {
    constructor(id, unidadId, precioPorNoche, vigenciaDesde, vigenciaHasta, temporada) {
        this.id = id;
        this.unidadId = unidadId;
        this.precioPorNoche = precioPorNoche;
        this.vigenciaDesde = vigenciaDesde;
        this.vigenciaHasta = vigenciaHasta;
        this.temporada = temporada;
    }
}

export default Tarifa;
