# Implementation Roadmap

## Phase 1: Frontend Restructure

1. Create frontend server app (`frontend/server.js`)
2. Create modular route groups: `routes/users/*` and `routes/admin/*`
3. Add matching modular controller groups: `controllers/users/*` and `controllers/admin/*`
4. Add middleware (`frontend/middleware`)
5. Convert user pages from `.html` to organized `.ejs` feature folders in `frontend/views/users/*`
6. Add `frontend/views/admin/*` feature folders for AdminLTE pages
7. Add shared view building blocks under `frontend/views/shared/layouts`, `partials`, and `components`
8. Move static assets into `frontend/public`
9. Convert or remove legacy `.php` templates (`book-ride.php`, `contact.php`)

Deliverable:
- Frontend runs independently with organized EJS rendering by domain and feature (no flat combined views)

## Phase 2: AdminLTE Integration

1. Add AdminLTE assets and layout base
2. Build admin dashboard template
3. Add admin modules pages:
- Users
- Bookings
- Drivers
- Payments
- Settings

Deliverable:
- Functional dashboard shell with navigation and placeholder modules

## Phase 3: Backend API Expansion

1. Split `backend/features` into `admin` and `user` folders
2. Create per-feature `router.js` and `controller.js` (mandatory for admin features)
3. Add feature `service.js` modules for business logic
4. Add auth endpoints and middleware
5. Add booking management APIs
6. Add centralized error handling and validation
7. Add data model implementation

Deliverable:
- Stable `/api/v1` contract supporting frontend flows

## Phase 4: Dockerization and DevOps

1. Add backend Dockerfile
2. Add frontend Dockerfile
3. Add root `docker-compose.yml`
4. Add environment files
5. Add health checks and readiness checks

Deliverable:
- One-command boot with `docker compose up --build`

## Phase 5: Hardening and QA

1. Add linting and formatting
2. Add unit/integration smoke tests
3. Add API contract checks
4. Add security headers and rate limiting
5. Add deployment and rollback procedure

Deliverable:
- Production-ready baseline

## Suggested Priority Matrix

- High: organized EJS migration, frontend split, admin layout, auth, Docker compose
- Medium: feature APIs, logging, validation, QA automation
- Low: analytics, advanced dashboard widgets, observability stack
