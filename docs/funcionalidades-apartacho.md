# Funcionalidades de Apartacho

Este documento consolida las funcionalidades que ofrece el software de administración de conjuntos a partir del análisis del frontend actual, diferenciando entre:

- ✅ Funcionalidades implementadas o conectadas al backend
- 🧪 Funcionalidades en prototipo / dummy / con datos ficticios
- 🛠️ Funcionalidades previstas en la navegación pero aún no desarrolladas

---

## 1. Visión general del sistema

Apartacho es una plataforma para la administración de conjuntos residenciales, con roles diferenciados para:

- Usuarios / residentes
- Consejo de administración
- Administrador del sistema

La estructura del frontend muestra módulos de gestión, comunicaciones, participación, social y administración técnica.

---

## 2. Roles y permisos del sistema

### 2.1 Residentes / gestión

Los usuarios con perfil de residente pueden acceder a la sección de gestión para ver y operar su información relacionada con:

- Unidades
- Estado de cuenta
- Vehículos
- Reservas
- Autorizaciones

### 2.2 Consejo de administración

La navegación del sistema permite que usuarios con rol de `board` o `admin` accedan a:

- Solicitudes de parqueo
- Minutas

### 2.3 Administrador

Los usuarios con rol `admin` tienen acceso a la administración del sistema, incluyendo:

- Gestión de unidades
- Gestión de usuarios
- Logs / auditoría de acciones
- Importaciones
- Registros del sistema

---

## 3. Funcionalidades reales o plenamente implementadas

### 3.1 Administración de usuarios

✅ Implementado

Incluye:

- Listado paginado de usuarios
- Búsqueda por nombre, documento o correo
- Creación de nuevos usuarios desde un drawer/formulario
- Visualización de usuarios con información básica
- Data real consumida desde endpoints del backend

Rutas relevantes:

- `/admin/users`
- `/admin/users/:id`

### 3.2 Administración de unidades

✅ Implementado

Incluye:

- Listado de unidades registradas
- Búsqueda por nombre
- Paginación
- Visualización de datos como torre, apartamento, piso, tipología, áreas, estado y deuda
- Consulta de deuda por unidad
- Acceso a detalle unitario

Rutas relevantes:

- `/admin/units`
- `/admin/units/:id`

### 3.3 Auditoría y logs del sistema

✅ Implementado

Incluye:

- Registro de acciones realizadas por usuarios
- Filtros por:
  - usuario
  - método HTTP
  - endpoint
- Visualización de payloads
- Paginación y listado temporal
- Etiquetas por tipo de método (`POST`, `PUT`, `PATCH`, `DELETE`)

Ruta relevante:

- `/admin/records`

### 3.4 Gestión de solicitudes de parqueo por parte del consejo

✅ Implementado

Incluye:

- Listado de solicitudes de parqueo
- Filtros por:
  - unidad
  - correo del usuario
  - placa del vehículo
  - tipo de vehículo
  - estado
  - duplicados por unidad
- Dashboard de solicitudes
- Asignación visual de estados (`Pendiente`, `Aprobada`, `Rechazada`, `Cancelada`)
- Paginación
- Data vinculada con unidad, usuario y vehículo

Ruta relevante:

- `/board/parking-requests`

### 3.5 Minutas del consejo

✅ Implementado

Incluye:

- Listado de minutas
- Creación de nuevas minutas
- Edición de minutas propias
- Eliminación por administrador
- Filtros y paginación
- Diferenciación del autor y estado activo/inactivo

Ruta relevante:

- `/board/minutes`

### 3.6 Gestión de vehículos del residente

✅ Implementado

Incluye:

- Registro de vehículos
- Edición
- Eliminación
- Visualización por tipo de vehículo
- Identificación de propietario vs no propietario
- Datos como placa, marca, modelo, color, año y propietario

Ruta relevante:

- `/management/vehicles`

---

## 4. Funcionalidades parcialmente presentadas como maquetas

### 4.1 Gestión general del residente

🧪 Dummy / mock-up

La página principal de gestión presenta:

- Widgets de resumen
- Acceso rápido a módulos
- Próximos vencimientos
- Balances y estadísticos ficticios

