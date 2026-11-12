export function coordenadasValidas(latitud, longitud) {
  return latitud !== "" && longitud !== "" && latitud != null && longitud != null
    && Number.isFinite(Number(latitud)) && Number.isFinite(Number(longitud))
    && Math.abs(Number(latitud)) <= 90 && Math.abs(Number(longitud)) <= 180;
}

// Solo es la vista de inicio del mapa, nunca la ubicación predeterminada de una unidad.
export const CENTRO_INICIAL_MAPA = [-34.6037, -58.3816];
