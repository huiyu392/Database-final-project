package database

import (
	"database/sql"
	"dbproject/config"
	"log"
)

// db connection
var db *sql.DB //聲明 *sql 類型的 db 變數

func InitDB() {

	cfg := config.GetDBconfig()

	// database handle
	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	//使用 MySQL 驅動程式的 Config 和類型的 FormatDSN 來收集連接屬性，並將其格式化為連接字串的 DSN。
	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}

	log.Println("Connected!") // Test the connection

}

func CloseDB() {
	if err := db.Close(); err != nil {
		log.Fatalf("Failed to close database,%v", err)
	}
}

// GetDB returns the database connection
func GetDB() *sql.DB {
	return db
}
