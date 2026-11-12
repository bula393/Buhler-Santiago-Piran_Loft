import { useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import UnidadCard from "../components/UnidadCard.jsx";
import UnidadFilters from "../components/UnidadFilters.jsx";
import { filtrarUnidades } from "../utils/filtrarUnidades.js";
import { useNotifications } from "../context/NotificationContext.jsx";
import useAsync from "../hooks/useAsync.js";
import { deleteUnidad, getUnidades } from "../services/unidadService.js";
import { MENSAJES, RUTAS } from "../utils/constants.js";

function UnidadesPage() {
  const { data: unidades, error, loading, reload } = useAsync(getUnidades);
  const { notificar } = useNotifications();
  const [unidadAEliminar, setUnidadAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("todas");
  const filtradas = filtrarUnidades(unidades ?? [], busqueda, disponibilidad);

  const confirmarEliminacion = async () => {
    if (eliminando) return;
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
  } else if (filtradas.length === 0) {
    contenido = (
      <EmptyState>
        <h2>No encontramos unidades</h2>
        <p>Probá con otro nombre, dirección o disponibilidad.</p>
        <Button variante="secundario" onClick={() => { setBusqueda(""); setDisponibilidad("todas"); }}>
          Limpiar filtros
        </Button>
      </EmptyState>
    );
  } else {
    contenido = (
      <ul className="grilla">
        {filtradas.map((unidad) => (
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
        <div>
          <h1>Unidades</h1>
          <p className="texto-suave">Cada alojamiento, en un solo lugar. Gestioná sus datos y disponibilidad.</p>
        </div>
        <Button to={RUTAS.nuevaUnidad}>Nueva unidad</Button>
      </div>

      {!loading && !error && unidades.length > 0 && (
        <>
          <UnidadFilters busqueda={busqueda} disponibilidad={disponibilidad}
            onBusqueda={setBusqueda} onDisponibilidad={setDisponibilidad} />
          <p className="resultados" role="status">
            {filtradas.length} de {unidades.length} {unidades.length === 1 ? "unidad" : "unidades"}
          </p>
        </>
      )}
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
