package helpers

import (
    "strings"
)

func NormalizeEmail(email string) string {
    parts := strings.Split(email, "@")
    if len(parts) != 2 {
        return email
    }

    localPart := strings.ToUpper(parts[0])
    domain := strings.ToLower(parts[1])

    return localPart + "@" + domain
}