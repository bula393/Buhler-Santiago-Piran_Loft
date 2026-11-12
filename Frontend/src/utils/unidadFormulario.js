export function aValoresFormulario(unidad) {
  return {
    nombre: unidad.nombre,
    descripcion: unidad.descripcion,
    capacidad: String(unidad.capacidad),
    direccion: unidad.direccion,
    disponible: unidad.disponible,
    latitud: unidad.latitud == null ? "" : String(unidad.latitud),
    longitud: unidad.longitud == null ? "" : String(unidad.longitud)
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
  const latitud = valores.latitud ?? "";
  const longitud = valores.longitud ?? "";
  if (latitud !== "" || longitud !== "") {
    if (latitud === "" || !Number.isFinite(Number(latitud)) || Math.abs(Number(latitud)) > 90) errores.latitud = "Ingresá una latitud entre -90 y 90.";
    if (longitud === "" || !Number.isFinite(Number(longitud)) || Math.abs(Number(longitud)) > 180) errores.longitud = "Ingresá una longitud entre -180 y 180.";
  }
  return errores;
}

export function prepararUnidad(valores) {
  return {
    nombre: valores.nombre.trim(),
    descripcion: valores.descripcion.trim(),
    capacidad: Number(valores.capacidad),
    direccion: valores.direccion.trim(),
    disponible: valores.disponible,
    latitud: valores.latitud == null || valores.latitud === "" ? null : Number(valores.latitud),
    longitud: valores.longitud == null || valores.longitud === "" ? null : Number(valores.longitud)
  };
}
