package config

import "github.com/go-sql-driver/mysql"

// 配置管理
func GetDBconfig() mysql.Config {
	return mysql.Config{
		User:                 "test",
		Passwd:               "ej8 ej8 ",
		Net:                  "tcp",
		Addr:                 "172.24.8.88:3306",
		DBName:               "DBproject",
		AllowNativePasswords: true, //只有在New config()時，此預設是true

	}
}
