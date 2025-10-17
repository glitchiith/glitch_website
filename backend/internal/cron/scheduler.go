package cronjob

import (
	"log"

	"github.com/robfig/cron/v3"
)

func StartScheduler() {
	c := cron.New()

	_, err := c.AddFunc("@every 1m", Job)
	if err != nil {
		log.Fatalf("Error adding cron job: %v", err)
	}

	c.Start()
	defer c.Stop()

	select {}
}
