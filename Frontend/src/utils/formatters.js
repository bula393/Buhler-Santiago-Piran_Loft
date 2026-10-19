export const formatearDisponibilidad = (disponible) => (disponible ? "Disponible" : "No disponible");

export const formatearCapacidad = (capacidad) =>
  capacidad === 1 ? "1 huésped" : `${capacidad} huéspedes`;
