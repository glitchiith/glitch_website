package router

import (
	"github.com/Panshul-Jindal/glitch_website/backend/internal/controller"
	"github.com/Panshul-Jindal/glitch_website/backend/internal/middlewares"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
    api := r.Group("/api")
    {
        // Public routes
        api.GET("/get-scores", controller.GetScores)
        
        // Leaderboard routes
        leaderboard := api.Group("/leaderboard")
        {
            leaderboard.GET("/hostels", controller.GetHostelLeaderboard)
        }

        // Protected routes
        protected := api.Group("")
        protected.Use(middlewares.FirebaseAuth())
        {
            protected.GET("/get-uid", controller.GetUID)
            protected.POST("/register-user", controller.RegisterUser)
            protected.POST("/submit-score", controller.SubmitScore)
        }
    }
}