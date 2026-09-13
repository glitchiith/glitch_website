package controller

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"net/http/httptest"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/Panshul-Jindal/glitch_website/backend/config"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func TestScorePayload(t *testing.T) {
	id := "38a6c801-38c8-4d81-a5a8-40bb194dc970"
	for _, score := range []string{"0", "2147483647"} {
		if _, err := decodeScore(fmt.Sprintf(`{"runId":%q,"score":%s}`, id, score)); err != nil {
			t.Fatal(err)
		}
	}
	for _, body := range []string{
		`{}`, `{"runId":"bad","score":1}`,
		fmt.Sprintf(`{"runId":%q,"score":-1}`, id),
		fmt.Sprintf(`{"runId":%q,"score":1.5}`, id),
		fmt.Sprintf(`{"runId":%q,"score":2147483648}`, id),
		fmt.Sprintf(`{"runId":%q,"score":1,"uid":"someone-else"}`, id),
		fmt.Sprintf(`{"runId":%q,"score":1}{}`, id),
	} {
		if _, err := decodeScore(body); err == nil {
			t.Errorf("accepted invalid payload %s", body)
		}
	}
}

func TestCompetitionDatabase(t *testing.T) {
	target := os.Getenv("TEST_DATABASE_URL")
	if target == "" {
		t.Skip("Set TEST_DATABASE_URL to a disposable PostgreSQL database.")
	}
	admin, err := sql.Open("postgres", target)
	if err != nil {
		t.Fatal(err)
	}
	defer admin.Close()
	schemaName := fmt.Sprintf("glitch_test_%d", time.Now().UnixNano())
	if _, err = admin.Exec("CREATE SCHEMA " + schemaName); err != nil {
		t.Fatal(err)
	}
	defer admin.Exec("DROP SCHEMA " + schemaName + " CASCADE")
	parsed, err := url.Parse(target)
	if err != nil {
		t.Fatal(err)
	}
	query := parsed.Query()
	query.Set("search_path", schemaName)
	parsed.RawQuery = query.Encode()
	db, err := sql.Open("postgres", parsed.String())
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	config.DB = db
	migrations := []string{"20251016163359_init_postgres_hostels", "20251016164207_fix_removed_opposite_relations", "20260912000100_single_game"}
	for _, name := range migrations {
		data, err := os.ReadFile(filepath.Join("../../../frontend/prisma/migrations", name, "migration.sql"))
		if err != nil {
			t.Fatal(err)
		}
		sqlText := strings.ReplaceAll(string(data), `"public".`, schemaName+".")
		if _, err = db.Exec(sqlText); err != nil {
			t.Fatalf("migration %s: %v", name, err)
		}
	}
	var legacy sql.NullString
	if err = db.QueryRow(`SELECT to_regclass('"User"')::text`).Scan(&legacy); err != nil || legacy.Valid {
		t.Fatalf("legacy table remains: %v", err)
	}
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatal(err)
	}
	private, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		t.Fatal(err)
	}
	t.Setenv("PRIVATE_KEY", string(pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: private})))
	t.Setenv("SUBMISSIONS_PER_MINUTE", "1000")
	t.Setenv("RUN_STARTS_PER_MINUTE", "1000")
	gin.SetMode(gin.TestMode)
	request := func(uid string, handler gin.HandlerFunc, body string) *httptest.ResponseRecorder {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest("POST", "/", strings.NewReader(body))
		c.Request.Header.Set("Content-Type", "application/json")
		c.Set("uid", uid)
		c.Set("claims", map[string]interface{}{"email": uid + "@iith.ac.in", "email_verified": true, "name": uid})
		handler(c)
		return w
	}
	expect := func(w *httptest.ResponseRecorder, status int) {
		t.Helper()
		if w.Code != status {
			t.Fatalf("status %d wanted %d: %s", w.Code, status, w.Body.String())
		}
	}
	for _, uid := range []string{"alice", "bob", "concurrent"} {
		expect(request(uid, RegisterUser, ""), 200)
	}
	expect(request("alice", StartRun, ""), 409)
	expect(request("alice", SelectHostel, `{"hostel_id":99}`), 400)
	expect(request("alice", SelectHostel, `{"hostel_id":1}`), 200)
	expect(request("alice", SelectHostel, `{"hostel_id":1}`), 200)
	expect(request("alice", SelectHostel, `{"hostel_id":2}`), 409)
	for _, uid := range []string{"bob", "concurrent"} {
		expect(request(uid, SelectHostel, `{"hostel_id":2}`), 200)
	}
	start := func(uid string) string {
		t.Helper()
		w := request(uid, StartRun, "")
		expect(w, 201)
		var value struct {
			RunID string `json:"runId"`
		}
		if err := json.Unmarshal(w.Body.Bytes(), &value); err != nil {
			t.Fatal(err)
		}
		return value.RunID
	}
	encrypted := func(run string, score int) string {
		body := fmt.Sprintf(`{"runId":%q,"score":%d}`, run, score)
		cipher, err := rsa.EncryptPKCS1v15(rand.Reader, &key.PublicKey, []byte(body))
		if err != nil {
			t.Fatal(err)
		}
		data, _ := json.Marshal(map[string]string{"data": base64.StdEncoding.EncodeToString(cipher)})
		return string(data)
	}
	run := start("alice")
	expect(request("bob", SubmitScore, encrypted(run, 500)), 403)
	accepted := request("alice", SubmitScore, encrypted(run, 500))
	expect(accepted, 200)
	duplicate := request("alice", SubmitScore, encrypted(run, 500))
	expect(duplicate, 200)
	if !bytes.Equal(accepted.Body.Bytes(), duplicate.Body.Bytes()) {
		t.Fatal("retry did not return original result")
	}
	expect(request("alice", SubmitScore, encrypted(run, 501)), 409)
	var firstTime time.Time
	db.QueryRow(`SELECT best_at FROM "CompetitionPlayer" WHERE uid='alice'`).Scan(&firstTime)
	expect(request("alice", SubmitScore, encrypted(start("alice"), 100)), 200)
	expect(request("alice", SubmitScore, encrypted(start("alice"), 500)), 200)
	var afterTime time.Time
	var best int
	db.QueryRow(`SELECT best_score,best_at FROM "CompetitionPlayer" WHERE uid='alice'`).Scan(&best, &afterTime)
	if best != 500 || !afterTime.Equal(firstTime) {
		t.Fatal("lower/equal submission changed best or tie timestamp")
	}
	expect(request("bob", SubmitScore, encrypted(start("bob"), 500)), 200)
	expired := start("alice")
	if _, err = db.Exec(`UPDATE "GameRun" SET expires_at=now()-interval '1 second' WHERE id=$1`, expired); err != nil {
		t.Fatal(err)
	}
	expect(request("alice", SubmitScore, encrypted(expired, 600)), 410)
	expect(request("alice", SubmitScore, `{"data":"not-valid"}`), 400)
	var group sync.WaitGroup
	results := make(chan *httptest.ResponseRecorder, 10)
	for score := 1; score <= 10; score++ {
		body := encrypted(start("concurrent"), score)
		group.Add(1)
		go func() { defer group.Done(); results <- request("concurrent", SubmitScore, body) }()
	}
	group.Wait()
	close(results)
	for result := range results {
		expect(result, 200)
	}
	db.QueryRow(`SELECT best_score FROM "CompetitionPlayer" WHERE uid='concurrent'`).Scan(&best)
	if best != 10 {
		t.Fatalf("concurrent best=%d", best)
	}
	// Add 51 players: only the top 50 may contribute, including players outside the global top 20.
	_, err = db.Exec(`INSERT INTO "CompetitionPlayer"(uid,name,hostel_id,best_score,best_at)
 SELECT 'seed-'||i,'Player '||i,3,i,now() FROM generate_series(1,51) AS i`)
	if err != nil {
		t.Fatal(err)
	}
	w := request("", GetHostelLeaderboard, "")
	expect(w, 200)
	var hostels struct {
		Leaderboard []struct {
			HostelID int `json:"hostel_id"`
			Total    int `json:"total_score"`
			Count    int `json:"participant_count"`
		}
	}
	if err = json.Unmarshal(w.Body.Bytes(), &hostels); err != nil {
		t.Fatal(err)
	}
	found := false
	for _, h := range hostels.Leaderboard {
		if h.HostelID == 3 {
			found = true
			if h.Total != 1325 || h.Count != 50 {
				t.Fatalf("top50: %+v", h)
			}
		}
	}
	if !found {
		t.Fatal("hostel missing")
	}
	w = request("", GetPlayerLeaderboard, "")
	expect(w, 200)
	var players struct{ Players []RankedPlayer }
	json.Unmarshal(w.Body.Bytes(), &players)
	if len(players.Players) != 20 || players.Players[0].Name != "alice" || players.Players[1].Name != "bob" {
		t.Fatalf("top20/tie order: %s", w.Body)
	}
	t.Setenv("RUN_STARTS_PER_MINUTE", "1")
	expect(request("alice", StartRun, ""), 429)
	t.Setenv("SUBMISSIONS_PER_MINUTE", "1")
	expect(request("alice", SubmitScore, encrypted(run, 500)), 429)
	var count int
	db.QueryRow(`SELECT count(*) FROM "SubmissionAttempt" WHERE outcome='accepted'`).Scan(&count)
	if count != 14 {
		t.Fatalf("accepted history count=%d", count)
	}
}
