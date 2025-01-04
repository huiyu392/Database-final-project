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
	// // (referential integrity) Ambassador
	// var AmbassadorExists bool
	// err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM employee WHERE e_id = ?)", &assign.Ambassador).Scan(&AmbassadorExists)
	// if err != nil || !AmbassadorExists {
	// 	http.Error(w, "Employee with the given e_id does not exist", http.StatusBadRequest)
	// 	log.Printf("create_assign-004: %v\n", err)
	// 	return
	// }

	// (Primary key) if PK exists exists -> error***
	// var PKexists bool
	// err = database.GetDB().QueryRow("SELECT NOT EXISTS(SELECT 1 FROM dependent WHERE e_id = ? AND code = ? )", &assign.EID, &assign.Code).Scan(&PKexists)
	// if err != nil || !PKexists {
	// 	http.Error(w, "Dependent not found or already exists", http.StatusNotFound)
	// 	log.Printf("create_assign-05: %v\n", err)
	// 	return
	// }

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
	// `
	// SELECT a.e_id, a.assign_date, a.code, a.ambassador, a.is_assign, e.name AS ename, c.name AS cname, amb.name AS aname
	// FROM assignment a
	// JOIN employee e ON a.e_id = e.e_id
	// JOIN country c ON a.code = c.code
	// LEFT JOIN employee amb ON a.ambassador = amb.e_id  `

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

		// var assign Assignment //object
		// err := data.Scan(&assign.EID, &assign.AssignDate, &assign.Code, &assign.Ambassador, &assign.IsAssign, &assign.EName, &assign.CName, &assign.AName)
		// if err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	log.Printf("Getassignment-002: %v\n", err)
		// 	return
		// }

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

// // Update
// func UpdateAssignment(w http.ResponseWriter, r *http.Request) {
// 	//parse the josn request
// 	var assign Assignment
// 	err := json.NewDecoder(r.Body).Decode(&assign)
// 	if err != nil {
// 		http.Error(w, "json decode error", http.StatusInternalServerError)
// 		log.Printf("updateAssignment -001 %v\n", err)
// 		return
// 	}

// 	//Extract routing parameters
// 	vars := mux.Vars(r)
// 	eid := vars["eid"]
// 	code := vars["code"]

// 	// check referential integrity => pk exit?
// 	var count int
// 	err = database.GetDB().QueryRow("SELECT COUNT(*) FROM country WHERE code = ?", &assign.Code).Scan(&count)
// 	if err != nil || count == 0 {
// 		http.Error(w, "Country does not exist", http.StatusBadRequest)
// 		return
// 	}
// 	err = database.GetDB().QueryRow("SELECT COUNT(*) FROM employee WHERE e_id = ?", &assign.EID).Scan(&count)
// 	if err != nil || count == 0 {
// 		http.Error(w, "Employee does not exist", http.StatusBadRequest)
// 		return
// 	}

// 	//excution
// 	query := "UPDATE assignment SET name=?, assign_date=?, ambassador=? WHERE e_id=? AND code=? AND is_deleted = FALSE" //id、is_delete 不可改
// 	_, err = database.GetDB().Exec(query, &assign.Name, &assign.AssignDate, &assign.Ambassador, eid, code)
// 	if err != nil {
// 		http.Error(w, "update db Assignment error", http.StatusInternalServerError)
// 		return
// 	}

// 	//response
// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte("updated Assignment successfully"))
// }

// // Delete
// func DeleteAssignment(w http.ResponseWriter, r *http.Request) {

// 	//Extract routing parameters
// 	vars := mux.Vars(r)
// 	eid := vars["eid"]
// 	code := vars["code"]

// 	// // First, check if the employee exists and is not already deleted
// 	// q := "SELECT is_deleted FROM employee WHERE e_id = ?"
// 	// var isDeleted bool
// 	// err := database.GetDB().QueryRow(q, id).Scan(&isDeleted)
// 	// if err != nil {
// 	// 	if err == sql.ErrNoRows {
// 	// 		http.Error(w, "Employee not found", http.StatusNotFound)
// 	// 		log.Printf("delete-001: Employee with id %v not found\n", id)
// 	// 	} else {
// 	// 		http.Error(w, "Database query error", http.StatusInternalServerError)
// 	// 		log.Printf("delete-002: %v\n", err)
// 	// 	}
// 	// 	return
// 	// }
// 	// check fk(code) 是否存在'
// 	// check referential integrity

// 	//execution (fk -> 直接刪除)
// 	query := "UPDATE assignment SET is_deleted = TRUE WHERE e_id = ? AND code = ?"

// 	rows, err := database.GetDB().Exec(query, eid, code)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		log.Printf("delete-001: %v\n", err) //**
// 		return
// 	}

// 	// rows are deleted brfore/id cannot found => RowsAffected()=0
// 	rowsAffected, err := rows.RowsAffected()
// 	if err != nil || rowsAffected == 0 {
// 		http.Error(w, "Employee not found or already deleted", http.StatusNotFound)
// 		log.Printf("delete-002: %v\n", err) //**
// 		return
// 	}

// 	// // http response
// 	// // fmt.Fprintf(w, "delete emp successfully")
// 	w.WriteHeader(http.StatusOK)
// 	w.Write([]byte("Employee deleted successfully"))
// 	log.Println("delete emp successfully")
// }
