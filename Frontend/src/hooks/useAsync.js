import { useCallback, useEffect, useRef, useState } from "react";

// Solo la solicitud más reciente puede actualizar el estado de la pantalla.
function useAsync(fetcher, dependencias = []) {
  const [estado, setEstado] = useState({ data: null, error: null, loading: true });
  const fetcherRef = useRef(fetcher);
  const solicitudRef = useRef(0);
  fetcherRef.current = fetcher;

  const cargar = useCallback(async () => {
    const solicitud = ++solicitudRef.current;
    setEstado((previo) => ({ ...previo, loading: true, error: null }));
    try {
      const data = await fetcherRef.current();
      if (solicitud === solicitudRef.current) setEstado({ data, error: null, loading: false });
    } catch (error) {
      if (solicitud === solicitudRef.current) setEstado({ data: null, error, loading: false });
    }
  }, []);

  useEffect(() => {
    cargar();
    return () => { solicitudRef.current += 1; };
    // Los identificadores del recurso determinan cuándo volver a cargar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargar, ...dependencias]);

  return { ...estado, reload: cargar };
}

export default useAsync;
