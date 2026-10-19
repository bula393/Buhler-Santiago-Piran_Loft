import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const DURACION_NOTIFICACION_MS = 4000;

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const siguienteId = useRef(1);

  const cerrar = useCallback((id) => {
    setNotificaciones((actuales) => actuales.filter((notificacion) => notificacion.id !== id));
  }, []);

  const notificar = useCallback(
    (mensaje, tipo = "exito") => {
      const id = siguienteId.current++;
      setNotificaciones((actuales) => [...actuales, { id, mensaje, tipo }]);
      setTimeout(() => cerrar(id), DURACION_NOTIFICACION_MS);
    },
    [cerrar]
  );

  const valor = useMemo(
    () => ({ notificaciones, notificar, cerrar }),
    [notificaciones, notificar, cerrar]
  );

  return <NotificationContext.Provider value={valor}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const contexto = useContext(NotificationContext);
  if (!contexto) throw new Error("useNotifications debe usarse dentro de NotificationProvider.");
  return contexto;
}
