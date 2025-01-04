package handler

import (
	"dbproject/internal/database"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Dependent struct {
	EID          string `json:"e_id"`
	DID          string `json:"d_id"`
	Name         string `json:"name"`
	Gender       string `json:"gender"`
	Relationship string `json:"relationship"`
	Birth        string `json:"birth"`
	IsRelation   bool   `json:"is_relation"`
	EmployeeName string `json:"employee_name"`
}

// Create
func CreateDependent(w http.ResponseWriter, r *http.Request) {
	var dep Dependent

	// parse the request body
	err := json.NewDecoder(r.Body).Decode(&dep) //decode json to struct
	if err != nil {
		http.Error(w, "failed to parse request body", http.StatusBadRequest) //400
		log.Printf("create_dep-001: %v\n", err)
		return
	}

	// (referential integrity) validate if the e_id exists in employee table
	var employeeExists bool
	err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM employee WHERE e_id = ?)", &dep.EID).Scan(&employeeExists)
	if err != nil || !employeeExists {
		http.Error(w, "Employee with the given e_id does not exist", http.StatusBadRequest)
		log.Printf("create_dep-002: %v\n", err)
		return
	}

	// (Primary key) if PK exists exists -> error
	var exists bool
	err = database.GetDB().QueryRow("SELECT NOT EXISTS(SELECT 1 FROM dependent WHERE e_id = ? AND d_id = ? )", &dep.EID, &dep.DID).Scan(&exists)
	if err != nil || !exists {
		http.Error(w, "Dependent not found or already exists", http.StatusNotFound)
		log.Printf("create_dep-03: %v\n", err)
		return
	}

	// excutation
	query := `INSERT INTO dependent(e_id, d_id, name, gender, relationship, birth, is_relation)
			VALUES (?, ?, ?, ?, ?, ?, ?)`

	_, err = database.GetDB().Exec(query, &dep.EID, &dep.DID, &dep.Name, &dep.Gender, &dep.Relationship, &dep.Birth, &dep.IsRelation)
	if err != nil {
		http.Error(w, "Failed to add dep", http.StatusInternalServerError) //500
		log.Printf("create_dep-004: %v\n", err)
		return
	}

	// http response
	w.WriteHeader(http.StatusCreated)         // 設置狀態碼 201
	w.Write([]byte("dep added successfully")) //(HTTP 協議實際上是基於Byte流進行傳輸的)
	log.Println("create dep successfully")
}

// Read
func GetDependent(w http.ResponseWriter, r *http.Request) {
	// excuation
	query := `
			SELECT d.e_id, d.d_id, d.name, d.gender, d.relationship, d.birth, d.is_relation, e.name as employee_name 
			FROM dependent d 
			JOIN employee e ON d.e_id = e.e_id`

	data, err := database.GetDB().Query(query)
	if err != nil {
		//fmt.Printf("001 %v \n", err)                                              //**
		http.Error(w, "Failed to query database", http.StatusInternalServerError) //500
		log.Printf("Getdep-001: %v\n", err)                                       //**
		return
	}
	defer data.Close() //關閉查詢返回的結果集

	//api
	var dependents []Dependent //slice
	for data.Next() {

		// scan data and map to emp_struct
		var dep Dependent //object
		err := data.Scan(&dep.EID, &dep.DID, &dep.Name, &dep.Gender, &dep.Relationship, &dep.Birth, &dep.IsRelation, &dep.EmployeeName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.Printf("Getdep-002: %v\n", err)
			return
		}

		//add element to slice
		dependents = append(dependents, dep)
	}

	// Check for errors in iteration
	if err := data.Err(); err != nil {
		http.Error(w, "row iteration error", http.StatusInternalServerError)
		log.Printf("Getdep-003: %v\n", err) //**
		return
	}

	// respond as JSON
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(dependents)
	if err != nil {
		http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		log.Printf("Getdep-004: %v\n", err) //**
		return
	}
	log.Println(" get dependents successfully")
}

// Update
func UpdateDependent(w http.ResponseWriter, r *http.Request) {

	//parse the josn request
	var dep Dependent
	err := json.NewDecoder(r.Body).Decode(&dep)
	if err != nil {
		http.Error(w, "json decode error", http.StatusInternalServerError)
		log.Printf("updatedep -001 %v\n", err)
		return
	}

	//Extract routing parameters
	vars := mux.Vars(r)
	eid := vars["eid"]
	did := vars["did"]

	// (referential integrity)validate if the (e_id) exists in (employee table)
	var employeeExists bool
	err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM employee WHERE e_id = ?)", eid).Scan(&employeeExists)
	if err != nil || !employeeExists {
		http.Error(w, "Employee with the given e_id does not exist", http.StatusBadRequest)
		log.Printf("create_dep-002:e_id does not exist %v\n", err)
		return
	}

	// (Primary key) validate if the (e_id, d_id) exists
	var exists bool
	err = database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM dependent WHERE e_id = ? AND d_id = ? )", eid, did).Scan(&exists)
	if err != nil || !exists {
		http.Error(w, "Dependent not found or already deleted", http.StatusNotFound)
		log.Printf("updateDep-03: %v\n", err)
		return
	}

	query := "UPDATE dependent SET name=?, gender=?, relationship=?, birth=? ,is_relation=? WHERE e_id = ? AND d_id = ?"
	_, err = database.GetDB().Exec(query, &dep.Name, &dep.Gender, &dep.Relationship, &dep.Birth, &dep.IsRelation, eid, did)
	if err != nil {
		http.Error(w, "update db dependent error", http.StatusInternalServerError)
		log.Printf("create_dep-004: %v\n", err)
		return
	}

	//response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("updated dependent successfully"))
	log.Println("update dependent successfully")
}

// Delete
func DeleteDependent(w http.ResponseWriter, r *http.Request) {

	//Extract routing parameters
	vars := mux.Vars(r)
	eid := vars["eid"]
	did := vars["did"]

	// (Primary key) PK exists-> error
	var exists bool
	err := database.GetDB().QueryRow("SELECT EXISTS(SELECT 1 FROM dependent WHERE e_id = ? AND d_id = ? )", eid, did).Scan(&exists)
	if err != nil || !exists {
		http.Error(w, "Dependent not found or already deleted", http.StatusNotFound)
		log.Printf("updateDep-01: %v\n", err)
		return
	}

	// Update relationship
	var relationship string
	err = database.GetDB().QueryRow("SELECT relationship FROM dependent WHERE e_id = ? AND d_id = ?", eid, did).Scan(&relationship)
	if err != nil {
		http.Error(w, "Error retrieving relationship", http.StatusInternalServerError)
		log.Printf("deleteDep-002: %v\n", err)
		return
	}

	var updatedRelationship string
	switch relationship {
	case "配偶":
		updatedRelationship = "離婚"
	case "子女":
		updatedRelationship = "被人收養"
	case "手足", "父母":
		updatedRelationship = "歿"
	default:
		updatedRelationship = "關係消滅"
	}

	//execution
	query := "UPDATE dependent SET is_relation = 0, relationship = ? WHERE e_id = ? AND d_id = ?"

	rows, err := database.GetDB().Exec(query, updatedRelationship, eid, did)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Printf("deleteDep-003: %v\n", err) //**
		return
	}

	// rows are deleted brfore/id cannot found => RowsAffected()=0
	rowsAffected, err := rows.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "dependent not found or already deleted", http.StatusNotFound)
		log.Printf("deleteDep-003: %v\n", err) //**
		return
	}

	// http response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("dependent deleted and relationship updated successfully"))
	log.Println("delete dep successfully")
}
