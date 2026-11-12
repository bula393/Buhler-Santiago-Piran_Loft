import { request } from "./apiClient.js";

export const buscarDirecciones = (direccion) => request(`/direcciones?q=${encodeURIComponent(direccion.trim())}`);
