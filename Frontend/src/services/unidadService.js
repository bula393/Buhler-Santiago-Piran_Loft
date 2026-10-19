import { request } from "./apiClient.js";

const RECURSO = "/unidades";

export const getUnidades = () => request(RECURSO);

export const getUnidadById = (id) => request(`${RECURSO}/${id}`);

export const createUnidad = (datos) => request(RECURSO, { method: "POST", body: datos });

export const updateUnidad = (id, datos) => request(`${RECURSO}/${id}`, { method: "PUT", body: datos });

export const deleteUnidad = (id) => request(`${RECURSO}/${id}`, { method: "DELETE" });
