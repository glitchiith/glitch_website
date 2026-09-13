# Single-game competition

The website and Go API use one personal best per player. Players select their
hostel once. The global leaderboard shows 20 players; hostel standings add
the highest 50 personal bests per hostel. There is no manual review.

## Current status

- The configured Neon database was migrated on September 13, 2026.
- The old `User` and `StudentHostels` tables were removed.
- The new competition tables and hostel names are present.
- Database, Firebase and RSA startup checks pass.
- The new Unity game has not been added. The website currently shows a placeholder.

## Database

The migration at
`frontend/prisma/migrations/20260912000100_single_game/migration.sql`
**dropped `User` and `StudentHostels`, including their old data**. It created:

- `CompetitionPlayer`: Firebase UID, name, locked hostel, best score and time.
- `GameRun`: run ownership, expiry, submitted result and retry response.
- `SubmissionAttempt`: accepted/rejected attempts and duplicates.

The full pre-migration backup is stored locally at:

```text
backend/backups/database_pre_single_game_20260913.dump
```

It is ignored by Git and has file mode `600`. Keep another secure copy if the
old data may be needed. The older JSON player snapshots are not full database
backups.

All three migrations are recorded as applied on the configured Neon database.
Do not run `prisma migrate resolve` again for that database. Check its state with:

```sh
cd frontend
pnpm exec prisma migrate status
```

For a new empty database, confirm the target and then apply and seed it:

```sh
cd frontend
pnpm exec prisma migrate deploy
pnpm exec prisma generate
pnpm run seed
```

These commands use `frontend/.env`. The Go backend's `DATABASE_URL` must point
to the same database. The seed adds hostel names only; it does not add fake
players or scores. Never use `prisma migrate reset` on production.

## Backend configuration

Use `backend/.env.example` as a reference and configure `backend/.env`:

- `DATABASE_URL`: the migrated PostgreSQL database.
- `FIREBASE_CREDENTIALS`: absolute path to the complete Firebase service-account
  JSON file. It must belong to the same Firebase project as the frontend.
- `PRIVATE_KEY`: the RSA private PEM, at least 2048 bits. PKCS#8 and PKCS#1 work.
  Keep the private key server-side. The run endpoint supplies its public parameters.
- `PORT=8000`.
- `ALLOWED_ORIGINS`: comma-separated website origins, including the actual local
  port while developing. Production must use HTTPS.

For multiline PEM values, dotenv accepts a double-quoted multiline value. The
Firebase service-account private key and score-encryption RSA key must be
different keys. Do not commit either one.

`frontend/.env` was removed from the current GitHub branch and remains local and
ignored. It still exists in old Git history, so rotate the database password that
was previously exposed.

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
RSA key, and the presence of the new player table. A successful local startup
ends with:

```text
Database connected successfully
Firebase initialized successfully
Server listening on :8000
```

## Website

Copy `frontend/.env.example` to `frontend/.env`, fill in the Firebase web
configuration, and set `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`. Leave
`NEXT_PUBLIC_UNITY_GAME_PATH` empty until the new build arrives, then set it to
the same-origin public path for its `index.html`.

Start or restart Next.js after changing public environment variables:

```sh
pnpm dev
```

Firebase Google sign-in must be enabled, with your website domain authorized.
The existing restriction to verified `@iith.ac.in` accounts is preserved.
The website refreshes the Firebase token before protected API calls.
No Firebase token or private key is given to Unity.

The leaderboard page uses the configured API address, not the old hosted URL.
It refreshes when the tab regains focus and through its Refresh button. Automatic
refresh after an in-game submission will be connected with the Unity bridge.

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
