package middlewares

import (
	"github.com/gin-gonic/gin"
	"net/http/httptest"
	"testing"
)

func TestGuestCannotSubmit(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(FirebaseAuth())
	r.POST("/", func(c *gin.Context) { t.Error("guest reached protected handler") })
	req := httptest.NewRequest("POST", "/", nil)
	req.Header.Set("Cookie", "guestMode=true")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != 401 {
		t.Fatalf("got %d", w.Code)
	}
}
