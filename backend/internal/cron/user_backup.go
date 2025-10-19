package cron

import (
	"database/sql"
	"log"
	"time"

	"github.com/robfig/cron/v3"
	// Update this import path based on your module name
)

type UserBackup struct {
	db *sql.DB
}

func NewUserBackup(db *sql.DB) *UserBackup {
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
	// Create backup table name with timestamp
	backupTableName := "users_backup_" + time.Now().Format("2006_01_02_15_04_05")

	// Create backup table
	_, err := ub.db.Exec(`
        CREATE TABLE ` + backupTableName + ` AS 
        SELECT * FROM users
    `)

	if err != nil {
		return err
	}

	log.Printf("Successfully created backup table: %s", backupTableName)
	return nil
}
