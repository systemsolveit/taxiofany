# Architecture TODO and Deliverables Tracker

This file is the execution tracker for the agreed architecture.

Legend:
- `⬜` Not started
- `🟨` In progress
- `✅` Done
- `⛔` Blocked

## Frontend Architecture Deliverables

| Area | Deliverable | Status | Owner | Notes |
|---|---|---|---|---|
| Frontend Core | Create `frontend/server.js` and `frontend/app.js` | ✅ | Team | Independent frontend server |
| Frontend Config | Create `frontend/config/index.js` | ✅ | Team | Env and app config |
| Frontend Routes | Add `routes/users/*` and `routes/admin/*` | ✅ | Team | Domain-based route split |
| Frontend Controllers | Add `controllers/users/*` and `controllers/admin/*` | ✅ | Team | Match feature names with routers |
| Frontend Middleware | Add auth/session guards and `errorHandler.js` | ✅ | Team | `sessionManager`, `adminSessionAuth`, `clientSessionAuth`, and `errorHandler` are active |
| Frontend Public Assets | Move assets to `frontend/public/*` | ✅ | Team | Legacy template assets moved to `public/assets` and verified |
| EJS Shared Templates | Add `views/shared/layouts`, `partials`, `components` | 🟨 | Team | Shared legacy/admin partials and components are active; dedicated `layouts` layer still optional |
| EJS Users Views | Organize `views/users/<feature>/*.ejs` | ✅ | Team | Listed HTML pages converted into organized EJS feature folders |
| EJS Admin Views | Organize `views/admin/<feature>/*.ejs` | ✅ | Team | Admin feature pages organized and now rendered with AdminLTE shell |
| Legacy Migration | Convert `.html` and remove/convert `.php` pages | 🟨 | Team | Legacy root HTML/PHP source files removed, but booking/contact submission still need real backend API integration |

## Backend Architecture Deliverables

| Area | Deliverable | Status | Owner | Notes |
|---|---|---|---|---|
| Backend Features Split | Create `backend/features/admin` and `backend/features/user` | ✅ | Team | Required top-level split implemented |
| Admin Feature Rule | Every admin feature has `router.js` and `controller.js` | ✅ | Team | Admin `users`, `auth`, and `acl` features follow the rule |
| User Feature Pattern | Apply same `router.js` and `controller.js` pattern to user features | ✅ | Team | User `bookings` and `auth` features follow the same pattern |
| Feature Services | Add `service.js` per feature where business logic is needed | ✅ | Team | Service layer added for admin users and user bookings |
| Admin Router Aggregation | Add `backend/features/admin/index.js` | ✅ | Team | Mounts admin feature routers |
| User Router Aggregation | Add `backend/features/user/index.js` | ✅ | Team | Mounts user feature routers |
| Main API Mount | Mount `/api/v1/admin/*` and `/api/v1/user/*` in main app router | ✅ | Team | Unified routing strategy is live |
| Auth and Roles | Add auth middleware and role guards | ✅ | Team | Admin JWT auth + ACL + user auth are implemented; default super admin bootstrap is active |
| Error Handling | Add centralized error handler | ✅ | Team | Standard API errors implemented |
| Validation | Add request validation per feature route | ✅ | Team | Validation middleware now applied across auth, bookings, admin users, admin ACL, and i18n routes |

## Docker and Deployment Deliverables

| Area | Deliverable | Status | Owner | Notes |
|---|---|---|---|---|
| Backend Container | Add backend Dockerfile | ✅ | Team | Node 20 alpine |
| Frontend Container | Add frontend Dockerfile (Express + EJS) | ✅ | Team | Independent frontend service |
| Compose Orchestration | Add root `docker-compose.yml` | ✅ | Team | backend + frontend + mongo services |
| Service Networking | Configure frontend to call `http://backend:3000` internally | ✅ | Team | Docker network DNS configured in compose env |
| Runtime Environments | Add `.env` files and env contracts | ✅ | Team | Single root `.env` contract is active for backend/frontend and compose; backend startup now auto-bootstraps `nl` i18n data when DB is empty |
| Health Checks | Add health/readiness checks | 🟨 | Team | Mongo health check and backend status endpoint exist; compose health checks for backend/frontend are still pending |

## QA and Governance Deliverables

