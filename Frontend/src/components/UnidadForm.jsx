import { useState } from "react";
import Button from "./Button.jsx";
import FormField from "./FormField.jsx";
import { MENSAJES } from "../utils/constants.js";
import { validarUnidad } from "../utils/unidadFormulario.js";
import { useNotifications } from "../context/NotificationContext.jsx";
import UbicacionMap from "./UbicacionMap.jsx";
import DireccionSearch from "./DireccionSearch.jsx";

function UnidadForm({ valoresIniciales, guardando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const { notificar } = useNotifications();
  const hayErrores = Object.values(errores).some(Boolean);

  const cambiarCampo = (evento) => {
    const { name, value, type, checked } = evento.target;
    setValores((previos) => ({ ...previos, [name]: type === "checkbox" ? checked : value,
      ...(name === "direccion" ? { latitud: "", longitud: "" } : {}) }));
    setErrores((previos) => ({ ...previos, [name]: undefined }));
  };

  const enviar = (evento) => {
    evento.preventDefault();
    if (guardando) return;
    const erroresValidacion = validarUnidad(valores);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length === 0) onGuardar(valores);
    else {
      notificar(MENSAJES.formularioConErrores, "error");
      evento.currentTarget.elements.namedItem(Object.keys(erroresValidacion)[0])?.focus();
    }
  };

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <p className="texto-suave">Completá los datos de tu alojamiento. Los campos con * son obligatorios.</p>
      <fieldset disabled={guardando} className="formulario__campos" aria-busy={guardando}>
        {hayErrores && (
          <p className="formulario__resumen" role="alert">
            {MENSAJES.formularioConErrores}
          </p>
        )}

        <FormField
          id="nombre"
          name="nombre"
          label="Nombre *"
          value={valores.nombre}
          onChange={cambiarCampo}
          error={errores.nombre}
          required
        />
        <DireccionSearch direccion={valores.direccion} error={errores.direccion} onCambiar={cambiarCampo}
          bloqueado={guardando} onSeleccionar={({ direccion, latitud, longitud }) => {
            setValores((previos) => ({ ...previos, direccion, latitud: String(latitud), longitud: String(longitud) }));
            setErrores((previos) => ({ ...previos, direccion: undefined, latitud: undefined, longitud: undefined }));
          }} />
        <FormField
          id="capacidad"
          name="capacidad"
          label="Capacidad (huéspedes) *"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={valores.capacidad}
          onChange={cambiarCampo}
          error={errores.capacidad}
          required
        />
        <section className="ubicacion-formulario" aria-labelledby="titulo-ubicacion">
          <h2 id="titulo-ubicacion">Ubicación en el mapa</h2>
          <p className="campo__ayuda">El mapa muestra la dirección que elegiste en la búsqueda.</p>
          <UbicacionMap latitud={valores.latitud} longitud={valores.longitud} direccion={valores.direccion} />
        </section>
        <FormField
          id="descripcion"
          name="descripcion"
          as="textarea"
          rows={4}
          label="Descripción"
          value={valores.descripcion}
          onChange={cambiarCampo}
        />

        <div className="campo campo--checkbox">
          <input
            id="disponible"
            name="disponible"
            type="checkbox"
            checked={valores.disponible}
            onChange={cambiarCampo}
          />
          <label htmlFor="disponible">Disponible para alquiler</label>
        </div>

        <div className="acciones">
          <Button variante="secundario" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

export default UnidadForm;
