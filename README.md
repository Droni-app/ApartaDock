# ApartaDock

ApartaDock es una plataforma de administración de conjuntos residenciales diseñada para centralizar la gestión operativa, la comunicación y la trazabilidad de actividades entre residentes, administración y consejo.

El proyecto está organizado como un monorepo con dos aplicaciones principales:

- Backend: AdonisJS 6 + TypeScript + Lucid ORM
- Frontend: Vue 3 + Vite + Tailwind CSS

## ¿Qué incluye?

- Gestión de usuarios y perfiles
- Administración de unidades y asociaciones de residentes
- Control de vehículos
- Solicitudes de parqueo
- Minutas y actas del consejo
- Auditoría y registros del sistema
- Roles diferenciados por permiso y acceso

## Roles del sistema

El producto contempla varios perfiles de acceso:

- Residentes: gestión personal, unidades y vehículos
- Consejo: revisión y aprobación de solicitudes, minutas y actas
- Administrador: administración técnica y auditoría general

La lógica de permisos está implementada tanto en el backend como en la capa de routing del frontend para reforzar la seguridad y la experiencia por rol.

## Stack tecnológico

### Backend

- Node.js
- AdonisJS 6
- TypeScript
- Lucid ORM
- SQLite / PostgreSQL compatible
- Autenticación con access tokens

### Frontend

- Vue 3
- Vite
- Tailwind CSS
- Axios
- Vue Router
- Componentes de design system propio
- Gráficos con Chart.js

## Estructura del proyecto

```text
ApartaDock/
├── apps/
│   ├── backend/
│   │   ├── app/
│   │   ├── config/
│   │   ├── database/
│   │   ├── start/
│   │   └── tests/
│   └── frontend/
│       ├── src/
│       ├── public/
│       └── vite.config.ts
├── docs/
├── package.json
├── turbo.json
└── README.md
```

## Requisitos

- Node.js 24.x
- npm 11+

## Instalación

1. Clona el repositorio.
2. Instala las dependencias en la raíz:

```bash
npm install
```

## Ejecutar el proyecto

### Modo de desarrollo

```bash
npm run dev
```

Esto levanta backend y frontend en paralelo con TurboRepo.

### Ejecutar por separado

```bash
npm run dev:backend
npm run dev:frontend
```

## Construcción

```bash
npm run build
```

También puedes compilar por app:

```bash
npm run build:backend
npm run build:frontend
```

## Tests

```bash
npm test
```

## Estado del proyecto

El proyecto ya cuenta con funcionalidades reales conectadas a backend para administración de usuarios, unidades, auditoría, solicitudes de parqueo y gestión de vehículos. Otras áreas de la plataforma se encuentran en progreso o presentadas como prototipos/dummy dentro del frontend.

## Convenciones

- El código y la documentación están principalmente en español.
- Los nombres de variables y funciones se mantienen en inglés cuando corresponden al código.
- Se prioriza la validación de acceso por rol y la trazabilidad de acciones en la administración.

## Licencia

Este proyecto usa la licencia MIT.

## Contacto y contribución

Si quieres colaborar, puedes abrir una rama de trabajo, hacer cambios y validar el flujo local con los scripts de desarrollo y pruebas del monorepo.
