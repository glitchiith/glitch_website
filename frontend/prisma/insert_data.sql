-- run inside psql
DROP TABLE IF EXISTS temp_students;
CREATE TEMP TABLE temp_students (
  hostel_name TEXT,
  email TEXT
);

\copy temp_students(hostel_name,email) FROM '/home/panshul/Desktop/Documents/Lambda/glitchwebsite/prisma/students.csv' DELIMITER ',' CSV HEADER;

-- verify counts
SELECT count(*) FROM temp_students;  -- should show 4876


INSERT INTO "StudentHostels" (email, hostel_id)
SELECT t.email, h.id
FROM temp_students t
JOIN "Hostels" h
  ON upper(trim(t.hostel_name)) = upper(trim(h.name))
ON CONFLICT (email) DO NOTHING;

-- rows that don't match any hostel
SELECT t.hostel_name, count(*) AS cnt
FROM temp_students t
LEFT JOIN "Hostels" h ON upper(trim(t.hostel_name)) = upper(trim(h.name))
WHERE h.id IS NULL
GROUP BY t.hostel_name
ORDER BY cnt DESC
LIMIT 50;

-- malformed / missing emails
SELECT * FROM temp_students WHERE email !~* '@' LIMIT 20;
-- duplicate emails in CSV (these will be skipped by ON CONFLICT)
SELECT email, count(*) FROM temp_students GROUP BY email HAVING count(*) > 1 LIMIT 20;