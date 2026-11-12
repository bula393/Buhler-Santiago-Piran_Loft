import { etiquetaEstado } from "../utils/gestionConfig.js";

export default function StatusBadge({ estado }) {
  const variante = ["aprobado", "confirmada", "finalizada"].includes(estado) ? "ok"
    : ["rechazado", "cancelada"].includes(estado) ? "no" : "neutra";
  return <span className={`etiqueta etiqueta--${variante}`}>{etiquetaEstado(estado)}</span>;
}
