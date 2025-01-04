import React, { useState, useEffect } from 'react';
import axios from 'axios';
 import '../styles/assignment.css';

const AssignPage = () => {
  const [assignments, setAssignments] = useState([]);  // for stored table content
  const [employees, setEmployees] = useState([]); 
  const [countries, setCountries] = useState([]); 
  //for search
  const [filteredAssignments, setFilteredAssignments] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  //for add
  const [showModal, setShowModal] = useState(false);  // 彈窗
  const [newAssignment, setNewAssignment] = useState({ 
    e_id: '',
    assign_date: new Date().toISOString().split('T')[0], 
    code: '',
    ambassador: '',
    is_assign: 1,
    ename: '',
    cname: '',
    aname: ''
  });
  //for staitstics
  const [showStatsModal, setShowStatsModal] = useState(false); // 控制统计弹窗
  const [selectedCountry, setSelectedCountry] = useState(''); // 当前选择的国家
  const [statistics, setStatistics] = useState({}); // 统计结果

  //加載時動作
  useEffect(() => {
    fetchAssignments();
    fetchEmployees();
    fetchCountries();
  }, []);

  //get resquset
  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:3305/assignment'); 

      setAssignments(response.data);
      setFilteredAssignments(response.data);  // 初始顯示所有國家
    //   updateStatistics(response.data); 
    } catch (err) {
      console.error('Error fetching Assignments:', err);
    }
  };
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3305/employee');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employee:', err);
    }
  };
  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:3305/country');
      setCountries(response.data);
    } catch (err) {
      console.error('Error fetching country:', err);
    }
  };


  //* 查詢處理 ******************************
  const handleSearch = () => {
  if (searchQuery) { //get the input value 
    const query = searchQuery.toLowerCase();
    const filtered = assignments.filter(assignment=> {
      return ( assignment.e_id.toLowerCase().includes(query)) || 
        (assignment.ename.toLowerCase().includes(query)) || 
        (assignment.code.toLowerCase().includes(query)) || 
        (assignment.cname.toLowerCase().includes(query));     
    }); 
      console.log('filtered :', filtered );
      setFilteredAssignments(filtered);  // 更新過濾後的資料
    } 
    else {
      setFilteredAssignments(assignments);  // 若搜尋框為空，顯示所有資料
    }
  };

  //* 新增處理 ***************************************************
  //  提前前處裡
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    //轉換資料型以符合格式
    let valueToUse = value;
    
    if (name === "assign_date") {  //轉換為日期格式
        valueToUse = new Date(value).toISOString().split('T')[0]; ;
    }
      
    if(name === "ename" ){
      const selectedName = e.target.value;
      const selectedEmployee = employees.find(emp => emp.name === selectedName);
      if (selectedEmployee) {
        setNewAssignment({
          ...newAssignment,
          e_id: selectedEmployee.e_id, // 自動填充
          ename: selectedName, // 更新姓名字段
        });
      }
    } else if( name==="e_id" ){
      const selectedEId = e.target.value;
      const selectedEmployee  = employees.find(emp => emp.e_id=== selectedEId);
      if (selectedEmployee) {
        setNewAssignment({
          ...newAssignment,
          e_id: selectedEId, 
          ename: selectedEmployee.name, 
        });
      }
    } //cname, code
    else if(name === "cname" ){
      const selectedName = e.target.value;
      const selectedCountry = countries.find(c => c.name === selectedName);
      if (selectedCountry) {
        setNewAssignment({
          ...newAssignment,
          code: selectedCountry.code, // 自動填充
          cname: selectedName, // 更新姓名字段
        });
      }
    } else if( name==="code" ){
      const selectedCode= e.target.value;
      const selectedCountry = countries.find(c => c.code === selectedCode);
      if (selectedCountry) {
        setNewAssignment({
          ...newAssignment,
          code: selectedCode, 
          cname: selectedCountry.name, 
        });
      }
    // }
    //else if(name === "aname" ){
    //   const selectedName = e.target.value;
    //   const selectedAssignment = assignments.find(a => a.aname === selectedName);
    //   if (selectedAssignment ) {
    //     setNewAssignment({
    //       ...newAssignment,
    //       ambassador: selectedAssignment.ambassador, // 自動填充
    //       aname: selectedName, // 更新姓名字段
    //     });
    //   }
    } else{
      setNewAssignment({ 
        ...newAssignment, 
        [name]: valueToUse 
      });
    }
  };
  // 表單提交
  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const response = await axios.post('http://localhost:3305/assignment', newAssignment); //post 
          console.log('assignment added:', response.data);

          setNewAssignment({ //clear Madol content
            e_id: '',
            assign_date: new Date().toISOString().split('T')[0], 
            code: '',
            ambassador: '',
            is_assign: 1,
            ename: '',
            cname: ''
          });
          setShowModal(false); //close madal
          fetchAssignments(); // refrash data
      } catch (error) {
          console.error('Error adding :', error);
          alert('伺服器錯誤，請檢查輸入資料格式是否正確！');
      }
  };
  //*************************************************** */
  const calculateStatistics = () => {
    if (!selectedCountry) {
      alert('請選擇一個國家！');
      return;
    }
  
    const country = countries.find(c => c.name === selectedCountry);
    if (!country) {
      alert('找不到該國家資料！');
      return;
    }
  
    const totalEmployees = assignments.filter(a => a.cname === selectedCountry && a.is_assign).length;
    const employeesPerArea = country.area ? (totalEmployees / country.area).toFixed(7) : '無法計算';
  
    setStatistics({
      totalEmployees,
      employeesPerArea,
      area: country.area || '未知',
    });
  };
  
  //*************************************************** */
  return (
    
  <div className="container">
  <div className="assignment-container">
    <h2>員工派遣資料</h2>
    {/* 搜索框 */}
    <div className="search-container">
      <input 
        type="text" 
        placeholder="輸入員工姓名或身分字號/國家代號或名稱" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}  // 設置查詢值
      />
      <button onClick={handleSearch}>查詢</button>
    </div>

    <div className="tool-container"> 
    {/* 新增*/}
    <div className="add-container">
      <button onClick={() => setShowModal(true)}>新增派駐資料</button>
      {showModal && (
      <div className="modal-overlay" >
        <div className="modal-content">
        <h3>新增派駐資料</h3>
          <label> 
          員工姓名：
          <select 
            name="ename" 
            value={newAssignment.ename} 
            onChange={handleInputChange}
          >
            <option value="">請選擇員工姓名</option>
            {employees.map(emp => (
              <option key={emp.e_id} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>
          </label>
          <label>
            員工身分字號：
            <select 
              name="e_id" 
              value={newAssignment.e_id} 
              onChange={handleInputChange}
            >
              <option value="">請選擇員工身分字號</option>
              {employees.map(emp => (
                <option key={emp.name} value={emp.e_id}>
                  {emp.e_id}
                </option>
              ))}
            </select>
          </label>
          <label>
          派駐日期：
            <input
              type="date"
              name="assign_date"
              value={newAssignment.assign_date}
              onChange={handleInputChange}
            />
          </label>

          <label>
            國家代碼：
            <select 
              name="code" 
              value={newAssignment.code} 
              onChange={handleInputChange}
            >
              <option value="">請選擇員工姓名</option>
              {countries.map(c => (
                <option key={c.name} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
          </label>
          <label>
            國家名稱：
            <select 
                name="cname" 
                value={newAssignment.cname} 
                onChange={handleInputChange}
              >
                <option value="">請選擇員工姓名</option>
                {countries.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
          國家大使：
              <input
                type="text"
                name="ambassador"
                maxLength="14"
                value={newAssignment.ambassador}
                onChange={handleInputChange}
                />
            {/* <select
                name="aname"
                value={newAssignment.ambassador}
                onChange={handleInputChange}
              >
              <option value="">請選擇大使</option>
              {assignments.map(assign=> (
                <option key={assign.ambassador} value={assign.aname}>
                  {assign.aname}
                </option>
              ))}
            </select> */}
              {/* <p>
                {assignments.map(c => (
                <option key={c.name} value={c.code}>
                  {c.code}
                </option>
              ))}
              </p> */}
          </label>
         

          <button className="cancel" onClick={(e) =>setShowModal(false)}>取消</button>
          <button className="confirm" onClick={handleSubmit} >確認</button>
          
        </div>
      </div>
      )}
    </div>
    {/* 統計 */}
    <div className="statistics-container">
    <button onClick={() => setShowStatsModal(true)}>統計</button>
    {showStatsModal && (
      <div className="modal-overlay">
        <div className="stats-modal-content">
        <span className="close" onClick={() =>setShowStatsModal(false)}>&times;</span>
          <h3>統計派駐數據</h3>
          
          <div className="filter">
          <label>
            國家名稱：
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">請選擇國家</option>
              {countries.map(c => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={calculateStatistics}>統計</button>
          </div>

          <div className="result">
          <hr />
            {statistics.totalEmployees !== undefined && (
              <div className="stats-result">
                <p>總派駐員工數：{statistics.totalEmployees}</p>
                <p>國家領土面積：{statistics.area}</p>
                <p>每單位面積之派駐員工數：{statistics.employeesPerArea}</p>
                
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>

    </div>
    
    {/* 資料表 */}
    <div className="table">
    <table id="assignmentTable">
      <thead>
      <tr>
        <th>員工身分字號</th>
        <th>員工姓名</th>
        <th>派駐國家代碼</th>
        <th>派駐國家</th>
        <th>派駐日期</th>
        <th>大使姓名</th>
        <th>派遣狀態</th>
      </tr>
      </thead>
      <tbody>
        {filteredAssignments.map((assignment,index)=>(
          <tr key={index} className={assignment.is_assign === false ? 'deleted' : ''}>
            <td>{assignment.e_id}</td>
            <td>{assignment.ename}</td>
            <td>{assignment.code}</td>
            <td>{assignment.cname}</td> 
            <td>{assignment.assign_date}</td>
            
            <td>{assignment.ambassador}</td>
            {/* <td>{assignment.aname}</td> */}
            <td>
            {assignment.is_assign == 1
              ? '派駐中'
              : assignment.is_assign == 0
              ? '離職'
              : assignment.is_assign == 2
              ? '調回原職'
              : '未知狀態'}
          </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
  </div>      
  );
}

export default AssignPage;
