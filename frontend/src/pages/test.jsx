import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/all.css';
import '../styles/employee.css';

function EmployeePage() {
  const [employees, setEmployees] = useState([]); //人員總表
  //for search
  const [filteredEmployees, setFilteredEmployees] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  //for add
  const [showModal, setShowModal] = useState(false);  // 彈窗
  const [newEmployee, setNewEmployee] = useState({ 
    e_id: '',
    name: '',
    grade: '',
    salary: '',
    phone: '',
    gender: 'M',
    birth: new Date().toISOString().split('T')[0], 
    hire_date: new Date().toISOString().split('T')[0], 
    address: '',
    photo: null, 
    is_deleted: false,
  });
  //for edit
  const [showEditModal, setShowEditModal] = useState(false); // 控制編輯彈窗
  const [editEmployee, setEditEmployee] = useState(null); // 編輯中的員工資料  
  
  // for 統計
  const [employeeStats, setEmployeeStats] = useState({
    totalEmployees: 0,
    avgAge: 0,
    avgSalary: 0,
    totalAnnualSalary: 0,
    totalMonthlySalary: 0,
    totalWeeklySalary: 0,
    byGrade: {},
  });

  const [showStatsModal, setShowStatsModal] = useState(false);  // 控制統計彈窗顯示
  const [selectedGrade, setSelectedGrade] = useState('');

  //加載時動作
  useEffect(() => {
    fetchEmployees();
  }, []);

  //get resquset
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3305/employee');
      console.log("Fetched employees:", response.data);  // 查看获取到的员工数据
      setEmployees(response.data);
      setFilteredEmployees(response.data);  // 设置初始过滤员工数据
      calculateStatistics();   // 立即进行计算
      
    } catch (err) {
      console.error('Error fetching Employees', err);
      alert('請確認伺服器是否正常運行!');
    }
  };


  //* 新增處理 ***************************************************
    //  提前前處裡
    const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    //轉換資料型以符合格式
    let valueToUse = value;
    if (name === 'phone') {
        valueToUse = value.replace(/\D/g, '');
        // valueToUse = `${valueToUse.slice(0, 3)}-${valueToUse.slice(3, 5)}-${valueToUse.slice(5, 9)}-${valueToUse.slice(9, 13)}`;//3-2-4-4
    } 
    else if (name === 'salary') {
        valueToUse = parseInt(value, 10); //轉換為整數
    }
    else if (name === "birth" || name === "hire_date") {  //轉換為日期格式
        valueToUse = new Date(value).toISOString().split('T')[0]; ; //轉換為整數
    }
    // else if (name === "photo") {//***********
    //     valueToUse = null; 
    // }

    //處裡上傳檔案
    if (type === "file" ) {
        if (files && files[0]) { 
            const file = files[0];
            const reader = new FileReader();//將圖片轉換成Base64並儲存
            reader.onloadend = () => {
                setNewEmployee({
                    ...newEmployee,
                    photo: reader.result  
                });
            };
            reader.readAsDataURL(file);  // 讀取檔案並轉換為Base64
        }else {
            setNewEmployee({
              ...newEmployee,
              photo: null, // 如果没有选择文件，将 photo 设为 null
            });
        } 
    }
    else {
        setNewEmployee({ 
        ...newEmployee, 
        [name]: valueToUse 
        });
    };
    }

    // 表單提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!isFormValid()) {
        //     alert('請檢查表單是否正確填寫');
        // return;
        // }

        // check photo 字段的正確性
        if (!newEmployee.photo) {
            newEmployee.photo = null;  // 默認圖片
        }

        //check not null 
        if (!newEmployee.e_id || !newEmployee.name) {
            alert('員工身分證/名字不可為空！');
            return; // 停止提交
        }
  
        try {
            const response = await axios.post('http://localhost:3305/employee', newEmployee); //post 
            console.log('Employee added:', response.data);

            setNewEmployee({ //clear Madol content
                e_id: '',
                name: '',
                grade: '',
                salary: '',
                phone: '',
                gender: 'M',
                birth: new Date().toISOString().split('T')[0],  // 設定為今天的日期
                hire_date: new Date().toISOString().split('T')[0],  // 設定為今天的日期
                address: '',
                photo: null,
                is_deleted: false,
            });
            setShowModal(false); //close madal
            fetchEmployees(); // refrash data
        } catch (error) {
            console.error('Error adding Employee:', error);
            alert('伺服器錯誤，請檢查輸入資料格式是否正確！');
        }
    };
  

  //* edit handle ************************************************


