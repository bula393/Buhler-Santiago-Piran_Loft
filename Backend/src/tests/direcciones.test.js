import test from "node:test";
import assert from "node:assert/strict";
import { normalizarDirecciones } from "../services/DireccionService.js";

test("La búsqueda devuelve calles legibles y descarta ubicaciones inválidas", () => {
    const resultados = normalizarDirecciones({ features: [
        { properties: { street: "Avenida Corrientes", housenumber: "1000", city: "Buenos Aires", state: "Buenos Aires", country: "Argentina" }, geometry: { coordinates: [-58.38, -34.6] } },
        { properties: { name: "Resultado incompleto" } },
        { properties: { name: "Fuera de rango" }, geometry: { coordinates: [200, 100] } }
    ] });
    assert.deepEqual(resultados, [{ direccion: "Avenida Corrientes 1000, Buenos Aires, Argentina", latitud: -34.6, longitud: -58.38 }]);
});
