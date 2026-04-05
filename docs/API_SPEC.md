# Backend API and Contracts

## Current Implemented Endpoints

1. `GET /`
- Returns: `frontend/views/index.html`

2. `GET /about`
- Current implementation points to `views/about.html` (file not found in current tree)

3. `GET /api/status`
- Returns JSON:

```json
{
  "status": "ok",
  "uptime": 123.45
}
```

## Frontend Rendering Note

- Current rendering in backend is file-based (`res.sendFile`).
- Planned frontend rendering should move to EJS (`res.render`) inside the independent frontend server.
- API contracts in this document remain JSON-first and are not tied to template engine choice.

## Proposed v1 API Surface

Auth:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`

Users:
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users` (admin)

Bookings:
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/me`
- `GET /api/v1/bookings/:id`
- `PATCH /api/v1/bookings/:id/cancel`
- `GET /api/v1/admin/bookings` (admin)

Drivers:
- `GET /api/v1/drivers`
- `POST /api/v1/admin/drivers` (admin)

Payments:
- `POST /api/v1/payments/intent`
- `POST /api/v1/payments/webhook`

## Standard Response Envelope

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Readable message"
  }
}
```

## Recommended HTTP Status Usage

- `200` OK
- `201` Created
- `204` No Content
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict
- `422` Validation Error
- `500` Internal Server Error
