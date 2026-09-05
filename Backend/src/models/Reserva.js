class Reserva {
    constructor(id, huespedId, unidadId, fechaInicio, fechaFin, estado, montoTotal) {
        this.id = id;
        this.huespedId = huespedId;
        this.unidadId = unidadId;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.montoTotal = montoTotal;
    }
}

export default Reserva;
