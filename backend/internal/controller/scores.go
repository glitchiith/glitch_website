package controller

import "github.com/gin-gonic/gin"

func Greet(c *gin.Context) { c.JSON(200, gin.H{"success": true, "message": "Hello World"}) }
