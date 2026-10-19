# Backend

API REST para administrar unidades de alquiler, organizada en capas MVC. La persistencia es temporal: los registros se guardan en un array en memoria y se reinician al detener el servidor.

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
