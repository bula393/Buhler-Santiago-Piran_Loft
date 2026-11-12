import { request } from "./apiClient.js";
import { getUnidades } from "./unidadService.js";

function servicio(recurso) {
  const ruta = `/${recurso}`;
  return {
    listar: () => request(ruta),
    obtener: (id) => request(`${ruta}/${id}`),
    crear: (datos) => request(ruta, { method: "POST", body: datos }),
    actualizar: (id, datos) => request(`${ruta}/${id}`, { method: "PUT", body: datos }),
    eliminar: (id) => request(`${ruta}/${id}`, { method: "DELETE" })
  };
}

export const gestionServices = {
  huespedes: servicio("huespedes"),
  reservas: servicio("reservas"),
  pagos: servicio("pagos"),
  resenas: servicio("resenas")
};

gestionServices.reservas.crear = async (datos) => {
  const resultado = await request("/reservas/con-pago", { method: "POST", body: datos });
  return resultado.reserva;
};

export async function getGestion() {
  const recursos = Object.keys(gestionServices);
  const [unidades, ...listas] = await Promise.all([
    getUnidades(), ...recursos.map((recurso) => gestionServices[recurso].listar())
  ]);
  return { unidades, ...Object.fromEntries(recursos.map((recurso, index) => [recurso, listas[index]])) };
}
