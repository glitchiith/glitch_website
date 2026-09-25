ALTER TABLE "CompetitionPlayer"
DROP CONSTRAINT IF EXISTS "CompetitionPlayer_hostel_id_check";

ALTER TABLE "CompetitionPlayer"
ADD CONSTRAINT "CompetitionPlayer_hostel_id_check"
CHECK (hostel_id BETWEEN 1 AND 22);

UPDATE "Hostels"
SET name = 'SUSRUTHA'
WHERE id = 8;

INSERT INTO "Hostels" (id, name)
VALUES (22, 'BHASKARA')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
