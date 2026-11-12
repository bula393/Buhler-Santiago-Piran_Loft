import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EtiquetaDisponibilidad from "../components/EtiquetaDisponibilidad.jsx";
import LoadingState from "../components/LoadingState.jsx";
import UbicacionMap from "../components/UbicacionMap.jsx";
import { coordenadasValidas } from "../utils/ubicacion.js";
import { useNotifications } from "../context/NotificationContext.jsx";
import useAsync from "../hooks/useAsync.js";
import { deleteUnidad, getUnidadById } from "../services/unidadService.js";
import { MENSAJES, RUTAS } from "../utils/constants.js";
import { formatearCapacidad } from "../utils/formatters.js";

function UnidadDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notificar } = useNotifications();
  const { data: unidad, error, loading, reload } = useAsync(() => getUnidadById(id), [id]);
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const eliminar = async () => {
    if (eliminando) return;
    setEliminando(true);
    try {
      await deleteUnidad(unidad.id);
      notificar(MENSAJES.unidadEliminada);
      navigate(RUTAS.unidades);
    } catch (err) {
      notificar(err.message || MENSAJES.errorEliminar, "error");
      setEliminando(false);
      setConfirmando(false);
    }
  };

  if (loading) return <LoadingState mensaje={MENSAJES.cargandoUnidad} />;
  if (error) return <ErrorState mensaje={error.message} onReintentar={reload} />;

  return (
    <article className="detalle">
      <div className="encabezado-pagina">
        <h1>{unidad.nombre}</h1>
        <EtiquetaDisponibilidad disponible={unidad.disponible} />
      </div>

      <dl className="detalle__datos">
        <div>
          <dt>Dirección</dt>
          <dd>{unidad.direccion}</dd>
        </div>
        <div>
          <dt>Capacidad</dt>
          <dd>{formatearCapacidad(unidad.capacidad)}</dd>
        </div>
        <div>
          <dt>Descripción</dt>
          <dd>{unidad.descripcion || "Sin descripción."}</dd>
        </div>
      </dl>

      <section className="detalle__ubicacion" aria-labelledby="detalle-ubicacion">
        <h2 id="detalle-ubicacion">Ubicación</h2>
        {coordenadasValidas(unidad.latitud, unidad.longitud)
          ? <UbicacionMap latitud={unidad.latitud} longitud={unidad.longitud} direccion={unidad.direccion} />
          : <p className="texto-suave">Esta unidad todavía no tiene un punto en el mapa. Podés agregarlo al editarla.</p>}
      </section>

      <div className="acciones">
        <Button to={RUTAS.unidades} variante="secundario">
          Volver
        </Button>
        <Button to={RUTAS.editarUnidad(unidad.id)}>Editar</Button>
        <Button variante="peligro" onClick={(evento) => { evento.currentTarget.focus(); setConfirmando(true); }}>
          Eliminar
        </Button>
      </div>

      {confirmando && (
        <ConfirmDialog
          titulo="Eliminar unidad"
          mensaje={MENSAJES.confirmarEliminar(unidad.nombre)}
          textoConfirmar="Eliminar"
          procesando={eliminando}
          onConfirmar={eliminar}
          onCancelar={() => setConfirmando(false)}
        />
      )}
    </article>
  );
}

export default UnidadDetallePage;
