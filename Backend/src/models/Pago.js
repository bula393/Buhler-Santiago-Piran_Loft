class Pago {
    constructor(id, reservaId, monto, fecha, metodoPago, estado) {
        this.id = id;
        this.reservaId = reservaId;
        this.monto = monto;
        this.fecha = fecha;
        this.metodoPago = metodoPago;
        this.estado = estado;
    }
}

export default Pago;
