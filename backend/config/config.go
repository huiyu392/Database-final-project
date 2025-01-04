package config

import "github.com/go-sql-driver/mysql"

// 配置管理
func GetDBconfig() mysql.Config {
	return mysql.Config{
		User:                 "test",     //your user_name
		Passwd:               "ej8 ej8 ", //your password
		Net:                  "tcp",
		Addr:                 "172.24.8.88:3306", //your ip and database port
		DBName:               "DBproject",        //database name
		AllowNativePasswords: true,               //只有在New config()時，此預設是true

	}
}
