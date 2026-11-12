const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");

export function filtrarUnidades(unidades, busqueda, disponibilidad) {
  const termino = normalizar(busqueda.trim());
  return unidades.filter((unidad) => {
    const coincide = normalizar(`${unidad.nombre} ${unidad.direccion}`).includes(termino);
    const estado = disponibilidad === "todas"
      || (disponibilidad === "disponibles" ? unidad.disponible : !unidad.disponible);
    return coincide && estado;
  });
}
