package db

import (
	"context"
	"fmt"

	"github.com/LambdaIITH/go-backend/config"
)

func GetUserId(context context.Context, email string) int {
	query := `SELECT id from Users WHERE email = $1`
	fmt.Println("EMAIL: ", email)
	row := config.DB.QueryRow(context, query, email)

	var id int
	err := row.Scan(&id)
	if err != nil {
		fmt.Println(err)
	}

	return id
}
