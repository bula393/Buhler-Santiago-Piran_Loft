export function aValoresFormulario(unidad) {
  return {
    nombre: unidad.nombre,
    descripcion: unidad.descripcion,
    capacidad: String(unidad.capacidad),
    direccion: unidad.direccion,
    disponible: unidad.disponible
  };
}

export function validarUnidad(valores) {
  const errores = {};
  if (!valores.nombre.trim()) errores.nombre = "Ingrese el nombre de la unidad.";
  if (!valores.direccion.trim()) errores.direccion = "Ingrese la dirección.";

  const capacidad = Number(valores.capacidad);
  if (valores.capacidad.trim() === "" || !Number.isInteger(capacidad) || capacidad <= 0) {
    errores.capacidad = "Ingrese un número entero mayor que 0.";
  }
  return errores;
}

export function prepararUnidad(valores) {
  return {
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion.trim(),
    capacidad: Number(valores.capacidad),
    direccion: valores.direccion.trim(),
    disponible: valores.disponible
  };
}
