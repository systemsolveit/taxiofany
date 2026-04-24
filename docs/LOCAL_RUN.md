# Local run (backend + frontend)

Taxiofany is two Node apps: **`backend/`** (JSON API) and **`frontend/`** (EJS + sessions). There is no root `package.json`; install and start each app separately.

## Prerequisites

- Node.js (LTS recommended)
- MongoDB reachable at the URI you configure (default `mongodb://127.0.0.1:27017/taxiofany`)

## Ports (defaults)

| Service  | Env override              | Default |
|----------|---------------------------|---------|
| Backend  | `BACKEND_PORT` or `PORT`  | **3000** |
| Frontend | `FRONTEND_PORT` or `PORT` | **3001** |

The frontend calls the API using **`API_BASE_URL`**, which defaults to **`http://localhost:3000`**. For local dev, keep the backend on **3000** or set `API_BASE_URL` to match your backend port.

## MongoDB

| App      | Purpose | Env |
|----------|---------|-----|
| Backend  | App data (users, bookings, settings, etc.) | `MONGO_URI` (default `mongodb://127.0.0.1:27017/taxiofany`) |
| Frontend | Session store (connect-mongo) | `SESSION_STORE_MONGO_URI` → else `MONGO_URI_DOCKER` → else `MONGO_URI` → same default as above |

You can use one MongoDB instance and one database for both; ensure the URI matches what you intend for sessions vs app data.

## Minimal `.env` examples

**`backend/.env`** (illustrative):

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/taxiofany
JWT_SECRET=your-long-random-secret
```

**`frontend/.env`** (illustrative):

```env
FRONTEND_PORT=3001
API_BASE_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/taxiofany
SESSION_SECRET=your-frontend-session-secret
```

Copy from `.env.example` in each folder if present; add any JWT/CORS keys required by [`backend/config/index.js`](../backend/config/index.js).

## Commands

**Backend** (from repo root):

```bash
cd backend
npm install
npm start
```

**Frontend:**

```bash
cd frontend
npm install
npm start
```

Use `npm run dev` in each package if defined for watch mode.

## Verification

1. **API health:** `GET http://localhost:3000/api/v1/status` (or your `BACKEND_PORT`) — should report status and DB connectivity.
2. **Frontend:** open `http://localhost:3001` (or your `FRONTEND_PORT`) — pages should load; server-rendered routes proxy JSON from `API_BASE_URL`.
3. **Alignment:** `API_BASE_URL` on the frontend must match the URL where the backend actually listens (scheme, host, port).

## Related

- Backend config: [`backend/config/index.js`](../backend/config/index.js)
- Frontend config: [`frontend/config/index.js`](../frontend/config/index.js)
