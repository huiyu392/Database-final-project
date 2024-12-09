package handler

import (
	"dbproject/internal/database"
	"encoding/json"
	"log"

	"net/http"
)

type Country struct {
	Code            string `json:"code"`
	Name            string `json:"name"`
	Continent       string `json:"continent"`
	Headman         string `json:"headman"`
	ForeignMinister string `json:"foreign_minister"`
	ContactPerson   string `json:"contact_person"`
	Population      int64  `json:"population"`
	Area            int64  `json:"area"`
	Phone           string `json:"phone"`
	IsAlly          bool   `json:"is_ally"`
	IsExit          bool   `json:"is_exit"`
}

// Create ==>影響??
func CreateCountry(w http.ResponseWriter, r *http.Request) {
	var c Country

	// parse the request body(json)
	err := json.NewDecoder(r.Body).Decode(&c) //decode json to struct
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest) //400
		log.Printf("create-country-001: %v\n", err)
		return
	}

	// excutation
	query := `INSERT INTO country(code, name, continent, headman, foreign_minister, contact_person, population, area, phone, is_ally, is_exit)
			  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err = database.GetDB().Exec(query, &c.Code, &c.Name, &c.Continent, &c.Headman, &c.ForeignMinister, &c.ContactPerson, &c.Population, &c.Area, &c.Phone, &c.IsAlly, &c.IsExit)
	if err != nil {
		http.Error(w, "Failed to add country", http.StatusInternalServerError) //500
		log.Printf("create-country-002: %v\n", err)
		return
	}

	//檢查 是否影響派遣表
	var isAffected bool
	err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM assignment WHERE code = ? )", &c.Code).Scan(&isAffected)
	if err != nil {
		http.Error(w, "Error retrieving employee deletion status", http.StatusInternalServerError)
		log.Printf("deleteDep-003: %v\n", err)
		return
	}
	if isAffected {
		// Update the assignment table
		assignmentQuery := "UPDATE assignment SET is_assign = 0 WHERE code = ?"
		_, err := database.GetDB().Exec(assignmentQuery, &c.Code)
		if err != nil {
			http.Error(w, "Error updating assignment", http.StatusInternalServerError)
			log.Printf("deleteDep-004: %v\n", err)
			return
		}
	}

	// http response
	w.WriteHeader(http.StatusCreated)             // 設置狀態碼 201
	w.Write([]byte("country added successfully")) //(HTTP 協議實際上是基於Byte流進行傳輸的)
	log.Println("CreateCountry successfully")     //**
}

// Read
func GetCountry(w http.ResponseWriter, r *http.Request) {
	// // 解析 multipart/form-data 請求
	// err := r.ParseMultipartForm(10 << 20) // 设置最大上传文件大小为 10MB
	// if err != nil {
	// 	http.Error(w, "Unable to parse form", http.StatusBadRequest)
	// 	return
	// }

	// excuation
	query := "SELECT * FROM country"

	data, err := database.GetDB().Query(query)
	if err != nil {
		http.Error(w, "Failed to query database", http.StatusInternalServerError) //500
		log.Printf("GetCountry-001: %v\n", err)                                   //**
		return
	}
	defer data.Close() //關閉查詢返回的結果集

	//api
	var countries []Country //slice
	for data.Next() {

		// scan data and map to emp_struct
		var c Country //object
		err := data.Scan(&c.Code, &c.Name, &c.Continent, &c.Headman, &c.ForeignMinister, &c.ContactPerson, &c.Population, &c.Area, &c.Phone, &c.IsAlly, &c.IsExit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("GetCountry-002: %v\n", err)
			return
		}

		//add element to slice
		countries = append(countries, c)
	}

	// Check for errors in iteration
	if err := data.Err(); err != nil {
		http.Error(w, "row iteration error", http.StatusInternalServerError)
		log.Printf("GetCountry-003: %v\n", err) //**
		return
	}

	// respond as JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(countries)
	if err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		log.Printf("GetCountry-004: %v\n", err) //**
		return
	}
	log.Println(" GetCountry successfully")
}

// // Update (允許更改國家狀態)
// func UpdateCountry(w http.ResponseWriter, r *http.Request) {
// 	//parse the josn request
// 	var c Country
// 	err := json.NewDecoder(r.Body).Decode(&c)
// 	if err != nil {
// 		http.Error(w, "json decode error", http.StatusInternalServerError)
// 		log.Printf("updateCountry -001 %v\n", err)
// 		return
// 	}

// 	//Extract routing parameters
// 	vars := mux.Vars(r)
// 	eid := vars["eid"]

// 	query := "UPDATE country SET name=?, continent=?, headman=?, foreign_minister=?, contact_person=?, population=?, area=?, phone=?, is_ally=?, is_exit =? WHERE code=?"
// 	_, err = database.GetDB().Exec(query, &c.Name, &c.Continent, &c.Headman, &c.ForeignMinister, &c.ContactPerson, &c.Population, &c.Area, &c.Phone, &c.IsAlly, &c.IsExit, eid)
// 	if err != nil {
// 		http.Error(w, "update db Country error", http.StatusInternalServerError)
// 		return
// 	}

// 	//response
// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte("updatedCountry successfully"))
// }
