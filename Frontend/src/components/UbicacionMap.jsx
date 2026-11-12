import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import markerUrl from "leaflet/dist/images/marker-icon.png";
import markerRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import Button from "./Button.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import { CENTRO_INICIAL_MAPA, coordenadasValidas } from "../utils/ubicacion.js";

const icono = L.icon({ iconUrl: markerUrl, iconRetinaUrl: markerRetinaUrl, shadowUrl,
  iconSize: [25, 41], iconAnchor: [12, 41], shadowSize: [41, 41] });
const URL_MAPA = import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export default function UbicacionMap({ latitud, longitud, direccion }) {
  const contenedorRef = useRef(null);
  const mapaRef = useRef(null);
  const marcadorRef = useRef(null);
  const [errorMapa, setErrorMapa] = useState(false);
  const { notificar } = useNotifications();
  const tieneUbicacion = coordenadasValidas(latitud, longitud);

  useEffect(() => {
    const mapa = L.map(contenedorRef.current, { scrollWheelZoom: false, zoomAnimation: false, zoomControl: false,
      fadeAnimation: false, markerZoomAnimation: false }).setView(CENTRO_INICIAL_MAPA, 12);
    mapaRef.current = mapa;
    L.control.zoom({ zoomInTitle: "Acercar mapa", zoomOutTitle: "Alejar mapa" }).addTo(mapa);
    const tiles = L.tileLayer(URL_MAPA, { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(mapa);
    let avisoEnviado = false;
    tiles.on("tileerror", () => {
      setErrorMapa(true);
      if (!avisoEnviado) {
        avisoEnviado = true;
        notificar("No se pudo cargar parte del mapa. Revisá tu conexión y reintentá.", "error");
      }
    });
    const observador = new ResizeObserver(() => mapa.invalidateSize());
    observador.observe(contenedorRef.current);
    return () => {
      observador.disconnect();
      mapa.remove();
      mapaRef.current = null;
      marcadorRef.current = null;
    };
  }, [notificar]);

  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa) return;
    if (marcadorRef.current) { marcadorRef.current.remove(); marcadorRef.current = null; }
    if (tieneUbicacion) {
      const punto = [Number(latitud), Number(longitud)];
      marcadorRef.current = L.marker(punto, { icon: icono, alt: direccion || "Dirección del alojamiento" }).addTo(mapa);
      mapa.setView(punto, Math.max(mapa.getZoom(), 15), { animate: false });
    }
  }, [latitud, longitud, tieneUbicacion, direccion]);

  return (
    <div className="ubicacion">
      <div ref={contenedorRef} className="ubicacion__mapa" role="region" aria-label="Mapa del alojamiento. Usá las flechas para desplazar y más o menos para ampliar." />
      <p className="campo__ayuda" role="status">{tieneUbicacion
        ? "Dirección ubicada: " + (direccion || "alojamiento") + "."
        : "Buscá una calle y elegí una dirección para ubicar el alojamiento en el mapa."}</p>
      {errorMapa && <p className="campo__error">No se pudo cargar parte del mapa. <Button variante="secundario" onClick={() => {
        setErrorMapa(false);
        mapaRef.current.eachLayer((layer) => { if (layer instanceof L.TileLayer) layer.redraw(); });
      }}>Reintentar mapa</Button></p>}
      {tieneUbicacion && <a href={"https://www.openstreetmap.org/?mlat=" + Number(latitud) + "&mlon=" + Number(longitud) + "#map=17/" + Number(latitud) + "/" + Number(longitud)} target="_blank" rel="noreferrer">Abrir ubicación en OpenStreetMap</a>}
    </div>
  );
}
