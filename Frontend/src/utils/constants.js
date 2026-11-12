export const RUTAS = {
  inicio: "/unidades",
  unidades: "/unidades",
  nuevaUnidad: "/unidades/nueva",
  detalleUnidad: (id) => `/unidades/${id}`,
  editarUnidad: (id) => `/unidades/${id}/editar`
};

export const UNIDAD_VACIA = {
  nombre: "",
  descripcion: "",
  capacidad: "",
  direccion: "",
  disponible: true,
  latitud: "",
  longitud: ""
};

export const MENSAJES = {
  cargandoUnidades: "Cargando unidades...",
  cargandoUnidad: "Cargando unidad...",
  sinUnidades: "Todavía no hay unidades cargadas.",
  unidadActualizada: "Unidad actualizada correctamente.",
  unidadCreada: "Unidad creada correctamente.",
  unidadEliminada: "Unidad eliminada correctamente.",
  errorGuardar: "No se pudo guardar la unidad.",
  errorEliminar: "No se pudo eliminar la unidad.",
  formularioConErrores: "Revise los campos marcados antes de guardar.",
  paginaNoEncontrada: "La página solicitada no existe.",
  confirmarEliminar: (nombre) =>
    `¿Está seguro de que desea eliminar "${nombre}"? Esta acción no se puede deshacer.`
};
