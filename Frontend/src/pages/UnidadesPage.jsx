import { useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import UnidadCard from "../components/UnidadCard.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import useAsync from "../hooks/useAsync.js";
import { deleteUnidad, getUnidades } from "../services/unidadService.js";
import { MENSAJES, RUTAS } from "../utils/constants.js";

function UnidadesPage() {
  const { data: unidades, error, loading, reload } = useAsync(getUnidades);
  const { notificar } = useNotifications();
  const [unidadAEliminar, setUnidadAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      await deleteUnidad(unidadAEliminar.id);
      notificar(MENSAJES.unidadEliminada);
      setUnidadAEliminar(null);
      reload();
    } catch (err) {
      notificar(err.message || MENSAJES.errorEliminar, "error");
    } finally {
      setEliminando(false);
    }
  };

  let contenido;
  if (loading) {
    contenido = <LoadingState mensaje={MENSAJES.cargandoUnidades} />;
  } else if (error) {
    contenido = <ErrorState mensaje={error.message} onReintentar={reload} />;
  } else if (unidades.length === 0) {
    contenido = (
      <EmptyState>
        <p>{MENSAJES.sinUnidades}</p>
        <Button to={RUTAS.nuevaUnidad}>Crear primera unidad</Button>
      </EmptyState>
    );
  } else {
    contenido = (
      <ul className="grilla">
        {unidades.map((unidad) => (
          <li key={unidad.id}>
            <UnidadCard unidad={unidad} onEliminar={setUnidadAEliminar} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section>
      <div className="encabezado-pagina">
        <h1>Unidades</h1>
        <Button to={RUTAS.nuevaUnidad}>Nueva unidad</Button>
      </div>

      {contenido}

      {unidadAEliminar && (
        <ConfirmDialog
          titulo="Eliminar unidad"
          mensaje={MENSAJES.confirmarEliminar(unidadAEliminar.nombre)}
          textoConfirmar="Eliminar"
          procesando={eliminando}
          onConfirmar={confirmarEliminacion}
          onCancelar={() => setUnidadAEliminar(null)}
        />
      )}
    </section>
  );
}

export default UnidadesPage;
