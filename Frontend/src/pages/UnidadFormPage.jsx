import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import UnidadForm from "../components/UnidadForm.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import useAsync from "../hooks/useAsync.js";
import { createUnidad, getUnidadById, updateUnidad } from "../services/unidadService.js";
import { MENSAJES, RUTAS, UNIDAD_VACIA } from "../utils/constants.js";
import { aValoresFormulario, prepararUnidad } from "../utils/unidadFormulario.js";

function UnidadFormPage() {
  const { id } = useParams();
  const esEdicion = id !== undefined;
  const navigate = useNavigate();
  const { notificar } = useNotifications();
  const { data: unidad, error, loading } = useAsync(
    () => (esEdicion ? getUnidadById(id) : Promise.resolve(null)),
    [id]
  );
  const [guardando, setGuardando] = useState(false);

  const guardar = async (valores) => {
    setGuardando(true);
    try {
      const datos = prepararUnidad(valores);
      const resultado = esEdicion
        ? await updateUnidad(id, datos)
        : await createUnidad(datos);
      notificar(esEdicion ? MENSAJES.unidadActualizada : MENSAJES.unidadCreada);
      navigate(RUTAS.detalleUnidad(resultado.id));
    } catch (err) {
      notificar(err.message || MENSAJES.errorGuardar, "error");
      setGuardando(false);
    }
  };

  if (loading) return <LoadingState mensaje={MENSAJES.cargandoUnidad} />;
  if (error) return <ErrorState mensaje={error.message} />;

  return (
    <section>
      <h1>{esEdicion ? "Editar unidad" : "Nueva unidad"}</h1>
      <UnidadForm
        key={unidad?.id ?? "nueva"}
        valoresIniciales={unidad ? aValoresFormulario(unidad) : UNIDAD_VACIA}
        guardando={guardando}
        onGuardar={guardar}
        onCancelar={() => navigate(esEdicion ? RUTAS.detalleUnidad(id) : RUTAS.unidades)}
      />
    </section>
  );
}

export default UnidadFormPage;
