import { useEffect, useId, useRef } from "react";
import Button from "./Button.jsx";

function ConfirmDialog({
  titulo,
  mensaje,
  textoConfirmar = "Confirmar",
  procesando = false,
  onConfirmar,
  onCancelar
}) {
  const tituloId = useId();
  const mensajeId = useId();
  const botonCancelarRef = useRef(null);

  useEffect(() => {
    botonCancelarRef.current?.focus();
  }, []);

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key === "Escape" && !procesando) onCancelar();
    };
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [onCancelar, procesando]);

  return (
    <div className="modal-fondo">
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={mensajeId}
      >
        <h2 id={tituloId}>{titulo}</h2>
        <p id={mensajeId}>{mensaje}</p>
        <div className="acciones">
          <Button ref={botonCancelarRef} variante="secundario" onClick={onCancelar} disabled={procesando}>
            Cancelar
          </Button>
          <Button variante="peligro" onClick={onConfirmar} disabled={procesando}>
            {procesando ? "Procesando..." : textoConfirmar}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
