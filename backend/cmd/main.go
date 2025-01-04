package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"dbproject/internal/database"
	"dbproject/internal/handler"
)

// test **
type Response struct {
	AA string `json:"A"`
	BB string `json:"B"`
}

// 啟動服務
func main() {

	//initial database
	database.InitDB()
	defer database.CloseDB() //延遲執行某個函式直到當前函式執行結束

	//set route
	router := mux.NewRouter()

	//employee CRUD
	router.HandleFunc("/employee", handler.GetEmployee).Methods("GET")
	router.HandleFunc("/employee", handler.CreateEmployee).Methods("POST")
	router.HandleFunc("/employee/name", handler.GetEmployeeName).Methods("GET")
	router.HandleFunc("/employee/{eid}", handler.DeleteEmployee).Methods("DELETE")
	router.HandleFunc("/employee/{eid}", handler.UpdateEmployee).Methods("PUT")

	//country CRUD
	router.HandleFunc("/country", handler.GetCountry).Methods("GET")
	router.HandleFunc("/country", handler.CreateCountry).Methods("POST")

	//assignment CRUD
	router.HandleFunc("/assignment", handler.GetAssignment).Methods("GET")
	router.HandleFunc("/assignment", handler.CreateAssignment).Methods("POST")

	//dependent CRUD
	router.HandleFunc("/dependent", handler.GetDependent).Methods("GET")
	router.HandleFunc("/dependent", handler.CreateDependent).Methods("POST")
	router.HandleFunc("/dependent/{eid}/{did}", handler.DeleteDependent).Methods("DELETE")
	router.HandleFunc("/dependent/{eid}/{did}", handler.UpdateDependent).Methods("PUT")

	// 啟用 CORS 中間件，允許來自 http://localhost:3000 的請求
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},        // 允許來自 localhost:3000 的請求
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"}, // 允許的 HTTP 請求方法
		AllowedHeaders: []string{"Content-Type"},                 // 允許的請求標頭
	})

	// 啟用 CORS 中間件
	handler := c.Handler(router) // 使用 CORS 中間件處理路由器
	//active http sever on port
	log.Fatal(http.ListenAndServe(":3305", handler))

}
