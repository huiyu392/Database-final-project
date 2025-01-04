package handler

import (
	"dbproject/internal/database"
	"encoding/base64"
	"encoding/json"
	"log"

	"net/http"

	"github.com/gorilla/mux"
)

type Employee struct {
	EID       string `json:"e_id"`
	Name      string `json:"name"`
	Grade     string `json:"grade"`
	Salary    int64  `json:"salary"`
	Phone     string `json:"phone"`
	Gender    string `json:"gender"`
	Birth     string `json:"birth"`
	HireDate  string `json:"hire_date"`
	Address   string `json:"address"`
	Photo     []byte `json:"photo"` // 使用 []byte 來處理圖片數據
	IsDeleted bool   `json:"is_deleted"`
}

// Create
func CreateEmployee(w http.ResponseWriter, r *http.Request) {
	var emp Employee

	// parse the request body
	err := json.NewDecoder(r.Body).Decode(&emp) //decode json to struct
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest) //400
		log.Printf("create emp-001: %v\n", err)
		return
	}

	//有圖片 -> Base64 解碼為 []byte
	if emp.Photo != nil {
		photoData, err := base64.StdEncoding.DecodeString(string(emp.Photo)) //解碼
		if err != nil {
			http.Error(w, "failed to decode photo", http.StatusBadRequest) // 400
			log.Printf("create emp-002: %v\n", err)
			return
		}
		emp.Photo = photoData
	}

	// excutation
	query := `INSERT INTO employee(e_id, name, grade, salary, phone, gender, birth, hire_date, address, photo, is_deleted)
			Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err = database.GetDB().Exec(query, &emp.EID, &emp.Name, &emp.Grade, &emp.Salary, &emp.Phone, &emp.Gender, &emp.Birth, &emp.HireDate, &emp.Address, &emp.Photo, &emp.IsDeleted)
	if err != nil {
		http.Error(w, "Failed to add employee", http.StatusInternalServerError) //500
		log.Printf("create-002: %v\n", err)
		return
	}

	// http response
	w.WriteHeader(http.StatusCreated)              // 設置狀態碼 201
	w.Write([]byte("Employee added successfully")) //(HTTP 協議實際上是基於Byte流進行傳輸的)
	log.Println("create emp successfully")
}

// Read
func GetEmployee(w http.ResponseWriter, r *http.Request) {
	// excuation
	query := "SELECT * FROM employee WHERE is_deleted = FALSE" //刪除的 不顯示

	data, err := database.GetDB().Query(query)
	if err != nil {
		//fmt.Printf("001 %v \n", err)                                              //**
		http.Error(w, "001Failed to query database", http.StatusInternalServerError) //500
		log.Printf("Get-001: %v\n", err)                                             //**
		return
	}
	defer data.Close() //關閉查詢返回的結果集

	var employees []Employee //slice
	for data.Next() {

		// scan data and map to emp_struct
		var emp Employee //object
		err := data.Scan(&emp.EID, &emp.Name, &emp.Grade, &emp.Salary, &emp.Phone, &emp.Gender, &emp.Birth, &emp.HireDate, &emp.Address, &emp.Photo, &emp.IsDeleted)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Get-002: %v\n", err)
			return
		}

		// 將圖片資料轉換為 Base64 編碼字串 **
		if emp.Photo != nil {
			emp.Photo = []byte(base64.StdEncoding.EncodeToString(emp.Photo))
		}

		//add element to slice
		employees = append(employees, emp)
	}

	// Check for errors in iteration
	if err := data.Err(); err != nil {
		http.Error(w, "row iteration error", http.StatusInternalServerError)
		log.Printf("Get-003: %v\n", err) //**
		return
	}

	// respond as JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(employees)
	if err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		log.Printf("Get-004: %v\n", err) //**
		return
	}
	log.Println(" get emp successfully")
}

// Read
func GetEmployeeName(w http.ResponseWriter, r *http.Request) {
	// excuation
	query := "SELECT e_id, name FROM employee WHERE is_deleted = FALSE" //刪除的 不顯示

	data, err := database.GetDB().Query(query)
	if err != nil {
		http.Error(w, "001Failed to query database", http.StatusInternalServerError) //500
		log.Printf("GetEName-001: %v\n", err)
		return
	}
	defer data.Close() //關閉返回結果集

	var employees []Employee //slice
	for data.Next() {

		// scan data and map to emp_struct
		var emp Employee //object
		err := data.Scan(&emp.EID, &emp.Name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("GetEName-002: %v\n", err)
			return
		}
		//add element to slice
		employees = append(employees, emp)
	}

	// Check for errors in iteration
	if err := data.Err(); err != nil {
		http.Error(w, "row iteration error", http.StatusInternalServerError)
		log.Printf("GetEName-003: %v\n", err) //**
		return
	}

	// respond as JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(employees)
	if err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		log.Printf("GetEName-004: %v\n", err) //**
		return
	}
	log.Println(" get emp successfully")
}

// Update
func UpdateEmployee(w http.ResponseWriter, r *http.Request) {
	//parse the josn request
	var emp Employee
	err := json.NewDecoder(r.Body).Decode(&emp)
	if err != nil {
		http.Error(w, "json decode error", http.StatusInternalServerError)
		log.Printf("update -001 %v\n", err)
		return
	}
	// 是圖片 -> Base64 解碼為 []byte
	if emp.Photo != nil {
		photoData, err := base64.StdEncoding.DecodeString(string(emp.Photo))
		if err != nil {
			http.Error(w, "failed to decode photo", http.StatusBadRequest) // 400
			log.Printf("update emp-001: %v\n", err)
			return
		}
		emp.Photo = photoData
	}

	//Extract routing parameters
	vars := mux.Vars(r)
	eid := vars["eid"]

	query := "UPDATE employee SET name=?, grade=?, salary=?, phone=?, gender=?, birth=?, hire_date=?, address=?, photo=? WHERE e_id=? AND is_deleted = False" //id、is_delete 不可改
	_, err = database.GetDB().Exec(query, &emp.Name, &emp.Grade, &emp.Salary, &emp.Phone, &emp.Gender, &emp.Birth, &emp.HireDate, &emp.Address, &emp.Photo, eid)
	if err != nil {
		http.Error(w, "update db error", http.StatusInternalServerError)
		return
	}

	//response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("UpdateEmployee successfully"))
}

// Delete
func DeleteEmployee(w http.ResponseWriter, r *http.Request) {

	//Extract routing parameters
	vars := mux.Vars(r)
	eid := vars["eid"]
	// // First, check if the employee exists and is not already deleted
	// q := "SELECT is_deleted FROM employee WHERE e_id = ?"
	// var isDeleted bool
	// err := database.GetDB().QueryRow(q, id).Scan(&isDeleted)
	// if err != nil {
	// 	if err == sql.ErrNoRows {
	// 		http.Error(w, "Employee not found", http.StatusNotFound)
	// 		log.Printf("delete-001: Employee with id %v not found\n", id)
	// 	} else {
	// 		http.Error(w, "Database query error", http.StatusInternalServerError)
	// 		log.Printf("delete-002: %v\n", err)
	// 	}
	// 	return
	// }

	//execution
	query := "UPDATE employee SET is_deleted = 1 WHERE e_id = ? "

	rows, err := database.GetDB().Exec(query, eid)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("delete-001: %v\n", err) //**
		return
	}

	// rows are deleted brfore/id cannot found => RowsAffected()=0
	rowsAffected, err := rows.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Employee not found or already deleted", http.StatusNotFound)
		log.Printf("delete-002: %v\n", err) //**
		return
	}

	//檢查 是否影響派遣表(該員工是否是派遣中員工
	var isAffected bool
	err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM assignment WHERE e_id = ? OR ambassador=?)", eid, eid).Scan(&isAffected)
	if err != nil {
		http.Error(w, "Error retrieving employee deletion status", http.StatusInternalServerError)
		log.Printf("deleteDep-003: %v\n", err)
		return
	}

	if isAffected {
		// Update the assignment table
		assignmentQuery := "UPDATE assignment SET is_assign = 2, ambassador = NULL WHERE e_id = ?"
		_, err := database.GetDB().Exec(assignmentQuery, eid)
		if err != nil {
			http.Error(w, "Error updating assignment", http.StatusInternalServerError)
			log.Printf("deleteDep-004: %v\n", err)
			return
		}
	}

	// http response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Employee deleted successfully"))
	log.Println("deleteEmployee successfully")
}
