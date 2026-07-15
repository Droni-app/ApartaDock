# Apartacho Monorepo

Monorepo con:

- Backend: AdonisJS API en `apps/backend`
- Frontend: Vue 3 + Vite en `apps/frontend`

## Requisitos

- Node.js 20+
- npm 10+

## Instalacion

```bash
npm install
```

## Desarrollo

Levantar backend y frontend al mismo tiempo:

```bash
npm run dev
```

Levantar solo backend:

```bash
npm run dev:backend
```

Levantar solo frontend:

```bash
npm run dev:frontend
```

## Build

Build de ambas apps:

```bash
npm run build
```

Build por app:

```bash
npm run build:backend
npm run build:frontend
```

## Tests

Ejecutar tests del backend:

```bash
npm test
```
