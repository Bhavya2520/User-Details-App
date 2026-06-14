# Simple User Details App


Frontend serves a simple form and lists users. Backend stores users in a Postgres database running as a separate container.

Run locally with Docker Compose:

```bash
docker compose up --build
```

Frontend: http://localhost:3000
Backend API: http://localhost:4000/api/users

Postgres data is persisted in a Docker volume named `db_data`.
