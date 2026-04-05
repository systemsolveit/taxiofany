# Taxiofany Web App Documentation

This folder contains the full technical documentation for the current project and the target architecture you described:

- Public frontend for users
- Admin dashboard frontend based on AdminLTE
- Dedicated backend server
- Dockerized deployment for frontend and backend

## Documentation Index

1. [Current State](./CURRENT_STATE.md)
2. [Target Architecture](./TARGET_ARCHITECTURE.md)
3. [Backend API and Contracts](./API_SPEC.md)
4. [Docker Deployment Guide](./DOCKER_GUIDE.md)
5. [Implementation Roadmap](./IMPLEMENTATION_ROADMAP.md)
6. [Proposal Alignment Notes](./PROPOSAL_ALIGNMENT.md)
7. [Architecture TODO Tracker](./TODO_ARCHITECTURE.md)

## Quick Technical Summary

- Backend: Node.js + Express (`backend`)
- Frontend target: Node.js + Express + EJS (`frontend` as independent server)
- Frontend organization: modular by domain and feature (`routes`, `controllers`, and `views` split into `users` and `admin`)
- Current state: backend still serves static template files from `frontend/views`
- Default backend port: `3000`

## Important Note About Proposal Document

A proposal `.docx` file was referenced in your request, but no `.docx` file exists inside this workspace currently.

Action:
- Put the proposal file inside this repository (for example under `docs/proposal/`) so it can be parsed and this documentation can be aligned line-by-line with the proposal scope and SOW.

## Recommended Next Execution Order

1. Create frontend app server structure (`frontend/server.js`, routes, middleware, public, views/users, views/admin)
2. Convert current HTML pages into EJS templates under `views/users`
3. Integrate AdminLTE pages under `views/admin`
4. Add role-based auth flow for users and admin
5. Separate API routes in backend
6. Add Dockerfiles and `docker-compose.yml`
7. Add CI checks and deployment workflow
