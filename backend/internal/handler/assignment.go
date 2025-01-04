package handler

import (
	"dbproject/internal/database"
	"encoding/json"
	"log"

	"net/http"
)

type Assignment struct {
	EID        string `json:"e_id"`
	AssignDate string `json:"assign_date"`
	Code       string `json:"code"`
	Ambassador string `json:"ambassador"`
	IsAssign   int    `json:"is_assign"`
	EName      string `json:"ename"`
	CName      string `json:"cname"`
	// AName      string `json:"aname"`
}

// Create
func CreateAssignment(w http.ResponseWriter, r *http.Request) {
	var assign Assignment

	// parse the request body
	err := json.NewDecoder(r.Body).Decode(&assign) //decode json to struct
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest) //400
		log.Printf("create assign-001: %v\n", err)
		return
	}

	// (referential integrity) e_id
	var employeeExists bool
	err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM employee WHERE e_id = ?)", &assign.EID).Scan(&employeeExists)
	if err != nil || !employeeExists {
		http.Error(w, "Employee with the given e_id does not exist", http.StatusBadRequest)
		log.Printf("create_assign-002: %v\n", err)
		return
	}
	// (referential integrity) code
	var codeExists bool
	err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM country WHERE code = ?)", &assign.Code).Scan(&codeExists)
	if err != nil || !codeExists {
		http.Error(w, "country with the given code does not exist", http.StatusBadRequest)
		log.Printf("create_assign-003: %v\n", err)
		return
	}

	// excutation
	query := `INSERT INTO assignment(e_id, assign_date, code, ambassador, is_assign)
			VALUES (?, ?, ?, ?, ?)`

	_, err = database.GetDB().Exec(query, &assign.EID, &assign.AssignDate, &assign.Code, &assign.Ambassador, &assign.IsAssign)
	if err != nil {
		http.Error(w, "Failed to add employee", http.StatusInternalServerError) //500
		log.Printf("create assign-006: %v\n", err)
		return
	}

	// http response
	w.WriteHeader(http.StatusCreated)                // 設置狀態碼 201
	w.Write([]byte("Assignment added successfully")) //(HTTP 協議實際上是基於Byte流進行傳輸的)
	log.Println("create Assignment successfully")
}

// Read
func GetAssignment(w http.ResponseWriter, r *http.Request) {
	// excuation
	query := `
			SELECT a.e_id, a.assign_date, a.code, a.ambassador, a.is_assign, e.name AS ename, c.name AS cname 
			FROM assignment a
			JOIN employee e ON a.e_id = e.e_id
			JOIN country c ON a.code = c.code `

	data, err := database.GetDB().Query(query)
	if err != nil {
		http.Error(w, "Failed to query database", http.StatusInternalServerError) //500
		log.Printf("Getassignment-001: %v\n", err)
		return
	}
	defer data.Close() //關閉查詢返回的結果集

	var assignments []Assignment //slice
	for data.Next() {

		// scan data and map to assign_struct
		var assign Assignment //object
		err := data.Scan(&assign.EID, &assign.AssignDate, &assign.Code, &assign.Ambassador, &assign.IsAssign, &assign.EName, &assign.CName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Getassignment-002: %v\n", err)
			return
		}

		//add element to slice
		assignments = append(assignments, assign)
	}

	// Check for errors in iteration
	if err := data.Err(); err != nil {
		http.Error(w, "row iteration error", http.StatusInternalServerError)
		log.Printf("Get-003: %v\n", err) //**
		return
	}

	// respond as JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(assignments)
	if err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		log.Printf("Getassignment-004: %v\n", err) //**
		return
	}
	log.Println(" get assignment successfully")
}
