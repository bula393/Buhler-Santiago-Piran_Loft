import { useCallback, useEffect, useState } from "react";

// El fetcher se recrea en cada render, por eso la recarga depende solo de `dependencias`.
function useAsync(fetcher, dependencias = []) {
  const [estado, setEstado] = useState({ data: null, error: null, loading: true });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cargar = useCallback(async () => {
    setEstado((previo) => ({ ...previo, loading: true, error: null }));
    try {
      const data = await fetcher();
      setEstado({ data, error: null, loading: false });
    } catch (error) {
      setEstado({ data: null, error, loading: false });
    }
  }, dependencias);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { ...estado, reload: cargar };
}

export default useAsync;
