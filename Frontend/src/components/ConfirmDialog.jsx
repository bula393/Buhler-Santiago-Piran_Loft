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
  const dialogRef = useRef(null);

  useEffect(() => {
    const anterior = document.activeElement;
    const dialogo = dialogRef.current;
    dialogo.showModal();
    botonCancelarRef.current?.focus();
    return () => {
      dialogo.close();
      if (anterior?.isConnected) anterior.focus();
      else document.getElementById("contenido-principal")?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      aria-describedby={mensajeId}
      onCancel={(evento) => { evento.preventDefault(); if (!procesando) onCancelar(); }}
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
    </dialog>
  );
}

export default ConfirmDialog;
