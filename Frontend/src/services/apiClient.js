const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function request(ruta, { method = "GET", body } = {}) {
  const opciones = { method, headers: {} };
  if (body !== undefined) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(body);
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, opciones);
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.", 0);
  }

  const contenido = await respuesta.json().catch(() => null);
  if (!respuesta.ok || !contenido?.success) {
    throw new ApiError(contenido?.message ?? "Ocurrió un error inesperado.", respuesta.status);
  }
  return contenido.data;
}
