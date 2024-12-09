import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dependent.css';

const DependentPage = () => {
  const [dependents, setDependents] = useState([]);  // for stored table content
  const [employees, setEmployees] = useState([]); 
  //for search
  const [filteredDependents, setFilteredDependents] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  //for add
  const [showModal, setShowModal] = useState(false);  // 彈窗
  const [newDependent, setNewDependent] = useState({
    e_id: '',
    d_id: '',
    continent: '',
    name: '',
    gender: 'M',
    relationship: '配偶',
    birth: new Date().toISOString().split('T')[0],
    is_relation: true,
    employee_name:''
  });
  //for edit
  const [showEditModal, setShowEditModal] = useState(false); // 控制編輯彈窗
  const [editDependent, setEditDependent] = useState(null); // 編輯中的員工資料  
  
  // for statistics
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [genderFilter, setGenderFilter] = useState('all');
  const [stats, setStats] = useState({ averageAge: 0, count: 0 });

  //加載時動作
  useEffect(() => {
    fetchDependents();
    fetchEmployees();
  }, []);

  //get resquset
  const fetchDependents = async () => {
    try {
      const response = await axios.get('http://localhost:3305/dependent'); 
      //分開 is_relation
      const activeDependents = response.data.filter(dependent => dependent.is_relation === true);
      const inactiveDependents = response.data.filter(dependent => dependent.is_relation === false);
      
    const sortedDependents = [...activeDependents, ...inactiveDependents];

    setDependents(sortedDependents);
    setFilteredDependents(sortedDependents);  // 初始显示所有数据
    } catch (err) {
      console.error('Error fetching Dependents:', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3305/employee');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employee name:', err);
    }
  };
  //* 查詢處理 (只能輸入 code/name) ******************************
  const handleSearch = () => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = dependents.filter(dependent=> {
        return ( dependent.e_id.toLowerCase().includes(query)) || 
          (dependent.employee_name.toLowerCase().includes(query)) || 
          (dependent.d_id.toLowerCase().includes(query)) || 
          (dependent.name.toLowerCase().includes(query));     
      }); 
      console.log('filtered :', filtered );
      setFilteredDependents(filtered);  // 更新過濾後的資料
    } 
    else {
      setFilteredDependents(dependents);  // 若搜尋框為空，顯示所有資料
    }
  };

  //* 新增處理 ***************************************************
  // 表單 前處裡 (輸入框改變時觸發)  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === "employee_name" ){
      const selectedName = e.target.value;
      const selectedEmployee = employees.find(emp => emp.name === selectedName);
      if (selectedEmployee) {
        setNewDependent({
          ...newDependent,
          e_id: selectedEmployee.e_id, // 自動填充
          employee_name: selectedName, // 更新姓名字段
        });
      }
    }
    else if( name==="e_id" ){
      const selectedEId = e.target.value;
      const selectedEmployee = employees.find(emp => emp.e_id === selectedEId);
      if (selectedEmployee) {
        setNewDependent({
          ...newDependent,
          e_id: selectedEId, 
          employee_name: selectedEmployee.name, 
        });
      }
    }
    else{
      setNewDependent({ 
        ...newDependent, 
        [name]: value
      });
    }
    };
  
  // // 員工姓名選擇 自動補全
  // const handleEmployeeSelect = (e) => {
  //   const selectedName = e.target.value;
  //   const selectedEmployee = employees.find(emp => emp.name === selectedName);
  //   if (selectedEmployee) {
  //     setNewDependent({
  //       ...newDependent,
  //       e_id: selectedEmployee.e_id, // 自動填充
  //       employee_name: selectedName, // 更新姓名字段
  //     });
  //   }
  // };
  // const handleEIDSelect = (e) => {
  //   const selectedEId = e.target.value;
  //   const selectedEmployee = employees.find(emp => emp.e_id === selectedEId);
  //   if (selectedEmployee) {
  //     setNewDependent({
  //       ...newDependent,
  //       e_id: selectedEId, 
  //       employee_name: selectedEmployee.name, 
  //     });
  //   }
  // };

  // 表單提交 
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    // //check not null 
    // if (!newDependent.e_id || !newDependent.d_id|| !newDependent.relationship) {
    //   alert('員工/眷屬身分證字號、關係欄位錯誤！'); //***** */
    //   return; // 停止提交
    // }

    // 
    try {
      const response = await axios.post('http://localhost:3305/dependent',newDependent); //post 
      console.log('newDependent added:', response.data);

      setNewDependent({ //clear Madol content
        e_id: '',
        d_id: '',
        continent: '',
        name: '',
        gender: 'M',
        relationship: '配偶',
        birth: new Date().toISOString().split('T')[0],
        is_relation: true,
        employee_name:''
      });
      setShowModal(false); //close madal
      fetchDependents(); // refrash data
    } catch (error) {
      console.error('Error adding Dependent:', error);

    }
  };
  
  //* edit handle ************************************************
  const handleEdit = (dependent) => { 
    setEditDependent(dependent); 
    setShowEditModal(true);  
  };
  
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put( `http://localhost:3305/dependent/${editDependent.e_id}/${editDependent.d_id}`,editDependent);
      console.log('Employee updated:', response.data);
  
      setShowEditModal(false); // 關閉編輯彈窗
      fetchDependents(); // 重新加載資料
    } catch (error) {
      console.error('Error updating dependent:', error);
      alert('更新失敗，伺服器錯誤，請檢查輸入資料格式是否正確！');
    }
  };
  //* delete handle ************************************************
  // 删除处理
  const handleDelete = async (eid, did) => {
    try {
      // 调用后端删除接口
      const response = await axios.delete(`http://localhost:3305/dependent/${eid}/${did}`);
      console.log('dependent deleted:', response.data);
      fetchDependents();
    }catch (error) {
      console.error('Error deleting dependent:', error);
    }
  };
  //* statistics handle ************************************************
  const handleCalculateStats = () => {
    let filtered = filteredDependents;

    // Apply gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(dependent => dependent.gender === genderFilter);
    }

    // Calculate average age and count
    const currentYear = new Date().getFullYear();
    const ages = filtered.map(dependent => {
      const birthYear = new Date(dependent.birth).getFullYear();
      return currentYear - birthYear;
    });

    const averageAge = ages.reduce((acc, age) => acc + age, 0) / ages.length || 0;
    setStats({
      averageAge: averageAge.toFixed(2),
      count: filtered.length
    });
  };
  
  
  //*************************************************
  return (
  <div className="container">
  <div className="dependent-container">
    <h2>眷屬資料</h2>
 
    
    {/* 搜索框 */}
    <div className="search-container">
      <input 
        type="text" 
        placeholder="輸入員工姓名或分字號/眷屬身分字號" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}  // 設置查詢值
      />
      <button onClick={handleSearch}>查詢</button>
    </div>
    
    <div className="tool-container"> 
    {/* 新增*/}
    <div className="add-container">
      <button onClick={() => setShowModal(true)}>新增眷屬</button>
      {showModal && (
      <div className="modal-overlay" >
        <div className="modal-content">
        <h3>新增眷屬</h3>
          <label> 
          員工姓名：
          <select 
            name="employee_name" 
            value={newDependent.employee_name} 
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
              value={newDependent.e_id} 
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
          關係：
            <select
              name="relationship"
              value={newDependent.relationship}
              onChange={handleInputChange}
            >
              <option value="配偶">配偶</option>
              <option value="子女">子女</option>
              <option value="手足">手足</option>
              <option value="父母">父母</option>
              <option value="其他">其他</option>
            </select>
          </label>
          <label>
          眷屬姓名：
              <input
                type="text"
                name="name"
                value={newDependent.name}
                onChange={handleInputChange}
              />
          </label>
          <label>
          眷屬身分字號：
              <input
                type="text"
                name="d_id"
                maxLength="10"
                value={newDependent.d_id}
                onChange={handleInputChange}
              />
          </label>
          <label>
          眷屬性別：
              <select
                name="gender"
                value={newDependent.gender}
                onChange={handleInputChange}
              >
                <option value="M">男</option>
                <option value="F">女</option>
              </select>
          </label>
          <label>
          眷屬生日：
            <input
              type="date"
              name="birth"
              value={newDependent.birth}
              onChange={handleInputChange}
            />
          </label>


          <button className="cancel" onClick={(e) =>setShowModal(false)}>取消</button>
          <button className="confirm" onClick={handleSubmit} >確認</button>
          
        </div>
      </div>
      )}
    </div>

    {/* 统计弹窗 */}
    <div className="stats-container">
        <button onClick={() => setShowStatsModal(true)}>統計</button>
        {showStatsModal && (
          <div className="modal-overlay">
            <div className="modal-content">
            <span className="close" onClick={() =>setShowStatsModal(false)}>&times;</span>
              <h3>統計</h3>
              <div className='filter'>
                <label>
                  選擇性別：
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <option value="all">所有眷屬</option>
                    <option value="M">男眷屬</option>
                    <option value="F">女眷屬</option>
                  </select>
                </label>
                <button className="calculate" onClick={handleCalculateStats}>計算</button>
              </div>
              <div className='result'>
              <hr />
                <div>
                  <p>眷屬數量: {stats.count}</p>
                  <p>平均年齡: {stats.averageAge} 歲</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    {/* 資料表 */}
    <div className="table">
    <table id="dependentTable">
      <thead>
      <tr>
        <th>員工身分字號</th>
        <th>員工姓名</th>
        <th>關係</th>
        <th>眷屬姓名</th>
        <th>眷屬身分字號</th>
        <th>眷屬性別</th>
        <th>眷屬生日</th>
        <th>編輯</th>
        <th>刪除</th>
      </tr>
      </thead>
      <tbody>
        {filteredDependents.map((dependent,index)=>(
          <tr key={index}   className={dependent.is_relation === false ? 'deleted' : ''} >
            <td>{dependent.e_id}</td>
            <td>{dependent.employee_name}</td>
            <td>{dependent.relationship}</td>
            <td>{dependent.name}</td> 
            <td>{dependent.d_id}</td>
            <td>{dependent.gender}</td>
            <td>{dependent.birth}</td>
            <td>
              {dependent.is_relation === true && (
                <button className="edit" onClick={() => handleEdit(dependent)}>編輯</button>
              )}
            </td>
            <td>
              {dependent.is_relation == true && (
                <button className="delete" onClick={() => handleDelete(dependent.e_id, dependent.d_id)}>刪除</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
      
      {/* 編輯 */}
      {showEditModal &&(
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>編輯眷屬資料</h3>
            <label> 
              員工姓名：
              <select 
                name="name" 
                value={editDependent.employee_name} 
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const selectedEmployee = employees.find(emp => emp.name === selectedName);
                  if (selectedEmployee) {
                    setEditDependent({
                      ...editDependent,
                      e_id: selectedEmployee.e_id, // 自動填充
                      employee_name: selectedName, // 更新姓名字段
                    });
                  }
                }}
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
                value={editDependent.e_id} 
                onChange={(e) => {
                  const selectedEId = e.target.value;
                  const selectedEmployee = employees.find(emp => emp.e_id === selectedEId);
                  if (selectedEmployee) {
                    setEditDependent({
                      ...editDependent,
                      e_id: selectedEId, 
                      employee_name: selectedEmployee.name, // 也更新姓名
                    });
                  }
                }}
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
              關係：
                <select
                  name="relationship"
                  value={editDependent.relationship}
                  onChange={(e) =>
                    setEditDependent({ ...editDependent, relationship: e.target.value })
                  }
                >
                  <option value="配偶">配偶</option>
                  <option value="子女">子女</option>
                  <option value="手足">手足</option>
                  <option value="父母">父母</option>
                  <option value="其他">其他</option>

                </select>
              </label>
              <label>
              眷屬姓名：
                  <input
                    type="text"
                    name="name"
                    value={editDependent.name}
                    onChange={(e) =>
                      setEditDependent({ ...editDependent, name: e.target.value })
                    }
                  />
              </label>
              <label>
              眷屬身分字號：
                  <input
                    type="text"
                    name="d_id"
                    maxLength="10"
                    value={editDependent.d_id}
                    onChange={(e) =>
                      setEditDependent({ ...editDependent, d_id: e.target.value })
                    }
                  />
              </label>
              <label>
              眷屬性別：
                  <select
                    name="gender"
                    value={editDependent.gender}
                    onChange={(e) =>
                      setEditDependent({ ...editDependent, gender: e.target.value })
                    }
                  >
                    <option value="M">男</option>
                    <option value="F">女</option>
                  </select>
              </label>
              <label>
              眷屬生日：
                <input
                  type="date"
                  name="birth"
                  value={editDependent.birth}
                  onChange={(e) =>
                    setEditDependent({ ...editDependent, birth: e.target.value })
                  }
                />
              </label>
              <button className="cancel" onClick={() => setShowEditModal(false)}>取消</button>
              <button className="confirm" onClick={handleEditSubmit}>確認</button>
            </div>
        </div>
      )}
    
    </div>
  </div>      
  );
}

export default DependentPage;
