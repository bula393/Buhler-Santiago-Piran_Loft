# Loft · Administración de alojamientos

Sistema React conectado a una API Express para gestionar alojamientos, huéspedes, reservas, pagos ficticios y reseñas. Se conserva la estructura existente del repositorio: `Backend/` y `Frontend/` (con mayúscula inicial).

## Ejecutar el proyecto

Requiere Node.js 20.19 o posterior y dos terminales abiertas en la raíz del repositorio.

Terminal 1:

```powershell
cd Backend
npm install
npm start
```

Terminal 2:

```powershell
cd Frontend
npm install
npm run dev
```

Abrir la dirección que muestra Vite (normalmente http://localhost:5173). El frontend se ejecuta de manera independiente y redirige `/api` al backend en http://localhost:3000. No requiere datos de ejemplo: las unidades se crean desde el formulario y se consultan en la API.

## Organización del frontend

Todo el código de la aplicación está en `Frontend/src`:

- `assets`: logo y recursos visuales.
- `components`: botones, formularios, tablas, mapa, tarjetas, filtros, estados, diálogo y notificaciones reutilizables.
- `pages`: unidades, gestión de huéspedes/reservas/pagos/reseñas y página no encontrada.
- `services`: cliente HTTP y operaciones sobre los cinco recursos de la API. Es el único lugar del frontend con `fetch`.
- `hooks`: carga de datos que descarta respuestas anteriores al cambiar de recurso o salir de una pantalla.
- `context`: sistema compartido de notificaciones de éxito y error, con cierre manual.
- `utils`: rutas, mensajes, formatos, filtros y validaciones.
- `styles`: estilos generales, componentes y adaptación a móviles.
- `App.jsx`: navegación; `main.jsx`: entrada y proveedores.

## Funcionalidades y accesibilidad

Listado, consulta individual, creación, edición y eliminación real mediante la API. Búsqueda por nombre o dirección (sin distinguir acentos) y filtro de disponibilidad sobre los registros recibidos. Estados de carga, error con reintento, listado vacío y búsqueda sin resultados.

Los formularios validan nombre, dirección y capacidad entera positiva; conservan los valores ante errores y bloquean la edición durante el guardado. Las notificaciones laterales comparten el mismo sistema para errores y éxitos. La eliminación requiere un diálogo de confirmación con foco protegido, cancelación por Escape y restauración del foco. Incluye etiquetas asociadas, mensajes de validación, botones semánticos, enlace para saltar al contenido y reducción de movimiento.

Se mantienen el logo de Loft, la paleta cálida, la navegación superior y el listado de tarjetas existentes. Se mejora la jerarquía tipográfica, el espacio entre elementos, la legibilidad y la adaptación a pantallas pequeñas. No se encontró el boceto inicial en el repositorio; queda pendiente compararlo cuando esté disponible.

## Compilación y configuración

Desde `Frontend`:

```powershell
npm run build
npm run preview
```

La vista previa también redirige `/api` al backend local. Opcionalmente, definir `VITE_API_URL` con la URL base de la API, incluyendo `/api`, antes de compilar. Para un backend en otro origen, ese servidor debe permitir CORS. Para publicar el frontend, configurar el servidor con respaldo a `index.html` para las rutas React y un proxy `/api` hacia el backend, o configurar una URL de API con CORS.

La persistencia del backend sigue siendo temporal: al reiniciarlo se pierden todos los registros. Los pagos son exclusivamente ficticios, sin conexión a bancos ni procesadores de pago. No hay autenticación: es una aplicación académica local.

## Circuito de gestión

1. Crear una unidad. Escribir calle, número y ciudad, pulsar “Buscar dirección en el mapa” y elegir una coincidencia. El mapa se centra en esa dirección. No se muestran ni se ingresan coordenadas. Al modificar el texto se limpia la ubicación anterior para confirmar una nueva dirección.
2. Registrar un huésped con nombre, email, teléfono y documento. No se admiten documentos o emails duplicados.
3. Crear una reserva seleccionando huésped y unidad, fechas, cantidad de huéspedes, total en pesos argentinos, estado y método de pago ficticio. “Confirmar reserva y pago ficticio” registra la reserva y un pago aprobado por el total en una única operación. Si falla el pago, no queda una reserva incompleta. La salida debe ser posterior al ingreso; el día de salida queda libre para la siguiente reserva. Se controla capacidad, habilitación y superposición.
4. Consultar los pagos ficticios en su sección. Allí también se pueden anular, editar o registrar nuevos pagos si vuelve a haber saldo pendiente. Los aprobados reducen el saldo; los rechazados y anulados no. El sistema impide superar el saldo y cancelar una reserva que aún tenga pagos aprobados.
5. Una vez llegada la fecha de salida, marcar la reserva como finalizada. Se puede registrar una única reseña por estadía, con puntaje de 1 a 5 y comentario.

Las cinco secciones permiten crear, consultar, editar y eliminar registros, con búsqueda y confirmación de eliminación. Una reserva con pagos o reseñas conserva su huésped, unidad y fechas. No se pueden eliminar huéspedes/unidades con reservas ni reservas con pagos/reseñas; primero se deben quitar los registros dependientes. Los pagos ficticios pueden anularse mediante edición.

## Mapa real

Se usa Leaflet con cartografía de OpenStreetMap y búsqueda por calle, número y ciudad mediante Photon. El usuario elige una coincidencia y el mapa muestra esa dirección, sin campos de coordenadas. La ubicación se guarda internamente junto con la unidad.

La búsqueda se activa con un botón o Enter y se centraliza en \src/services\. El backend expone GET /api/direcciones?q=... y limita la frecuencia de consultas; guarda hasta 100 búsquedas en caché durante una hora. PHOTON_URL permite configurar otra instancia compatible. El servidor público de Photon es para uso moderado y no garantiza disponibilidad; para mayor volumen se requiere una instancia propia.

Los mapas y la búsqueda requieren Internet. Ante fallas se conserva la dirección y se muestran mensajes recuperables. No se necesita una clave de API ni una cuenta de facturación de Google. Se mantiene atribución visible de OpenStreetMap y no se precarga ni descarga cartografía en masa. VITE_MAP_TILE_URL permite cambiar el proveedor de teselas; su atribución debe ajustarse según su licencia.

## Pruebas

Ejecutar `npm test` desde `Backend` y desde `Frontend`. La prueba del backend crea su propia API en un puerto temporal y verifica CRUD, relaciones, superposición, capacidad, saldo, cancelación, reseñas y coordenadas. Las pruebas del frontend verifican validaciones, fechas, preparación de formularios y cálculo del saldo.

## Verificación realizada

- Compilación de producción con `npm run build` y revisión de espacios con `git diff --check`.
- En navegador y con el backend real: alta, detalle, edición de nombre y disponibilidad, búsqueda sin acentos, filtro sin resultados, limpieza de filtros y eliminación con confirmación. El registro temporal se eliminó al terminar.
- Validación del formulario vacío con foco en el primer campo incorrecto; cancelación del diálogo mediante Escape y restauración del foco al botón de eliminación.
- Respuesta 404 de una unidad inexistente, notificación de error y regreso al listado.
- Inspección visual de escritorio y vista móvil de 390 × 844. Consola sin errores durante el CRUD; React Router emite avisos informativos de migración a su próxima versión.
- Comprobaciones de validación de capacidades inválidas, preparación de datos y filtros con acentos y disponibilidad.
- Ampliación: alta de huésped, reserva confirmada, pagos ficticios parciales hasta saldo cero, rechazo de sobrepago, finalización y reseña desde el navegador. También se probó la creación de reserva con pago conjunto.
- Mapa restablecido a Leaflet y OpenStreetMap, con búsqueda de calles de Photon.
