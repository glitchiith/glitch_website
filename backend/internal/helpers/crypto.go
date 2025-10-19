package helpers

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"log"
)

// call TryDecrypt(encryptedData, privateKeyPEM)
func DecryptRSA(encryptedData, privateKeyPEM string) (string, error) {

	// Load private key
	privBlock, _ := pem.Decode([]byte(privateKeyPEM))
	if privBlock == nil {
		log.Fatal("Failed to parse private key PEM")
	}

	// PKCS#8 parsing
	privAny, err := x509.ParsePKCS8PrivateKey(privBlock.Bytes)
	if err != nil {
		log.Fatalf("Failed to parse PKCS#8 private key: %v", err)
	}

	// Type assert to *rsa.PrivateKey
	privKey, ok := privAny.(*rsa.PrivateKey)
	if !ok {
		log.Fatal("Not an RSA private key")
	}

	ciphertext, err := base64.StdEncoding.DecodeString(encryptedData)
	if err != nil {
		return "", fmt.Errorf("base64 decode: %v", err)
	}

	plaintext, err := rsa.DecryptPKCS1v15(rand.Reader, privKey, ciphertext)
	if err != nil {
		return "", fmt.Errorf("decryption failed: %v", err)
	}

	return string(plaintext), nil
}
