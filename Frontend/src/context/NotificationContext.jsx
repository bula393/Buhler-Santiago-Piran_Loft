import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

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
      setNotificaciones((actuales) => {
        if (actuales.some((actual) => actual.mensaje === mensaje && actual.tipo === tipo)) return actuales;
        return [...actuales.slice(-3), { id, mensaje, tipo }];
      });
    },
    []
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
