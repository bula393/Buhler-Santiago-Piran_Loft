import { useState } from "react";
import Button from "./Button.jsx";
import FormField from "./FormField.jsx";
import { MENSAJES } from "../utils/constants.js";
import { validarUnidad } from "../utils/unidadFormulario.js";

function UnidadForm({ valoresIniciales, guardando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});
  const hayErrores = Object.keys(errores).length > 0;

  const cambiarCampo = (evento) => {
    const { name, value, type, checked } = evento.target;
    setValores((previos) => ({ ...previos, [name]: type === "checkbox" ? checked : value }));
    setErrores((previos) => ({ ...previos, [name]: undefined }));
  };

  const enviar = (evento) => {
    evento.preventDefault();
    const erroresValidacion = validarUnidad(valores);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length === 0) onGuardar(valores);
  };

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      {hayErrores && (
        <p className="formulario__resumen" role="alert">
          {MENSAJES.formularioConErrores}
        </p>
      )}

      <FormField
        id="nombre"
        name="nombre"
        label="Nombre"
        value={valores.nombre}
        onChange={cambiarCampo}
        error={errores.nombre}
        required
      />
      <FormField
        id="direccion"
        name="direccion"
        label="Dirección"
        value={valores.direccion}
        onChange={cambiarCampo}
        error={errores.direccion}
        required
      />
      <FormField
        id="capacidad"
        name="capacidad"
        label="Capacidad (huéspedes)"
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        value={valores.capacidad}
        onChange={cambiarCampo}
        error={errores.capacidad}
        required
      />
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
    </form>
  );
}

export default UnidadForm;
