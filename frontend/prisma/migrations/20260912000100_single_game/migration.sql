-- DESTRUCTIVE: removes legacy player scores and email-to-hostel mappings.
-- Back up and confirm the target database before applying.
BEGIN;
DROP TABLE "StudentHostels";
DROP TABLE "User";
CREATE TABLE "CompetitionPlayer" (
 uid VARCHAR(128) PRIMARY KEY,
 name VARCHAR(255) NOT NULL,
 hostel_id INTEGER CHECK (hostel_id BETWEEN 1 AND 21),
 best_score INTEGER CHECK (best_score >= 0),
 best_at TIMESTAMPTZ,
 CHECK ((best_score IS NULL AND best_at IS NULL) OR (best_score IS NOT NULL AND best_at IS NOT NULL))
);
CREATE TABLE "GameRun" (
 id UUID PRIMARY KEY,
 uid VARCHAR(128) NOT NULL REFERENCES "CompetitionPlayer"(uid),
 started_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
 expires_at TIMESTAMPTZ NOT NULL,
 score INTEGER CHECK (score >= 0),
 submitted_at TIMESTAMPTZ,
 new_best BOOLEAN,
 best_at_submission INTEGER,
 CHECK ((score IS NULL AND submitted_at IS NULL) OR (score IS NOT NULL AND submitted_at IS NOT NULL))
);
CREATE INDEX "GameRun_uid_started" ON "GameRun"(uid, started_at);
CREATE INDEX "CompetitionPlayer_ranking" ON "CompetitionPlayer"(best_score DESC, best_at, uid);
CREATE TABLE "SubmissionAttempt" (
 id BIGSERIAL PRIMARY KEY,
 uid VARCHAR(128) NOT NULL REFERENCES "CompetitionPlayer"(uid),
 run_id TEXT,
 score INTEGER,
 outcome TEXT NOT NULL,
 attempted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX "SubmissionAttempt_uid_time" ON "SubmissionAttempt"(uid, attempted_at);
COMMIT;
