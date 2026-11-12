import { buscar, moneda, saldoReserva, totalPagado } from "../utils/gestion.js";

export default function ReservaSummary({ datos, reservaId }) {
  const reserva = buscar(datos.reservas, reservaId);
  if (!reserva) return null;
  return (
    <dl className="resumen-reserva" aria-label="Resumen de importes de la reserva">
      <div><dt>Total de la estadía</dt><dd>{moneda(reserva.montoTotal)}</dd></div>
      <div><dt>Pagos aprobados</dt><dd>{moneda(totalPagado(datos, reserva.id))}</dd></div>
      <div><dt>Saldo pendiente</dt><dd>{moneda(saldoReserva(datos, reserva))}</dd></div>
    </dl>
  );
}
