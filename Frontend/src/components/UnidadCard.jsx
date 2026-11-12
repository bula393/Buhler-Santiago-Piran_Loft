import Button from "./Button.jsx";
import EtiquetaDisponibilidad from "./EtiquetaDisponibilidad.jsx";
import { RUTAS } from "../utils/constants.js";
import { formatearCapacidad } from "../utils/formatters.js";

function UnidadCard({ unidad, onEliminar }) {
  return (
    <article className="tarjeta">
      <header className="tarjeta__encabezado">
        <h2>{unidad.nombre}</h2>
        <EtiquetaDisponibilidad disponible={unidad.disponible} />
      </header>
      <p className="tarjeta__direccion">{unidad.direccion}</p>
      <p>{formatearCapacidad(unidad.capacidad)}</p>
      <p className="tarjeta__descripcion">{unidad.descripcion || "Sin descripción."}</p>
      <div className="acciones">
        <Button to={RUTAS.detalleUnidad(unidad.id)} variante="secundario" aria-label={`Ver ${unidad.nombre}`}>
          Ver detalle
        </Button>
        <Button to={RUTAS.editarUnidad(unidad.id)} variante="secundario" aria-label={`Editar ${unidad.nombre}`}>
          Editar
        </Button>
        <Button variante="peligro" onClick={(evento) => { evento.currentTarget.focus(); onEliminar(unidad); }} aria-label={`Eliminar ${unidad.nombre}`}>
          Eliminar
        </Button>
      </div>
    </article>
  );
}

export default UnidadCard;
