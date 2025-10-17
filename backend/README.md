# Go Backend Template

This repository provides a starting point for all backend applications build using Go and Gin framework. 

Database: Postgres with [pgx](https://github.com/jackc/pgx) as driver.
Environment variables handled with godotenv. By default reads `.env`

## Setting up 
**Clone the repo**
`git clone https://github.com/LambdaIITH/go-backend`

**Install Dependencies**
`go mod tidy`

**Environment Variables**
`cp .env.example .env`

After the neccessary changes start the backend with:
`go run main.go`

## File Structure
├── config              # Configuration management (env variables, database connection etc)
├── internal
│   ├── controller      # Endpoint logic
│   ├── cron            # Cron job management
│   ├── db              # Database functions
│   ├── helpers         # any helper functions which is not directly related to business logic
│   ├── middlewares     # middleware management (authentication, rate limiting, ip blocking)
│   ├── router
│   │   ├── router.go   # router initialization
│   │   └── routes.go   # all the endpoints listed
│   └── schema          # defining schedma 
├── main.go

## Contributing

Feel free to fork this repository and submit pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
