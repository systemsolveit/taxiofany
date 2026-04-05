# Docker Deployment Guide

This guide defines the Docker baseline for running backend and frontend as separate services.

## Target Containers

1. `backend`: Express API server
2. `frontend`: Express + EJS web server
3. Optional `nginx`: reverse proxy for single-domain routing

## Backend Dockerfile (recommended)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Frontend Dockerfile (recommended)

Use this for the EJS frontend server:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Docker Compose Skeleton

```yaml
version: "3.9"
services:
  backend:
    build:
      context: ./backend
    container_name: taxiofany-backend
    environment:
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
    container_name: taxiofany-frontend
    environment:
      - NODE_ENV=production
      - PORT=3001
      - API_BASE_URL=http://backend:3000
    ports:
      - "3001:3001"
    depends_on:
      - backend
    restart: unless-stopped
```

Expected frontend runtime:
- `frontend/server.js` runs Express
- EJS templates rendered from `frontend/views/users` and `frontend/views/admin`
- Static files served from `frontend/public`

## Networking Notes

- Inside Docker network, frontend should call backend using service name `http://backend:3000`
- From browser, use mapped host ports (`localhost:3001`, `localhost:3000`) or route through Nginx

## Production Recommendations

1. Put Nginx in front for TLS and routing
2. Add health checks to both services
3. Keep secrets in `.env` or secret manager
4. Use image tags and CI build pipeline

## SMTP Integration (Contact Us -> Email)

Configure SMTP in backend environment variables so contact form submissions are emailed automatically.

- `SMTP_HOST`: SMTP server hostname (example: `smtp.gmail.com`)
- `SMTP_PORT`: SMTP server port (example: `587`)
- `SMTP_SECURE`: `true` for SSL/TLS (usually port `465`), otherwise `false`
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password or app password
- `SMTP_FROM`: sender email (example: `no-reply@yourdomain.com`)
- `CONTACT_RECIPIENT_EMAIL`: inbox that receives Contact Us submissions

The unified contact module saves submissions in DB and sends notification emails from:

- backend contact model: `backend/models/ContactSubmission.js`
- backend mail service: `backend/services/mailer.js`
- user API endpoint: `POST /api/v1/user/contact/submissions`

Admin UI control point for these integrations:

- frontend settings page: `/admin/settings/mail`
