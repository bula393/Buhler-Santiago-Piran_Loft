import { useNotifications } from "../context/NotificationContext.jsx";

function NotificationList() {
  const { notificaciones, cerrar } = useNotifications();

  return (
    <div className="notificaciones" aria-live="polite">
      {notificaciones.map((notificacion) => (
        <div
          key={notificacion.id}
          className={`notificacion notificacion--${notificacion.tipo}`}
          role={notificacion.tipo === "error" ? "alert" : "status"}
        >
          <p>{notificacion.mensaje}</p>
          <button
            type="button"
            className="notificacion__cerrar"
            onClick={() => cerrar(notificacion.id)}
            aria-label="Cerrar notificación"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationList;
