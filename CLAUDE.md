# ApartaDock

Plataforma de administración de conjuntos residenciales. Monorepo (npm workspaces + Turborepo) con dos apps:

- `apps/backend` — API en AdonisJS 6 (TypeScript, Lucid ORM, SQLite/PG vía `config/database.ts`).
- `apps/frontend` — SPA en Vue 3 + Vite, Tailwind CSS v4, componentes del design system propio `@dronico/droni-kit`.

## Comandos

Desde la raíz del repo:

- `npm run dev` — backend + frontend en paralelo (Turborepo).
- `npm run dev:backend` / `npm run dev:frontend` — por separado.
- `npm run build` / `npm run build:backend` / `npm run build:frontend`.
- `npm test` — tests del backend (`node ace test`, Japa).

Dentro de `apps/backend`: `npm run lint`, `npm run typecheck`, `npm run format`.
Dentro de `apps/frontend`: `npm run build` corre `vue-tsc -b` antes de `vite build` (sirve como type-check).

## Roles y autorización

El sistema tiene roles de usuario en `users.role` (string libre, default `user`), validados por middleware de backend y por el router de Vue en el frontend:

- `user` — Residente. Rol por defecto. Acceso a `/user/*` (backend) y `/management/*` (frontend): unidades, estado de cuenta, reservas, vehículos, autorizaciones.
- `board` — Consejo de administración. Acceso adicional a `/board/*`: solicitudes de parqueo, minutas/actas. Backend: `board_middleware.ts` permite `board` y `admin`.
- `admin` — Administrador del sistema. Acceso total, incluye `/admin/*`: usuarios, unidades, imports, logs/auditoría. Backend: `admin_middleware.ts` exige exactamente `admin`.
- `security` — **Aún no existe.** Rol planeado para el personal de vigilancia; cuando se agregue habrá que sumarlo a los middlewares del backend y a los mapas de rol del frontend (ver `apps/frontend/src/utils/roles.ts` y `apps/frontend/src/components/dashboard/RoleDashboard.vue`).

En el frontend, `apps/frontend/src/router/index.ts` hace el guard de rutas (`beforeEach`) comparando `getAuthUser()?.role`. La ruta `/` (home) requiere sesión — un usuario no autenticado es redirigido a `/auth/login` antes de llegar ahí, así que `pages/index.vue` sólo se renderiza autenticado.

## Backend (`apps/backend`)

- AdonisJS 6, autenticación por access tokens (`DbAccessTokensProvider`), guard `api` por defecto (ver `config/auth.ts`).
- Rutas en `start/routes.ts`, agrupadas por prefijo: `/auth`, `/account` (perfil), `/admin` (+ `admin` middleware), `/board` (+ `board` middleware), `/user` (+ `auth` middleware).
- Modelos Lucid en `app/models`: `User`, `Unit`, `Enrollment` (vincula usuario↔unidad con `role`: `owner`/`tenant`/`resident`), `Vehicle`, `ParkingRequest`, `Attachment`, `Log`.
- Controladores organizados por rol/ámbito: `app/controllers/admin/*`, `app/controllers/board/*`, `app/controllers/user/*`, más `auth_controller.ts` y `profile_controller.ts`.
- Los `index` paginados devuelven el objeto de paginación de Lucid tal cual (`{ data, meta: { currentPage, lastPage, perPage, total } }`); los endpoints de usuario (`/user/enrollments`, `/user/vehicles`) devuelven arrays planos, sin paginar.
- Auditoría: `request_log_middleware.ts` + modelo `Log` alimentan `/admin/records`.

## Frontend (`apps/frontend`)

- Enrutamiento por archivos con `vite-plugin-pages` (`routes` importadas desde `~pages` en `src/router/index.ts`), estructura de carpetas en `src/pages` refleja las rutas (`pages/admin/users/index.vue` → `/admin/users`, etc.).
- Sesión y usuario actual: `src/composables/useAuth.ts` (localStorage `apartadock_token` / `apartadock_user`, `ref` reactivo `user`, helpers `getAuthUser()` / `hasToken()` para código fuera de componentes).
- Cliente HTTP: `src/services/api.ts` (Axios, `baseURL` desde `VITE_API_BASE_URL`, inyecta `Authorization: Bearer` desde el token guardado).
- UI kit: `@dronico/droni-kit` (`DuiButton`, `DuiCard`, `DuiAlert`, `DuiBadge`, `DuiTable`, `DuiSkeleton`, `DuiNavbar`, etc. — ver `node_modules/@dronico/droni-kit/dist/index.d.ts` para el catálogo completo y props).
- Componentes propios reutilizables en `src/components`: `StatTile.vue` (tarjeta de métrica con icono/color), `DummyPageInfo.vue` (aviso de "esta página usa datos ficticios, aún no conectada"), `MainHeader.vue` (navbar con items condicionados por rol vía `isAdmin`/`isBoard`), `WysiwygEditor.vue`, `AttachmentOpen.vue` / `AttachmentUrlInput.vue`.
- Dashboards por rol viven en `src/components/dashboard/` (`WelcomeBanner.vue`, `RoleDashboard.vue`, `UserDashboard.vue`, `BoardDashboard.vue`, `AdminDashboard.vue`, `SecurityDashboard.vue`) y se orquestan desde `pages/index.vue`. Para agregar un rol nuevo: crear el componente de dashboard y registrarlo en el mapa de `RoleDashboard.vue` y en `utils/roles.ts`.
- Patrón habitual para vistas con datos remotos: `ref` de `loading`/`error`/dato, `onMounted` dispara el fetch, `extractErrorMessage` local desestructura `AxiosError<ApiErrorResponse>` (ver `components/board/parking-requests/Dashboard.vue` como referencia completa, incluye gráficos con `vue-chartjs` + `utils/charts.ts`).
- Estilo: Tailwind v4 (`@import "tailwindcss"` en `src/style.css`, sin config extra), utilidades directas en templates, sin CSS-in-JS.

## Estado del producto (ver `docs/funcionalidades-apartadock.md` para el detalle completo)

Módulos con datos reales conectados al backend: administración de usuarios, administración de unidades, auditoría/logs, solicitudes de parqueo (consejo), minutas/actas (consejo), gestión de vehículos (residente).

Módulos que aún son maqueta/dummy (marcados en la UI con `DummyPageInfo`): gestión general del residente (`/management`), estado de cuenta, reservas de zonas comunes, autorizaciones de visitantes, comunicaciones, participación (asambleas/encuestas), social. No usar estos como fuente de datos reales al construir features nuevas — o hay que conectarlos primero.

## Convenciones de trabajo

- Commits y docs del repo están en español; mantener ese idioma en UI, mensajes de commit y nombres de contenido visible al usuario. Nombres de variables/funciones en inglés como el resto del código.
- Antes de mostrar cifras "reales" en el frontend, verificar que el endpoint que las alimenta esté implementado (evitar repetir el patrón dummy salvo que se marque explícitamente con `DummyPageInfo`).