const handleEdit = (employee) => {
    // setCurrentEmployee(employee); // 设置当前编辑的员工
    setEditEmployee(employee); // 初始化表单数据为当前员工
    setShowEditModal(true); // 打开编辑弹窗
  };
  
  const handleEditSubmit = async () => {
    //check not null 
  //   if (!newEmployee.e_id || !newEmployee.name) {
  //     alert('員工身分證/名字不可為空！');
  //     return; // 停止提交
  // }
    
    try {
      const response = await axios.put( `http://localhost:3305/employee/${editEmployee.e_id}`,editEmployee);
      console.log('Employee updated:', response.data);
  
      setShowEditModal(false); // 關閉編輯彈窗
      fetchEmployees(); // 重新加載資料
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('更新失敗，伺服器錯誤，請檢查輸入資料格式是否正確！');
    }
  };

  //* delete handle **********************************************
  const handleDelete = async (e_id) => {
    
    try {
        const response = await axios.delete(`http://localhost:3305/employee/${e_id}`);
        console.log('Employee deleted:', response.data);
        alert('員工已刪除！');

        
        setEmployees(employees.filter(employee => employee.e_id !== e_id));// 更新總表
        fetchEmployees(); // 重新加載資料
    } catch (error) {
        console.error('Error deleting employee:', error);
        alert('刪除員工失敗，請稍後再試！');
    }
  };
  


  
  return (
  <div className="container">
    <div className="employee-container">
    {/* <main main className="content"> */}
      <h2>員工資料</h2>
      {/* 搜索框 */}
      <div className="search-container">
        <input 
          type="text" 
          placeholder="輸入員工編號或姓名" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}  // 設置查詢值
        />
        <button onClick={handleSearch}>查詢</button>
      </div> 
      
      <div className="tool-container">
        {/* 新增*/}
        <div className="add-container">
        <button onClick={() => setShowModal(true)}>新增人員</button>
        {showModal && (
        <div className="modal-overlay" >
            <div className="modal-content">
            <h3>新增員工</h3>
              <label >
                姓名：
                <input
                  type="text"
                  name="name"
                  maxLength="10"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                />
              </label>
              <label className="gender">
                性別：
                <select
                  name="gender"
                  value={newEmployee.gender}
                  onChange={handleInputChange}
                >
                  <option value="M">男</option>
                  <option value="F">女</option>
                </select>
              </label>
              <label >
                生日：
                <input
                  type="date"
                  name="birth"
                  value={newEmployee.birth}
                  onChange={handleInputChange}
                />
              </label>
              <label className="eid">
                身分證：
                <input
                  type="text"
                  name="e_id"
                  maxLength="10"
                  value={newEmployee.e_id}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                電話：
                <input
                  type="text"
                  name="phone"
                  maxLength="16" // ************
                  placeholder="如: 886-02-6666-6666"
                  value={formatPhoneNumber(newEmployee.phone)}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                住址：
                <input
                  type="text"
                  name="address"
                  maxLength="30"
                  value={newEmployee.address}
                  onChange={handleInputChange}
                />
              </label>
              <label className="date">
                錄用日期：
                <input
                  type="date"
                  name="hire_date"
                  value={newEmployee.hire_date}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                職等：
                <select
                  type="text"
                  name="grade"
                  value={newEmployee.grade}
                  onChange={handleInputChange}
                >
                <option value="">所有職等</option>
                <option value="簡任一等">簡任一等</option>
                <option value="簡任二等">簡任二等</option>
                <option value="簡任三等">簡任三等</option>
                <option value="薦任四等">薦任四等</option>
                <option value="薦任五等">薦任五等</option>
                <option value="員任六等">員任六等</option>
                <option value="員任七等">員任七等</option>
                <option value="員任九等">員任九等</option>
                <option value="員任十等">員任十等</option>
                </select>
              </label>
              <label>
                  薪資：
                  <input
                      type="text"
                      name="salary"
                      placeholder="至多8位數"
                      maxLength="8"
                      value={newEmployee.salary}
                      onChange={handleInputChange}
                      
                  />
              </label>
              {/* <label className="file">
                頭像：
                <input className="file"
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </label>
              */}

              <button className="cancel" onClick={() => setShowModal(false)}>取消</button>
                <button className="confirm" onClick={handleSubmit}>確認</button>
            </div>
          </div>
        )}
        </div>

      {/* 資料顯示 */}
      <div className="employee-grid">
          {filteredEmployees.map((employee,index) => (
          <div key={index} className="employee-card">
            <div className="top-card-section">
              <img 
                src={convertToBase64(employee.photo)} 
                alt={employee.name}
                className="employee-photo"
              />
                <div className="inner-section">
                    <h3>{employee.name}</h3>
                    <p>職等: {employee.grade}</p>
                </div>
            </div>
              
            <div className="mid-card-section">
              <p>性別: {employee.gender === "M" ? "男" : "女"}</p>
              <p>生日: {employee.birth}</p>
              <p>身分字號: {employee.e_id}</p>
              <p>電話: {formatPhoneNumber(employee.phone)}</p>
              <p>住址: {employee.address}</p>
            </div>
            
            <div className="bottom-card-section">
              <p>錄用日期: {employee.hire_date}</p>
              <p>薪資: ${formatNumber(employee.salary)} </p>
            </div>

            <div className="card-buttons">
              <button className="delete" onClick={() => handleDelete(employee.e_id)}>刪除</button>
              <button className="edit" onClick={() => handleEdit(employee)}>編輯</button>
            </div>

          </div>
          ))}
      </div>

      
      {/* 編輯 */}
      {showEditModal && (
        <div className="modal-overlay">
            <div className="modal-content">
            <h3>編輯員工資料</h3>
            <label>
                姓名：
                <input
                type="text"
                name="name"
                value={editEmployee.name}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, name: e.target.value })
                }
                />
            </label>
            <label className="gender">
                性別：
                <select
                name="gender"
                value={editEmployee.gender}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, gender: e.target.value })
                }
                >
                <option value="M">男</option>
                <option value="F">女</option>
                </select>
            </label>
            <label >
                生日：
                <input
                type="date"
                name="birth"
                value={editEmployee.birth}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, birth: e.target.value })
                }
                />
            </label>
            <label className="eid">
                身分證：
                <input
                type="text"
                name="e_id"
                value={editEmployee.e_id}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, e_id: e.target.value })
                }
                />
            </label>
            <label>
                電話：
                <input
                type="text"
                name="phone"
                maxLength="16" // ************
                placeholder="如: 886-02-6666-6666"
                value={formatPhoneNumber(editEmployee.phone)}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, phone: e.target.value })
                }
                />
            </label>
            <label>
                住址：
                <input
                type="text"
                name="address"
                value={editEmployee.address}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, address: e.target.value })
                }
                />
            </label>
            <label className="date">
              錄用日期：
              <input
                type="date"
                name="hire_date"
                value={newEmployee.hire_date}
                onChange={(e) =>
                  setEditEmployee({ ...editEmployee, hire_date: e.target.value })
                }
              />
            </label>
            <label>
                職等：
                <select
                type="text"
                name="grade"
                value={editEmployee.grade}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, grade: e.target.value })
                }
                >
                <option value="">所有職等</option>
                <option value="簡任一等">簡任一等</option>
                <option value="簡任二等">簡任二等</option>
                <option value="簡任三等">簡任三等</option>
                <option value="薦任四等">薦任四等</option>
                <option value="薦任五等">薦任五等</option>
                <option value="員任六等">員任六等</option>
                <option value="員任七等">員任七等</option>
                <option value="員任九等">員任九等</option>
                <option value="員任十等">員任十等</option>
                </select>
            </label>
            <label>
                薪資：
                <input
                type="text"
                name="salary"
                value={editEmployee.salary}
                onChange={(e) =>
                    setEditEmployee({ ...editEmployee, salary: e.target.value })
                }
                />
            </label>
            <button className="cancel" onClick={() => setShowEditModal(false)}>取消</button>
            <button className="confirm" onClick={handleEditSubmit}>確認</button>
            </div>
        </div>
      )}
    
    
    {/* </main> */}
    </div>
  </div>
  );
}

export default EmployeePage;
