package main

import (
	"github.com/Panshul-Jindal/glitch_website/backend/config"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/cron"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/helpers"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/router"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	config.LoadEnv()
	if err := config.InitDB(); err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer config.CloseDB()
	if err := config.InitFirebase(); err != nil {
		log.Fatalf("Firebase initialization failed: %v", err)
	}
	if _, err := helpers.ParsePrivateKey(os.Getenv("PRIVATE_KEY")); err != nil {
		log.Fatalf("Configure PRIVATE_KEY: %v", err)
	}
	// Migrations are deliberately explicit, never run automatically at startup.
	if _, err := config.DB.Exec(`SELECT 1 FROM "CompetitionPlayer" LIMIT 0`); err != nil {
		log.Fatal("Competition schema missing. Apply the reviewed migration before starting.")
	}
	cron.NewUserBackup(config.GetDB()).StartBackupCron()
	port := config.GetEnv("PORT", "8000")
	log.Printf("Server listening on :%s", port)
	server := &http.Server{
		Addr: ":" + port, Handler: router.SetupRouter(),
		ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 15 * time.Second,
		WriteTimeout: 30 * time.Second, IdleTimeout: 60 * time.Second,
	}
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
