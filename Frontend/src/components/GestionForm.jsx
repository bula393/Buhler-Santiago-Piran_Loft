import { useEffect, useRef, useState } from "react";
import Button from "./Button.jsx";
import FormField from "./FormField.jsx";
import ReservaSummary from "./ReservaSummary.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import { moneda, prepararRegistro, validarRegistro } from "../utils/gestion.js";

export default function GestionForm({ config, recurso, datos, actual, guardando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(actual ?? config.iniciales());
  const [errores, setErrores] = useState({});
  const formRef = useRef(null);
  const { notificar } = useNotifications();
  const campos = config.campos(datos, actual);

  useEffect(() => {
    formRef.current?.querySelector("input:not(:disabled), select:not(:disabled), textarea:not(:disabled)")?.focus();
  }, []);

  const enviar = (evento) => {
    evento.preventDefault();
    if (guardando) return;
    const validacion = validarRegistro(valores, campos, recurso);
    setErrores(validacion);
    if (Object.keys(validacion).length) {
      notificar("Revisá los campos marcados antes de guardar.", "error");
      formRef.current.elements.namedItem(Object.keys(validacion)[0])?.focus();
      return;
    }
    onGuardar(prepararRegistro(valores, campos));
  };

  return (
    <form ref={formRef} className="formulario formulario--gestion" onSubmit={enviar} noValidate>
      <h2>{actual ? `Editar ${config.singular}` : config.accion}</h2>
      <p className="texto-suave">Todos los campos son obligatorios.</p>
      <fieldset className="formulario__campos" disabled={guardando} aria-busy={guardando}>
        {campos.map(({ name, label, options, numeric, ...props }) => (
          <div key={name}>
            <FormField {...props} id={`${recurso}-${name}`} name={name} label={label} required
              value={valores[name] ?? ""} error={errores[name]}
              onChange={(evento) => {
                setValores((previos) => ({ ...previos, [name]: evento.target.value }));
                setErrores((previos) => ({ ...previos, [name]: undefined }));
              }}>
              {options ? <><option value="">Seleccioná una opción</option>{options.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}</> : undefined}
            </FormField>
            {options?.length === 0 && <p className="campo__ayuda">No hay opciones disponibles. Revisá los registros relacionados.</p>}
          </div>
        ))}
        {recurso === "pagos" && <ReservaSummary datos={datos} reservaId={valores.reservaId} />}
        {recurso === "reservas" && <p className="campo__ayuda">La fecha de salida no ocupa esa noche. El total se ingresa para la estadía completa. Si hay pagos o reseñas, se conservan el huésped, el alojamiento y las fechas.</p>}
        {recurso === "reservas" && !actual && <div className="aviso-practica" role="status">
          <strong>Pago al confirmar: {moneda(Number(valores.montoTotal) || 0)}</strong>
          <p>Se registrará un pago ficticio aprobado por el total junto con la reserva. No se cobra dinero real.</p>
        </div>}
        {recurso === "pagos" && <p className="campo__ayuda">Solo los pagos aprobados reducen el saldo. Al editar, el saldo mostrado incluye el pago actual.</p>}
        <div className="acciones">
          <Button variante="secundario" disabled={guardando} onClick={onCancelar}>Cancelar</Button>
          <Button type="submit" disabled={guardando}>{guardando ? "Guardando…" : recurso === "reservas" && !actual ? "Confirmar reserva y pago ficticio" : recurso === "pagos" ? "Guardar pago ficticio" : "Guardar"}</Button>
        </div>
      </fieldset>
    </form>
  );
}
