import { useEffect, useRef, useState } from "react";
import Button from "../components/Button.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import GestionForm from "../components/GestionForm.jsx";
import GestionTable from "../components/GestionTable.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import useAsync from "../hooks/useAsync.js";
import { getGestion, gestionServices } from "../services/gestionService.js";
import { gestionConfig } from "../utils/gestionConfig.js";

export default function GestionPage({ recurso }) {
  const config = gestionConfig[recurso];
  const { data: datos, error, loading, reload } = useAsync(getGestion, [recurso]);
  const { notificar } = useNotifications();
  const [formulario, setFormulario] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const nuevoRef = useRef(null);
  const recuperarFoco = useRef(false);
  useEffect(() => {
    if (!loading && !formulario && recuperarFoco.current) {
      const destino = nuevoRef.current?.disabled ? document.getElementById("contenido-principal") : nuevoRef.current;
      destino?.focus();
      recuperarFoco.current = false;
    }
  }, [loading, formulario]);
  const cerrarFormulario = () => { recuperarFoco.current = true; setFormulario(null); };

  const guardar = async (valores) => {
    if (procesando) return;
    setProcesando(true);
    try {
      const service = gestionServices[recurso];
      if (formulario.actual) await service.actualizar(formulario.actual.id, valores);
      else await service.crear(valores);
      notificar(recurso === "reservas" && !formulario.actual
        ? "Reserva y pago ficticio registrados correctamente."
        : "Los datos se guardaron correctamente.");
      recuperarFoco.current = true;
      setFormulario(null);
      await reload();
    } catch (err) { notificar(err.message, "error"); }
    finally { setProcesando(false); }
  };

  const eliminar = async () => {
    if (procesando) return;
    setProcesando(true);
    try {
      await gestionServices[recurso].eliminar(aEliminar.id);
      notificar("El registro se eliminó correctamente.");
      setAEliminar(null);
      await reload();
    } catch (err) { notificar(err.message, "error"); setAEliminar(null); }
    finally { setProcesando(false); }
  };

  if (loading) return <LoadingState mensaje={`Cargando ${config.titulo.toLowerCase()}…`} />;
  if (error) return <ErrorState mensaje={error.message} onReintentar={reload} />;

  const normalizar = (valor) => valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
  const registros = datos[recurso].filter((registro) => normalizar(config.columnas.map((columna) => columna.valor(registro, datos)).join(" "))
    .includes(normalizar(busqueda.trim())));
  const requisitos = recurso === "reservas" && (!datos.huespedes.length || !datos.unidades.length)
    ? "Primero registrá un huésped y una unidad desde sus secciones."
    : recurso === "pagos" && !datos.reservas.some((r) => r.estado !== "cancelada")
      ? "Primero creá una reserva activa desde Reservas."
      : recurso === "resenas" && !datos.reservas.some((r) => r.estado === "finalizada" && !datos.resenas.some((resena) => resena.reservaId === r.id))
        ? "Para una nueva reseña necesitás una reserva finalizada que todavía no tenga reseña." : null;

  return (
    <section>
      <div className="encabezado-pagina">
        <div><h1>{config.titulo}</h1><p className="texto-suave">{config.descripcion}</p></div>
        {!formulario && <Button ref={nuevoRef} onClick={() => setFormulario({ actual: null })} disabled={Boolean(requisitos)}>{config.accion}</Button>}
      </div>
      {config.aviso && <p className="aviso-practica">{config.aviso}</p>}
      {requisitos && <p className="ayuda-seccion">{requisitos}</p>}
      {formulario ? (
        <GestionForm key={formulario.actual?.id ?? "nuevo"} config={config} recurso={recurso} datos={datos}
          actual={formulario.actual} guardando={procesando} onGuardar={guardar} onCancelar={cerrarFormulario} />
      ) : datos[recurso].length === 0 ? (
        <EmptyState><h2>Todavía no hay {config.titulo.toLowerCase()}</h2><p>{config.vacio}</p></EmptyState>
      ) : (
        <>
          <div className="campo busqueda-gestion"><label htmlFor="buscar-registros">Buscar en {config.titulo.toLowerCase()}</label>
            <input id="buscar-registros" type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Escribí para filtrar el listado" />
          </div>
          <p className="resultados" role="status">{registros.length} de {datos[recurso].length} {datos[recurso].length === 1 ? "registro" : "registros"}</p>
          {registros.length ? <GestionTable registros={registros} config={config} datos={datos}
            onEditar={(actual) => setFormulario({ actual })} onEliminar={setAEliminar} />
            : <EmptyState><p>No hay coincidencias.</p><Button variante="secundario" onClick={() => setBusqueda("")}>Limpiar búsqueda</Button></EmptyState>}
        </>
      )}
      {aEliminar && <ConfirmDialog titulo={`Eliminar ${config.singular}`} mensaje={`Vas a eliminar el registro #${aEliminar.id}. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar" procesando={procesando} onConfirmar={eliminar} onCancelar={() => setAEliminar(null)} />}
    </section>
  );
}
