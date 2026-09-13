# Single-game competition

The website and Go API use one personal best per player. Players select their
hostel once. The global leaderboard shows 20 players; hostel standings add
the highest 50 personal bests per hostel. There is no manual review.

## Database migration (not applied to your connected database)

The migration at
`frontend/prisma/migrations/20260912000100_single_game/migration.sql`
**drops `User` and `StudentHostels`, including their old data**. It creates:

- `CompetitionPlayer`: Firebase UID, name, locked hostel, best score and time.
- `GameRun`: run ownership, expiry, submitted result and retry response.
- `SubmissionAttempt`: accepted/rejected attempts and duplicates.

Before applying, confirm the intended database and make a full PostgreSQL backup.
The existing JSON player snapshots are not a full database backup.
Historical migration files stay in the repository so a fresh database can be
built in order. Do not use the old `insert_data.sql` or data notebook to seed the
new competition.

From `frontend/`, after confirming the target:

```sh
pnpm exec prisma migrate status
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm run seed
```

These commands use `frontend/.env`. The Go backend's `DATABASE_URL` must point
to the same database. If the old database was created manually and lacks Prisma
migration history, inspect/baseline it first; do not run a reset to resolve that.
The seed now adds hostel names only, never fake players or scores.

## Backend configuration

Use `backend/.env.example` as a reference and configure `backend/.env`:

- `DATABASE_URL`: the migrated PostgreSQL database.
- `FIREBASE_CREDENTIALS`: absolute path to a Firebase service-account JSON file.
  It must belong to the same Firebase project as the frontend.
- `PRIVATE_KEY`: the RSA private PEM, at least 2048 bits. PKCS#8 and PKCS#1 work.
  Keep the private key server-side. The run endpoint supplies its public parameters.
- `PORT=8000`.
- `ALLOWED_ORIGINS`: comma-separated website origins, including the actual local
  port while developing. Production must use HTTPS.

For multiline PEM values, dotenv accepts a double-quoted multiline value.
Do not commit credentials. The frontend `.env` was already tracked in the
original repository; adding ignore rules does not remove that file or its history.
Rotate previously exposed database credentials.

Provisional operating settings are configurable and should be confirmed before launch:

| Setting | Default |
|---|---|
| `RUN_TTL_SECONDS` | 86400 (24 hours) |
| `RUN_STARTS_PER_MINUTE` | 30 per player |
| `SUBMISSIONS_PER_MINUTE` | 60 per player |

Validation accepts nonnegative 32-bit integer scores (0–2,147,483,647, the storage
and Unity `int` range). This is not an invented gameplay maximum. There is no
minimum run duration or rejection based solely on a large improvement.
Equal hostel totals currently share a rank; hostel ID keeps display ordering stable.

Run from `backend/`:

```sh
go run main.go
```

Startup does not apply migrations. It checks database, Firebase configuration,
RSA key, and the presence of the new player table.

## Website

Set `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000` in `frontend/.env`, along
with the Firebase web configuration, then start/restart Next.js:

```sh
pnpm dev
```

Firebase Google sign-in must be enabled, with your website domain authorized.
The existing restriction to verified `@iith.ac.in` accounts is preserved.
The website refreshes the Firebase token before protected API calls.
No Firebase token or private key is given to Unity.

The leaderboard page uses the configured API address, not the old hosted URL.
It refreshes on submission notifications, returning to the tab, and its Refresh
button. Other open tabs receive submission notifications through a storage event.

## Unity handoff

The repository currently contains the previous event's compiled WebGL build.
The website does not embed it because it is not the new competition game.
See `UNITY_HANDOFF.md` before asking for the new build. The score integration
must be added in the Unity source before WebGL export; C# cannot be added to an
already compiled `.wasm` build.

## Verification

From `frontend/`:

```sh
pnpm exec tsc --noEmit --incremental false
pnpm exec prisma validate
pnpm build
```

From `backend/`:

```sh
go test ./...
TEST_DATABASE_URL='postgresql://USER:PASSWORD@localhost:PORT/DISPOSABLE_DB?sslmode=disable' go test -race ./internal/controller
```

Integration tests create a unique schema and remove only that schema afterward.
Use a disposable test database, never production. They test migration removal,
run ownership, hostel locking, retries, expiry, concurrent best updates, player
tie ordering, top-50 sums, history and rate limits.

RSA does not establish that a score was earned. A plausible fabricated result
can still pass this first version's checks.
