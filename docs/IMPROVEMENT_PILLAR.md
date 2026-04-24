# Improvement pillar (follow-up planning)

This document records the **chosen pillar** for the next focused implementation plan, aligned with the architecture map (API + EJS frontend, MongoDB, admin vs public).

## Selected pillar: **Operations**

**Rationale:** A reliable local and deployment story (ports, `API_BASE_URL`, Mongo for API and sessions, health checks) unblocks every other improvement. The companion doc [LOCAL_RUN.md](./LOCAL_RUN.md) is the concrete baseline.

### Next steps under this pillar (suggested)

- Add or refresh root-level run instructions that point at `docs/LOCAL_RUN.md` and both `package.json` scripts.
- Optional smoke checklist: `GET /api/v1/status`, frontend home, admin login path only after secrets are set.
- When ops is stable, sequence suggested follow-ons: **Security** (CORS, cookies, rate limits), **UX** (booking flow), **Content** (DB vs static copy), **i18n** (coverage).

## Other pillars (for later or parallel work)

| Pillar    | Example focus |
|-----------|----------------|
| UX        | Booking flow, public site clarity, admin workflows |
| Security  | CORS, session flags, JWT handling, `/api/v1/user` vs admin boundaries |
| Content   | Marketing copy vs DB-driven blog/services/fleet |
| i18n      | Locale coverage, translation keys, URL prefix behavior |

Teams may **revisit this file** when priorities shift and update the selected pillar and bullets above.
