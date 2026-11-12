import AppError from "../exceptions/AppError.js";
import { exigir } from "../utils/validaciones.js";

const cache = new Map();
let proximaConsulta = 0;
const URL_BUSQUEDA = process.env.PHOTON_URL || "https://photon.komoot.io/api/";

export function normalizarDirecciones(contenido) {
    return (contenido.features ?? []).flatMap((resultado) => {
        const propiedades = resultado.properties ?? {};
        const [longitud, latitud] = resultado.geometry?.coordinates ?? [];
        if (!Number.isFinite(latitud) || !Number.isFinite(longitud) || Math.abs(latitud) > 90 || Math.abs(longitud) > 180) return [];
        const calle = [propiedades.street, propiedades.housenumber].filter(Boolean).join(" ");
        const direccion = [...new Set([calle || propiedades.name, propiedades.city || propiedades.town || propiedades.village,
            propiedades.state, propiedades.country].filter(Boolean))].join(", ");
        return direccion ? [{ direccion, latitud, longitud }] : [];
    });
}

export async function buscarDirecciones(consulta) {
    exigir(typeof consulta === "string" && consulta.trim().length >= 4 && consulta.length <= 200,
        "Escribí calle, número y ciudad para buscar la dirección.");
    const termino = consulta.trim();
    const clave = termino.toLocaleLowerCase("es");
    const guardado = cache.get(clave);
    if (guardado && guardado.hasta > Date.now()) return guardado.resultados;
    if (Date.now() < proximaConsulta) throw new AppError("Esperá un momento antes de buscar otra dirección.", 429);
    proximaConsulta = Date.now() + 1100;
    const url = new URL(URL_BUSQUEDA);
    url.search = new URLSearchParams({ q: termino, limit: "5", lang: "default" }).toString();
    try {
        const respuesta = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { "User-Agent": "Loft-Academic-AddressSearch/1.0", Accept: "application/json" } });
        if (!respuesta.ok) throw new Error("Proveedor no disponible");
        const contenido = await respuesta.json();
        if (!Array.isArray(contenido.features)) throw new Error("Respuesta inválida");
        const resultados = normalizarDirecciones(contenido);
        if (cache.size >= 100) cache.delete(cache.keys().next().value);
        cache.set(clave, { resultados, hasta: Date.now() + 3600000 });
        return resultados;
    } catch {
        throw new AppError("No pudimos buscar la dirección. Revisá la conexión e intentá nuevamente.", 502);
    }
}
