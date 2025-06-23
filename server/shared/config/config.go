package config

import (
	"os"
	"strconv"
)

type Config struct {
	PublicHost  string
	DatabaseURl string
	Port        string
	Database    DatabaseConfig
}

type DatabaseConfig struct {
	MaxConnections    int
	MinConnections    int
	MaxConnLifetime   int
	MaxConnIdleTime   int
	HealthCheckPeriod int
	ConnectTimeout    int
}

func LoadConfig() Config {
	return Config{
		PublicHost:  getEnv("PUBLIC_HOST", "http://localhost"),
		Port:        getEnv("PORT", "8080"),
		DatabaseURl: getEnv("DATABASE_URL", ""),
		Database: DatabaseConfig{
			MaxConnections:    getEnvAsInt("DB_MAX_CONNECTIONS", 30),
			MinConnections:    getEnvAsInt("DB_MIN_CONNECTIONS", 5),
			MaxConnLifetime:   getEnvAsInt("DB_MAX_CONN_LIFETIME", 60),
			MaxConnIdleTime:   getEnvAsInt("DB_MAX_CONN_IDLE_TIME", 30),
			HealthCheckPeriod: getEnvAsInt("DB_HEALTH_CHECK_PERIOD", 5),
			ConnectTimeout:    getEnvAsInt("DB_CONNECT_TIMEOUT", 10),
		},
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}

	return fallback
}
func getEnvAsInt(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}

	return fallback
}
