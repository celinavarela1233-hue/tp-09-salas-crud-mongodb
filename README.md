# tp-09-salas-crud-mongodb

## Consigna
Completar el CRUD de reservas: mantener creación y lectura e implementar reemplazo, cambio parcial y
eliminación física. Conservar el listado simple y el detalle individual de la unidad anterior. El sitio y la API utilizan la
misma base y el mismo servicio asíncrono.
Mantener la estructura de la unidad 8, el arranque después de conectar, la configuración externa y el ajuste DNS
autorizado. No insertar automáticamente al iniciar o consultar. Mantener el cierre ordenado del servidor y las
herramientas de formato y análisis.

## Versiones del entorno y dependencias
node.js: v24.29.0
express: ^4.x
mongoose: ^8.x
ejs & express ejs layouts: motor de renderizado de vistas y maquetacion modular
dotenv / nativo --env-file: gestión segura de variables de entorno.

## Entorno de MongoDB atlas y resolucion DNS
Base de datos: reservas_salas_u9 alojada en un cluster cloud de MongoDB Atlas

Conexión: Se establece mediante una cadena de conexión URI segura (mongodb+srv://...) gestionada a través de variables de entorno (MONGODB_URI)

Configuración de Red (DNS): Requiere el whitelisting de la dirección IP de acceso en el panel de seguridad de Atlas y una correcta resolución de registros SRV/TLS por parte del entorno de red local para permitir la conexión cifrada de Mongoose hacia el cluster remoto

## comando de inicio de la aplicacion
Para poner en marcha el servidor en entorno de desarrollo local con carga automatica de variables de entorno: node --env-file=.env src/index.js
alternativamente, utilizando el script configurado en el package.json: npm start

## arquitectura en capas
- Capa de Rutas (src/rutas/): Define los endpoints tanto para las vistas HTML como para los recursos de la API REST
- Capa de Controladores (src/controladores/): Gestiona la interacción entre las peticiones HTTP y la lógica de negocio
- Capa de Servicios (src/servicios/): Contiene la lógica de negocio pura y la invocación directa a los modelos de Mongoose
- Capa de Modelos (src/modelos/): Define los esquemas de datos, tipos de datos y reglas de validación de Mongoose
- Capa de Middleware (src/middleware/): Valida los datos de entrada y centraliza el manejo de errores HTTP y de renderizado

## Contratos de Endpoints (Lectura Simple, PUT, PATCH, DELETE)
- Lectura Simple (GET /api/reservas/:id o /reservas/:id):
    ° Comportamiento: Busca la reserva por su identificador único de MongoDB
    ° Respuesta exitosa: Retorna el documento JSON o renderiza la vista de detalle con los datos correspondientes
    ° Error: Si no existe, retorna un objeto JSON

- Reemplazo Total (PUT /api/reservas/:id):
    °  Comportamiento: Reemplaza íntegramente el recurso identificado por su ID con los datos enviados en el cuerpo de la solicitud

- Actualización Parcial (PATCH /api/reservas/:id):
    ° Comportamiento: Modifica únicamente los campos enviados en el cuerpo de la solicitud sobre el documento existente en la base de datos

- Eliminación (DELETE /api/reservas/:id):
    ° Comportamiento: Elimina físicamente el documento de la base de datos Atlas utilizando el método findByIdAndDelete
    ° Respuesta exitosa: Código HTTP 204 No Content sin cuerpo de respuesta
    ° Error: Código HTTP 404 Not Found si el ID no se encuentra registrado

## reglas de validacion
- Estudiante: Campo de tipo String, obligatorio, con validación de presencia y formato de texto
- Email: Campo de tipo String, obligatorio, validando formato de correo electrónico
- Sala: Campo de tipo String, obligatorio, restringido a valores predeterminados (Sala Norte, Sala Sur, Sala Multimedia)
- fecha: Campo de tipo Date o cadena válida de fecha de reserva
- Turno: Campo obligatorio, restringido a (Mañana, Tarde, Noche)
- Personas: Campo numérico entero, obligatorio, con restricciones de rango mínimo (1) y máximo (6)

## Matriz 
- POST /api/reservas 201, recurso y Location; default pendiente
- GET /api/reservas/:id 200 y recurso, o 404
- PUT /api/reservas/:id 200 y reemplazo completo con el mismo ID
- PATCH /api/reservas/:id 200 y cambios parciales permitidos con el mismo ID
- DELETE /api/reservas/:id 204 sin cuerpo si eliminó un documento
- GET /api/reservas 200 con un arreglo de reservas
- ID inválido 400 JSON
- ID válido ausente al consultar, modificar o borrar 404 JSON
- Entrada o consulta inválida 400 JSON sin modificación
- Fallo inesperado 500 JSON seguro

## Evidencia de reinicio y persistencia
Al detener el proceso del servidor (Ctrl + C) y volver a iniciarlo mediante el comando de ejecución (node --env-file=.env src/index.js), se constata que:
- La conexión a MongoDB Atlas se restablece de forma exitosa
- Los registros creados previamente se conservan íntegramente en la base de datos en la nube, comprobando la persistencia real más allá del ciclo de vida del proceso en Node.js
- El listado web y los endpoints API devuelven de forma inmediata los datos almacenados sin pérdida de información