| Area | Deliverable | Status | Owner | Notes |
|---|---|---|---|---|
| Linting | Add lint setup and scripts | ⬜ | Team | Code quality baseline |
| Testing | Add smoke tests for frontend and backend | ✅ | Team | Automated smoke scripts are active (`backend/scripts/smoke-blog.js`, `backend/scripts/smoke-services.js`, `backend/scripts/smoke-cars.js`, `backend/scripts/smoke-users.js`, `backend/scripts/smoke-emails.js`, `backend/scripts/smoke-bookings.js`, `backend/scripts/smoke-roles.js`) and validated in Docker |
| API Contract | Verify API responses follow documented format | ✅ | Team | Status and bookings endpoints verified with success envelope |
| Security | Add security headers and rate limiting | ✅ | Team | Helmet is active and API/auth rate limiting is now configured in backend |
| Release Process | Add deployment and rollback runbook | ⬜ | Team | Operational safety |

## Milestone Checkpoints

| Milestone | Exit Criteria | Status |
|---|---|---|
| M1: Frontend Structure Ready | Modular EJS structure exists and routes render | ✅ |
| M2: AdminLTE Dashboard Ready | Admin views and navigation are usable | ✅ |
| M3: Backend Features Refactor Ready | Admin/user features split with routers/controllers | ✅ |
| M4: Docker Ready | `docker compose up --build` works for both services | ✅ |
| M5: Production Baseline Ready | QA/security/deployment checklist completed | ⬜ |

## Additional Requested Deliverables

| # | Area | Deliverable | Status | Owner | Notes |
|---|---|---|---|---|---|
| 1 | Security | Add CORS configuration for backend APIs | ✅ | Team | Added global CORS middleware with configurable `CORS_ORIGIN` |
| 2 | Security | Add Helmet security headers | ✅ | Team | Added global Helmet middleware in backend app |
| 3 | Observability | Add Winston logger integration | ✅ | Team | Winston now captures request logs, backend console output, handled errors, and persists file logs exposed in the admin Settings Logs tab |
| 4 | API Documentation | Add Swagger v1 documentation | ✅ | Team | Swagger UI exposed at `/api/v1/docs` with initial OpenAPI v1 routes |
| 5 | Backend Feature | Add Media Hub feature | ✅ | Team | Admin media upload UI, metadata APIs, asset proxying, and persistent Docker-backed storage are active |
| 6 | Admin CMS | Blog management with dynamic rendering | ✅ | Team | End-to-end delivery complete: admin CRUD + assistant + media integration + public dynamic templates + comment moderation workflow + smoke coverage |
| 7 | Admin CMS | Services management with dynamic rendering | ✅ | Team | Delivered end-to-end: backend admin/user APIs, admin CRUD UI, dynamic public services list/details, and service template bootstrap |
| 8 | Admin CMS | Cars management with dynamic rendering | ✅ | Team | Delivered end-to-end: backend admin/user APIs, admin CRUD fleet UI, dynamic public taxi list/details, and car template bootstrap |
| 9 | Admin CMS | User management with dynamic rendering | ✅ | Team | Delivered dynamic admin users list/details with DB data, profile/role/status updates, and smoke validation |
| 10 | Access Control | Roles management | ✅ | Team | Dynamic admin role-permission management with persistent overrides, reset-to-default flow, and roles smoke coverage |
| 11 | Admin CMS | Ride management with dynamic rendering | ✅ | Team | Public ride request form now persists bookings and renders dynamically in admin dashboard and bookings management with smoke coverage |
| 12 | Admin CMS | Email management with dynamic rendering | ✅ | Team | Delivered end-to-end: backend admin/user email template APIs, admin CRUD UI, public email library/detail rendering, template bootstrap, and smoke coverage |
| 13 | Admin CMS | Contact Us management with dynamic rendering | ✅ | Team | Delivered end-to-end: backend persistence + user submission API + admin contact submissions UI/workflow for reviewing and updating statuses |
| 14 | i18n Resilience | Auto-bootstrap `nl` locale and baseline translations on empty DB | ✅ | Team | Backend startup now restores `nl` translations automatically and supports manual restore script |
| 15 | Admin CMS | Driver management with dynamic rendering | ✅ | Team | Delivered end-to-end: backend admin/user driver APIs, admin CRUD UI, and dynamic public drivers list/details rendering |



render media hub in all selector