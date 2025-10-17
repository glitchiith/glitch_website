package config

func Init() {
    LoadEnv()
	InitFirebase()
	InitDB()
}

