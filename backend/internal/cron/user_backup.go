package cron

import (
    "database/sql"
    "encoding/json"
    "log"
    "os"
    "path/filepath"
    "time"
"fmt"
    "github.com/robfig/cron/v3"
)

type UserBackup struct {
    db *sql.DB
}

func NewUserBackup(db *sql.DB) *UserBackup {
    // Create backups directory if it doesn't exist
    if err := os.MkdirAll("backups", 0755); err != nil {
        log.Printf("Error creating backups directory: %v", err)
    }
    return &UserBackup{
        db: db,
    }
}

func (ub *UserBackup) StartBackupCron() {
    c := cron.New()

    // Schedule backup every 30 minutes
    _, err := c.AddFunc("*/2 * * * *", func() {
        err := ub.backupUsers()
        if err != nil {
            log.Printf("Error backing up users: %v", err)
        }
    })

    if err != nil {
        log.Printf("Error scheduling backup: %v", err)
        return
    }

    c.Start()
}

func (ub *UserBackup) backupUsers() error {
    // Query all users
    rows, err := ub.db.Query("SELECT * FROM Users")
    if err != nil {
        return err
    }
    defer rows.Close()

    var users []map[string]interface{}
    cols, _ := rows.Columns()

    for rows.Next() {
        // Create a slice of interface{} to store the values
        values := make([]interface{}, len(cols))
        valuePtrs := make([]interface{}, len(cols))
        
        for i := range values {
            valuePtrs[i] = &values[i]
        }

        if err := rows.Scan(valuePtrs...); err != nil {
            return err
        }

        // Create a map for this row
        entry := make(map[string]interface{})
        for i, col := range cols {
            entry[col] = values[i]
        }
        users = append(users, entry)
    }

    // Create backup file name with timestamp
    backupFileName := fmt.Sprintf("users_backup_%s.json", time.Now().Format("2006_01_02_15_04_05"))
    backupPath := filepath.Join("backups", backupFileName)

    // Convert to JSON and save to file
    jsonData, err := json.MarshalIndent(users, "", "    ")
    if err != nil {
        return err
    }

    if err := os.WriteFile(backupPath, jsonData, 0644); err != nil {
        return err
    }

    log.Printf("Successfully created backup file: %s", backupPath)
    return nil
}