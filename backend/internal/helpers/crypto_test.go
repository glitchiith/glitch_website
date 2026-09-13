package helpers

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"testing"
)

func TestRSACompatibility(t *testing.T) {
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		t.Fatal(err)
	}
	encoded, err := x509.MarshalPKCS8PrivateKey(key)
	if err != nil {
		t.Fatal(err)
	}
	private := string(pem.EncodeToMemory(&pem.Block{Type: "PRIVATE KEY", Bytes: encoded}))
	expected := `{"runId":"38a6c801-38c8-4d81-a5a8-40bb194dc970","score":4500}`
	ciphertext, err := rsa.EncryptPKCS1v15(rand.Reader, &key.PublicKey, []byte(expected))
	if err != nil {
		t.Fatal(err)
	}
	actual, err := DecryptRSA(base64.StdEncoding.EncodeToString(ciphertext), private)
	if err != nil || actual != expected {
		t.Fatalf("roundtrip: %v", err)
	}
	if _, err = DecryptRSA("bad", private); err == nil {
		t.Fatal("accepted invalid ciphertext")
	}
	if _, err = ParsePrivateKey("bad"); err == nil {
		t.Fatal("accepted invalid key")
	}
}
