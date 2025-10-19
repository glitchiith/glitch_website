package main

import (
    "log"
    "os"
    "github.com/Panshul-Jindal/glitch_website/backend/config"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/router"
    "github.com/Panshul-Jindal/glitch_website/backend/internal/cron"
)

func main() {
    // Initialize configuration
    config.Init()
    
    // Initialize database
    if err := config.InitDB(); err != nil {
        log.Fatalf("❌ Failed to connect to database: %v", err)
    }
    defer config.CloseDB()

    // Initialize Firebase
    if err := config.InitFirebase(); err != nil {
        log.Fatalf("❌ Failed to initialize Firebase: %v", err)
    }

    // Initialize and start cron job
    userBackup := cron.NewUserBackup(config.GetDB())
    userBackup.StartBackupCron()
    log.Printf("🕒 User backup cron job started")
    // Setup and start router
    r := router.SetupRouter()

    port := os.Getenv("PORT")
    log.Printf("🚀 Server starting on port %s", port)

    if err := r.Run(":" + port); err != nil {
        log.Fatalf("❌ Failed to start server: %v", err)
    }
}




