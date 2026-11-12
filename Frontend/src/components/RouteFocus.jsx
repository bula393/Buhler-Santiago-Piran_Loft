import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.getElementById("contenido-principal")?.focus();
    window.scrollTo(0, 0);
    const nombres = { unidades: "Unidades", reservas: "Reservas", huespedes: "Huéspedes", pagos: "Pagos ficticios", resenas: "Reseñas" };
    document.title = `Loft · ${nombres[pathname.split("/")[1]] ?? "Administración de alojamientos"}`;
  }, [pathname]);
  return null;
}
