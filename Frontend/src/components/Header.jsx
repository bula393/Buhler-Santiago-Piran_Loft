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
        <span>Loft<small>Administración de alojamientos</small></span>
      </NavLink>
      <nav aria-label="Navegación principal">
        <NavLink to={RUTAS.unidades}>
          Unidades
        </NavLink>
        <NavLink to="/reservas">Reservas</NavLink>
        <NavLink to="/huespedes">Huéspedes</NavLink>
        <NavLink to="/pagos">Pagos ficticios</NavLink>
        <NavLink to="/resenas">Reseñas</NavLink>
      </nav>
    </header>
  );
}

export default Header;