Aunque la navegación sugiere que es producto real, gran parte de la información es demo y no está conectada a backend real.

Ruta relevante:

- `/management`

### 4.2 Estado de cuenta

🧪 Dummy / mock-up

Se observa:

- Saldo pendiente ficticio
- Próximo vencimiento simulado
- Evolución de saldo en gráfico con datos de prueba
- Tabla de movimientos de ejemplo

No parece estar conectada a un servicio real de cartera del usuario.

Ruta relevante:

- `/management/account-status`

### 4.3 Reservas de zonas comunes

🧪 Dummy / mock-up

Se muestran:

- Espacios disponibles con estado ficticio
- Tarjetas de salón, BBQ, gimnasio, piscina, etc.
- Historial de reservas de ejemplo
- Botón de "Reservar" sin flujo real de creación

No hay integración con backend ni lógica real de disponibilidad, calendario o confirmación.

Ruta relevante:

- `/management/reservations`

### 4.4 Autorizaciones de visitantes

🧪 Dummy / mock-up

Se presentan:

- KPIs ficticios
- Tabla de autorizaciones de ejemplo
- Botón de "Nueva autorización" sin flujo funcional
- Estados simulados

Esta vista parece más una propuesta de UX que una funcionalidad operativa real.

Ruta relevante:

- `/management/authorizations`

### 4.5 Comunicaciones

🧪 Dummy / mock-up, aunque la pantalla de documentos tiene cierta estructura útil

Se identifican estos elementos:

- Dashboard de comunicados
- Documentos con filtros por categoría
- Tabla con archivos de ejemplo
- Indicadores ficticios

La navegación está pensada para comunicaciones, pero gran parte del contenido no está realmente conectado al backend.

Rutas relevantes:

- `/communications`
- `/communications/documents`
- `/communications/administration`
- `/communications/notifications`

### 4.6 Participación

🧪 Dummy / mock-up

Incluye:

- Encuestas activas de ejemplo
- Próxima asamblea simulada
- Actividad reciente ficticia

La estructura está planteada, pero no hay evidencia de flujo real de votación, asambleas o encuestas operativas.

Rutas relevantes:

- `/participation`
- `/participation/assemblies`
- `/participation/surveys`

### 4.7 Social

🧪 Dummy / mock-up

Módulo de:

- Noticias y eventos
- Clasificados
- Feed social con publicaciones ficticias

El diseño es completo visualmente, pero aún no tiene la lógica real de publicaciones, comentarios o anuncios del conjunto.

Rutas relevantes:

- `/social`
- `/social/news-events`
- `/social/classifieds`

---

## 5. Funcionalidades previstas pero aún no implementadas

Estas se observan como menús o rutas de navegación, pero todavía no cuentan con flujo real de negocio:

- Importaciones de administración
- Gestión de comunicados oficiales
- Notificaciones internas
- Gestión de encuestas reales
- Asambleas con votación formal
- Clasificados con publicación y gestión
- Perfil más completo del usuario
- Módulo de administración general del conjunto

---

## 6. Resumen ejecutivo

El software actual tiene una base fuerte en los siguientes módulos reales:

- Administración de usuarios
- Administración de unidades
- Logs / auditoría
- Gestión de solicitudes de parqueo
- Minutas del consejo
- Registro de vehículos

Los siguientes módulos están presentados como experiencia visual y funcionalidad conceptualmente propuesta, pero aún no están conectados a backend ni operan con datos reales:

- Gestión económica del residente
- Reservas de zonas comunes
- Autorizaciones
- Comunicaciones
- Participación
- Social

---

## 7. Conclusión

Apartacho ya cuenta con una base funcional sólida para la operación administrativa y operativa clave del conjunto, especialmente para la gestión interna del administrador y del consejo. Sin embargo, varias áreas de la experiencia de usuario están aún en etapa de prototipo, con datos ficticios y navegación orientada a producto futuro.

En pocas palabras: el sistema ya funciona como herramienta de administración interna, pero aún está en fase de expansión hacia un ecosistema completo de convivencia residencial.
