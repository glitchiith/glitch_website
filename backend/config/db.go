package config

import (
    "database/sql"
    "fmt"
    "log"
"os"
    _ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() error {
    databaseURL := os.Getenv("DATABASE_URL")

    db, err := sql.Open("postgres", databaseURL)
    if err != nil {
        return fmt.Errorf("error opening database: %w", err)
    }

    if err := db.Ping(); err != nil {
        return fmt.Errorf("error connecting to database: %w", err)
    }

    // Set connection pool settings (important for Neon)
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)

    DB = db
    log.Println("✅ Database connected successfully")
    return nil
}

func CloseDB() {
    if DB != nil {
        DB.Close()
        log.Println("🔌 Database connection closed")
    }
}


func GetDB() *sql.DB {
    return DB
}