import { NavLink } from "react-router-dom";
import logo from "../assets/loft-logo.svg";
import { RUTAS } from "../utils/constants.js";

function Header() {
  return (
    <header className="encabezado">
      <a className="enlace-omitir" href="#contenido-principal">
        Saltar al contenido
      </a>
      <NavLink to={RUTAS.inicio} className="encabezado__marca">
        <img src={logo} alt="Logo de Loft" width="36" height="36" />
        <span>Loft</span>
      </NavLink>
      <nav aria-label="Navegación principal">
        <NavLink to={RUTAS.unidades} end>
          Unidades
        </NavLink>
        <NavLink to={RUTAS.nuevaUnidad}>Nueva unidad</NavLink>
      </nav>
    </header>
  );
}

export default Header;
