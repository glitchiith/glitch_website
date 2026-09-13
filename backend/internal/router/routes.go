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
		api.GET("/get-scores", controller.GetPlayerLeaderboard)
		api.GET("/hostels", controller.GetHostels)
		api.GET("/hello", controller.Greet)
		// Leaderboard routes
		leaderboard := api.Group("/leaderboard")
		{
			leaderboard.GET("/hostels", controller.GetHostelLeaderboard)
			leaderboard.GET("/players", controller.GetPlayerLeaderboard)
		}

		// Protected routes
		protected := api.Group("")
		protected.Use(middlewares.FirebaseAuth())
		{
			protected.GET("/get-uid", controller.GetUID)
			protected.POST("/register-user", controller.RegisterUser)
			protected.GET("/profile", controller.GetProfile)
			protected.PUT("/profile/hostel", controller.SelectHostel)
			protected.POST("/runs", controller.StartRun)
			protected.POST("/submit-score", controller.SubmitScore)
		}
	}
}
