import Button from "./Button.jsx";
import { useEffect } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";

function ErrorState({ mensaje, onReintentar }) {
  const { notificar } = useNotifications();
  useEffect(() => { notificar(mensaje, "error"); }, [mensaje, notificar]);
  return (
    <div className="estado estado--error" role="alert">
      <p>{mensaje}</p>
      {onReintentar && (
        <Button variante="secundario" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
