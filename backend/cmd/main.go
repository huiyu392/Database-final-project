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

	// router.HandleFunc("/", pingHandler)                                          //test** 跟目錄
	// router.HandleFunc("/receive-message", receiveMessageHandler).Methods("POST") // 接收 JSON 數據

	//employee CRUD
	router.HandleFunc("/employee", handler.GetEmployee).Methods("GET")
	router.HandleFunc("/employee", handler.CreateEmployee).Methods("POST")
	router.HandleFunc("/employee/name", handler.GetEmployeeName).Methods("GET")
	router.HandleFunc("/employee/{eid}", handler.DeleteEmployee).Methods("DELETE")
	router.HandleFunc("/employee/{eid}", handler.UpdateEmployee).Methods("PUT")

	//country CRUD
	router.HandleFunc("/country", handler.GetCountry).Methods("GET")
	router.HandleFunc("/country", handler.CreateCountry).Methods("POST")
	// router.HandleFunc("/country/{eid}", handler.DeleteCountry).Methods("DELETE")
	// router.HandleFunc("/country/{eid}", handler.UpdateCountry).Methods("PUT")

	//assignment CRUD
	router.HandleFunc("/assignment", handler.GetAssignment).Methods("GET")
	router.HandleFunc("/assignment", handler.CreateAssignment).Methods("POST")
	// router.HandleFunc("/assignment/{eid}/{code}", handler.DeleteAssignment).Methods("DELETE")
	// router.HandleFunc("/assignment/{eid}/{code}", handler.UpdateAssignment).Methods("PUT")

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

// for test**sencd
// pingHandler 回傳測試訊息
// func pingHandler(w http.ResponseWriter, r *http.Request) {
// 	// 回傳 JSON 格式的資料
// 	//var response Message
// 		response := Response{
// 			"A": "good",
// 			"B": "success",
// 		}

// 		// encode-> json response
// 		err := json.NewEncoder(w).Encode(&response)
// 		if err != nil {
// 			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
// 		}

// 		//for developer read
// 		w.Header().Set("Content-Type", "application/json") // 設置回應的 Content-Type 為 application/json
// 		w.WriteHeader(http.StatusOK)                       // 設定狀態碼為 200

// }

// receiveMessageHandler 接收 JSON 數據並解析
// func receiveMessageHandler(w http.ResponseWriter, r *http.Request) {
// 	var msg Response

// 	// 解析 JSON 請求體
// 	err := json.NewDecoder(r.Body).Decode(&msg)
// 	if err != nil {
// 		http.Error(w, "Failed to parse request body", http.StatusBadRequest) // 400 錯誤
// 		return
// 	}

// 	// 處理接收到的資料（此處只是簡單打印）
// 	fmt.Printf("Received Message: %s\n", msg.AA)
// 	fmt.Printf("Received Status: %s\n", msg.BB)

// 		// 回傳接收到的資料
// 		w.Header().Set("Content-Type", "application/json")
// 		w.WriteHeader(http.StatusOK) // 設定狀態碼為 200

// 		// 回傳處理結果
// 		response := map[string]string{
// 			"received_message": msg.Message,
// 			"received_status":  msg.Status,
// 		}

// 		err = json.NewEncoder(w).Encode(response)
// 		if err != nil {
// 			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
// 		}
// }
