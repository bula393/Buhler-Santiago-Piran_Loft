import { useEffect, useRef, useState } from "react";
import Button from "./Button.jsx";
import FormField from "./FormField.jsx";
import { buscarDirecciones } from "../services/direccionService.js";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function DireccionSearch({ direccion, error, onCambiar, onSeleccionar, bloqueado }) {
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState(null);
  const solicitud = useRef(0);
  const { notificar } = useNotifications();
  useEffect(() => { solicitud.current += 1; setResultados(null); setBuscando(false); }, [direccion]);
  useEffect(() => () => { solicitud.current += 1; }, []);

  const buscar = async () => {
    if (buscando || bloqueado) return;
    if (direccion.trim().length < 4) {
      notificar("Escribí calle, número y ciudad antes de buscar.", "error");
      return;
    }
    const actual = ++solicitud.current;
    setBuscando(true);
    setResultados(null);
    try {
      const encontrados = await buscarDirecciones(direccion);
      if (actual === solicitud.current) setResultados(encontrados);
    } catch (err) {
      if (actual === solicitud.current) notificar(err.message, "error");
    } finally { if (actual === solicitud.current) setBuscando(false); }
  };

  return (
    <div className="direccion-busqueda">
      <FormField id="direccion" name="direccion" label="Dirección *" value={direccion} error={error}
        maxLength={200} required placeholder="Ej.: Avenida Corrientes 1000, Buenos Aires" autoComplete="street-address"
        onChange={onCambiar} onKeyDown={(evento) => { if (evento.key === "Enter") { evento.preventDefault(); buscar(); } }} />
      <p className="campo__ayuda">Escribí calle, número y ciudad. Elegí un resultado para ubicar el alojamiento.</p>
      <Button variante="secundario" onClick={buscar} disabled={buscando || bloqueado}>
        {buscando ? "Buscando dirección…" : "Buscar dirección en el mapa"}
      </Button>
      <p className="solo-lectores" role="status">{buscando ? "Buscando direcciones" : resultados ? `${resultados.length} direcciones encontradas` : ""}</p>
      {resultados?.length === 0 && <p className="campo__ayuda" role="status">No encontramos esa dirección. Revisá el nombre de la calle o agregá la ciudad y el país.</p>}
      {resultados?.length > 0 && <ul className="direcciones-resultados" aria-label="Direcciones encontradas">
        {resultados.map((resultado, indice) => <li key={`${resultado.direccion}-${indice}`}>
          <button type="button" disabled={bloqueado} onClick={() => { onSeleccionar(resultado); setResultados(null); }}>
            {resultado.direccion}<span>Usar esta dirección</span>
          </button>
        </li>)}
      </ul>}
      <p className="campo__ayuda">Búsqueda de calles: <a href="https://photon.komoot.io" target="_blank" rel="noreferrer">Photon</a> · datos de OpenStreetMap.</p>
    </div>
  );
}
