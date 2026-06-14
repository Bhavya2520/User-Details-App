# Simple User Details App

This repository contains a simple web app that collects user details (name, email, contact number, age) from a frontend form and stores them in a backend database.

## Stack

- Frontend: static HTML/CSS/JavaScript served by `http-server`
- Backend: Node.js with Express
- Database: Postgres running in its own container

## Running the app

Start the stack with Docker Compose:

```bash
docker compose up --build
```

After startup:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/users

## Database details

The Postgres service runs inside the `db` container. Data is persisted in a Docker volume named `db_data`, so user records survive container restarts.

## Environment variables

This project uses environment variables to avoid hardcoding secrets in code or Compose files. Create a `.env` file at the project root before running Docker Compose.

Copy the example file and set your own values:

```bash
copy .env.example .env
```

A sample file is provided in `.env.example`. The real `.env` file is ignored by `.gitignore` so secrets are not committed.

## Verify data inside the Postgres container

To enter the Postgres container and inspect the database:

```bash
docker compose exec db psql -U postgres -d usersdb
```

Then run SQL:

```sql
SELECT * FROM users;
```

To check the data files on disk inside the container:

```bash
docker compose exec db ls -la /var/lib/postgresql/data
```
```

## Useful commands

- Rebuild and start detached:

  ```bash
  docker compose up -d --build
  ```

- View backend logs:

  ```bash
  docker compose logs -f backend
  ```

- Stop and remove containers:

  ```bash
  docker compose down
  ```

## Notes

- If the backend is unreachable, make sure the `db` container is running.
- The frontend sends form requests to `http://localhost:4000/api/users`.
- The database container is configured with:
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=example`
  - `POSTGRES_DB=usersdb`
