import { Link } from "react-router-dom";
import { MENSAJES, RUTAS } from "../utils/constants.js";

function NotFoundPage() {
  return (
    <section className="estado">
      <h1>Página no encontrada</h1>
      <p>{MENSAJES.paginaNoEncontrada}</p>
      <Link to={RUTAS.inicio}>Volver a unidades</Link>
    </section>
  );
}

export default NotFoundPage;
