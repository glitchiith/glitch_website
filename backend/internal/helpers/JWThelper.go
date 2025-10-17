package helpers

import (
	"fmt"
	"os"

	"github.com/golang-jwt/jwt/v4"
)

func VerifyJWTToken(tokenString string) (jwt.MapClaims, error) {
	JwtSecret := os.Getenv("JWT_SECRET")

	secretKey := []byte(JwtSecret)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}
