export default function UnidadFilters({ busqueda, disponibilidad, onBusqueda, onDisponibilidad }) {
  return (
    <div className="filtros" role="search" aria-label="Filtrar unidades">
      <div className="campo filtros__busqueda">
        <label htmlFor="buscar-unidad">Buscar una unidad</label>
        <input id="buscar-unidad" type="search" placeholder="Nombre o dirección" value={busqueda}
          onChange={(evento) => onBusqueda(evento.target.value)} />
      </div>
      <div className="campo">
        <label htmlFor="filtrar-disponibilidad">Disponibilidad</label>
        <select id="filtrar-disponibilidad" value={disponibilidad}
          onChange={(evento) => onDisponibilidad(evento.target.value)}>
          <option value="todas">Todas las unidades</option>
          <option value="disponibles">Disponibles</option>
          <option value="no-disponibles">No disponibles</option>
        </select>
      </div>
    </div>
  );
}
