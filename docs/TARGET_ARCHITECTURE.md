# Target Architecture

This document defines the architecture for the next project version.

## Target Runtime Components

1. Backend API server (Node.js + Express)
2. Frontend web server (Node.js + Express + EJS)
3. Optional reverse proxy (Nginx) for unified domain routing

## Frontend Structure (Planned)

Planned structure aligned with your desired setup:

```text
frontend/
  server.js
  app.js
  config/
    index.js
  routes/
    users/
      public.router.js
      bookings.router.js
      profile.router.js
    admin/
      dashboard.router.js
      users.router.js
      bookings.router.js
    index.js
  controllers/
    users/
      public.controller.js
      bookings.controller.js
      profile.controller.js
    admin/
      dashboard.controller.js
      users.controller.js
      bookings.controller.js
  services/
    users/
    admin/
  middleware/
    auth.js
    requireAdmin.js
    errorHandler.js
  public/
    css/
    js/
    img/
    vendors/
  views/
    shared/
      layouts/
        users-layout.ejs
        admin-layout.ejs
      partials/
        head.ejs
        navbar.ejs
        footer.ejs
        admin-sidebar.ejs
      components/
        alerts.ejs
        pagination.ejs
    users/
      home/
        index.ejs
      packages/
        index.ejs
      solutions/
        index.ejs
      bookings/
        create.ejs
        details.ejs
    admin/
      dashboard/
        index.ejs
      users/
        list.ejs
        details.ejs
      bookings/
        list.ejs
        details.ejs
      settings/
        index.ejs
```

Rendering policy:
- All page rendering uses EJS templates.
- Raw `.html` and `.php` pages are treated as source templates only during migration.
- Final runtime pages should be `.ejs` under `views/users` and `views/admin`.
- Do not keep all EJS pages in one directory; group templates by domain and feature.

## View Segmentation Rules

- `views/users/*`: customer-facing pages organized by feature (`home`, `bookings`, `packages`, `solutions`, ...)
- `views/admin/*`: AdminLTE-based dashboard pages organized by feature (`dashboard`, `users`, `bookings`, ...)
- Shared templates go in `views/shared/*`:
  - `views/shared/layouts/*`
  - `views/shared/partials/*`
  - `views/shared/components/*`
- Keep one primary page per feature path (example: `views/admin/users/list.ejs`) and avoid flat view folders.

## Routing Model

Frontend routes:
- `/` -> users home
- `/packages` -> users packages
- `/solutions` -> users solutions
- `/admin` -> admin dashboard
- `/admin/users` -> admin user management
- `/admin/bookings` -> admin bookings

Rendering strategy:
- Route handlers should use `res.render(...)` with EJS views.
- Shared EJS layouts/partials should be used for header, footer, and admin layout frame.
- Router and controller names should match feature names for easy traceability.

Backend API routes:
- `/api/v1/auth/*`
- `/api/v1/users/*`
- `/api/v1/bookings/*`
- `/api/v1/payments/*`
- `/api/v1/drivers/*`

## Backend Features Structure (Required)

Inside `backend/features`, use two top-level folders:

```text
backend/
  features/
    admin/
      <feature-name>/
        router.js
        controller.js
        service.js
    user/
      <feature-name>/
        router.js
        controller.js
        service.js
```

Required rule for admin features:
- Every feature inside `backend/features/admin/<feature-name>` must have both `router.js` and `controller.js`.

Recommended rule for user features:
- Keep the same pattern (`router.js` + `controller.js`) in `backend/features/user/<feature-name>` for consistency and easier maintenance.

Aggregation approach:
- `backend/features/admin/index.js` should mount all admin feature routers.
- `backend/features/user/index.js` should mount all user feature routers.
- Main app router should mount:
  - `/api/v1/admin/*` from admin features
  - `/api/v1/user/*` from user features

## Auth and Authorization

Recommended:
- JWT-based auth
- Role field: `user`, `admin`, `dispatcher` (optional)
- Frontend middleware guards:
  - `requireAuth`
  - `requireAdmin`

## Data and Service Boundaries

- Backend only exposes JSON APIs
- Frontend consumes backend APIs, no direct DB access
- Keep business logic in `backend/features/*`
- Keep persistence in `backend/models/*`

## Environment Contracts

Backend env:
- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `DATABASE_URL`
- `CORS_ORIGIN`

Frontend env:
- `PORT`
- `NODE_ENV`
- `API_BASE_URL`
- `SESSION_SECRET`

## Logging and Error Strategy

- Structured request logs in backend
- Centralized error middleware
- Correlation ID on each request (recommended)
- Separate user-safe and internal error messages
