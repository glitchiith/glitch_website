package config

import (
	"context"
	firebase "firebase.google.com/go/v4"
	"fmt"
	"google.golang.org/api/option"
	"log"
	"os"
)

var FirebaseApp *firebase.App

func InitFirebase() error {
	credentialsPath := os.Getenv("FIREBASE_CREDENTIALS")
	if credentialsPath == "" {
		return fmt.Errorf("set FIREBASE_CREDENTIALS to your service-account JSON path")
	}
	if _, err := os.Stat(credentialsPath); err != nil {
		return fmt.Errorf("Firebase credentials file is not accessible")
	}

	opt := option.WithCredentialsFile(credentialsPath)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return err
	}

	FirebaseApp = app
	log.Println("✅ Firebase initialized successfully")
	return nil
}
