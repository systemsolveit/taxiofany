# Current State

## Repository Layout

- `backend/`: active Express runtime
- `frontend/views/`: current template pages and assets (to be migrated to EJS)
- `docs/`: documentation (this folder)

## Backend Status

Core files:
- `backend/server.js`: HTTP server bootstrap
- `backend/app.js`: Express app setup
- `backend/appRouter.js`: basic routes
- `backend/config/index.js`: port config
- `backend/middlewares/logger.js`: request logger middleware (present but not wired globally)

Dependencies:
- `express`
- `nodemon` (dev)

Current behavior:
- Serves static files from `frontend/`
- Maps `/assets/*` to `frontend/views/assets/*`
- Serves home page from `views/index.html`
- Exposes health endpoint at `/api/status`

## Frontend Status

Current frontend is template-based static pages:
- Main pages in `frontend/views/*.html`
- Two `.php` files exist (`book-ride.php`, `contact.php`) and are not executable by Node/Express directly
- Assets under `frontend/views/assets`

Decided direction:
- Frontend will use EJS templates with its own Express server.
- Existing HTML templates will be converted to `views/users/*.ejs`.
- Admin dashboard pages will be implemented in `views/admin/*.ejs` using AdminLTE.

## Observed Gaps and Risks

1. Route mismatch:
- Backend route `/about` currently sends `views/about.html`
- Existing files are `about-us.html` and `about-company.html`
- Result: `/about` returns 404 in current state

2. No split by role yet:
- No `views/users` and `views/admin` folders currently
- No AdminLTE integration yet

3. No Docker assets yet:
- No Dockerfile for backend
- No Dockerfile for frontend
- No `docker-compose.yml`

4. No API modularization yet:
- `features/` and `models/` are placeholders only

5. No environment file contract documented yet:
- Port and runtime env conventions should be standardized

## Immediate Stabilization Suggestions (EJS Path)

1. Fix `/about` route target (`about-us.html` or `about-company.html`)
2. Bootstrap independent frontend server with EJS view engine
3. Convert `index.html`, `packages`, and related user pages into `views/users/*.ejs`
4. Build AdminLTE base layout in `views/admin/*.ejs`
5. Add Docker baseline files
