package config

import (
    "log"
    "os"

    "github.com/joho/godotenv"
)

func LoadEnv() {
    if err := godotenv.Load(); err != nil {
        log.Println("⚠️  No .env file found, using environment variables")
    }
}

func GetEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        return defaultValue
    }
    return value
}

func MustGetEnv(key string) string {
    value := os.Getenv(key)
    if value == "" {
        log.Fatalf("❌ Environment variable %s is required", key)
    }
    return value
}
