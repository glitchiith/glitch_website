package config

import (
	"context"
	"log"
	"os"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var FirebaseApp *firebase.App

func InitFirebase() error {
	credentialsPath := os.Getenv("FIREBASE_CREDENTIALS")

	opt := option.WithCredentialsFile(credentialsPath)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return err
	}

	FirebaseApp = app
	log.Println("✅ Firebase initialized successfully")
	return nil
}
