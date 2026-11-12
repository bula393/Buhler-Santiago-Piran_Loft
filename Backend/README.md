# Backend

API REST para administrar unidades, huéspedes, reservas, pagos ficticios y reseñas, organizada en rutas, servicios y repositorios. La persistencia es temporal: los registros se guardan en memoria y se reinician al detener el servidor.

## Inicio

Desde esta carpeta, instalar dependencias y ejecutar:

    npm install
    npm start

El servidor escucha en http://localhost:3000 (se puede cambiar con la variable PORT).

## CRUD de unidades

Todas las operaciones usan la ruta /api/unidades.

- GET /api/unidades — listar unidades.
- GET /api/unidades/:id — consultar una unidad.
- POST /api/unidades — crear una unidad.
- PUT /api/unidades/:id — modificar una unidad (admite campos parciales).
- DELETE /api/unidades/:id — eliminar una unidad.

Cuerpo para crear una unidad:

    {
      "nombre": "Loft Centro",
      "descripcion": "Loft equipado",
      "capacidad": 2,
      "direccion": "Calle 123",
      "disponible": true
    }

Las respuestas exitosas y los errores usan los formatos success/data y success/message, respectivamente.

Las unidades también aceptan `latitud` y `longitud` numéricas, o ambas `null` si no tienen ubicación.

## Nuevos recursos

Todos admiten `GET /api/recurso`, `GET /api/recurso/:id`, `POST /api/recurso`, `PUT /api/recurso/:id` (parcial) y `DELETE /api/recurso/:id`.

| Recurso | Campos de creación |
| --- | --- |
| `huespedes` | `nombre`, `email`, `telefono`, `documento` (textos) |
| `reservas` | `huespedId`, `unidadId`, `cantidadHuespedes` (enteros), `fechaInicio`, `fechaFin` (YYYY-MM-DD), `montoTotal` (número), `estado` |
| `pagos` | `reservaId` (entero), `monto` (número), `fecha` (YYYY-MM-DD), `metodoPago`, `estado` |
| `resenas` | `reservaId` (entero), `puntaje` (entero 1 a 5), `comentario` (hasta 2000 caracteres), `fecha` (YYYY-MM-DD) |

Estados de reserva: `pendiente`, `confirmada`, `finalizada`, `cancelada`. Estados de pago ficticio: `aprobado`, `rechazado`, `anulado`. Métodos ficticios: `tarjeta_simulada`, `transferencia_simulada`, `efectivo_simulado`. Los importes se expresan en ARS con hasta dos decimales; las comparaciones de saldo se hacen en centavos.

Se validan referencias existentes, email/documento únicos, fechas reales, capacidad y superposición de estadías (intervalo ingreso inclusivo y salida exclusiva). Una unidad no disponible impide nuevas reservas activas. Las estadías finalizadas deben haber alcanzado la salida y admiten una única reseña posterior a esa fecha y no futura. Los pagos aprobados no pueden superar el total ni pertenecer a reservas canceladas. Los registros relacionados protegen contra borrados que dejarían referencias huérfanas.

## Pruebas

El frontend crea reservas mediante `POST /api/reservas/con-pago`, con los campos de reserva y `metodoPago`. Devuelve `{ success: true, data: { reserva, pago } }` con un pago ficticio aprobado por el total y fecha actual. Ambas operaciones se realizan juntas; los errores de validación no dejan registros parciales. La ruta CRUD original se mantiene para compatibilidad con la entrega anterior.

`GET /api/direcciones?q=calle, número y ciudad` consulta Photon, con límite de frecuencia y caché. `PHOTON_URL` permite configurar otra instancia compatible. El frontend utiliza Leaflet y OpenStreetMap, sin claves de Google.

`npm test` ejecuta una prueba de integración HTTP en un puerto temporal. No requiere tener el servidor principal encendido y no modifica sus registros.
