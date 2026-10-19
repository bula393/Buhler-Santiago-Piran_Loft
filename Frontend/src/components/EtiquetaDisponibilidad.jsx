import { formatearDisponibilidad } from "../utils/formatters.js";

function EtiquetaDisponibilidad({ disponible }) {
  const clase = disponible ? "etiqueta--ok" : "etiqueta--no";
  return <span className={`etiqueta ${clase}`}>{formatearDisponibilidad(disponible)}</span>;
}

export default EtiquetaDisponibilidad;
