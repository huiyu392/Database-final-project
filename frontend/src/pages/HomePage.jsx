import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../styles/home.css';

const HomePage = () => { 
  // for stored table content
  const [assignments, setAssignments] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [countries, setCountries] = useState([]); 
  const [dependents, setDependents] = useState([]);  

  //加载时的动作
  useEffect(() => {
    fetchAssignments();
    fetchEmployees();
    fetchCountries();
    fetchDependents();
  }, []);

  //get请求
  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:3305/assignment'); 
      setAssignments(response.data);
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

  const fetchDependents = async () => {
    try {
      const response = await axios.get('http://localhost:3305/dependent'); 
      setDependents(response.data);
    } catch (err) {
      console.error('Error fetching Dependents:', err);
    }
  };
  //*************************************************** */
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalEmployeesInContinent: 0,
    averageFamilyAge: 0,
    averageFamilySize: 0,
  });


  // 计算某国符合年龄条件的员工总数
  const calculateCountryAgeStats = () => {
    if (selectedCountry.length === 0) {
      alert('請選擇一個國家！');
      return;
    }

    // 过滤符合年齡條件的員工
    const filteredEmployees = assignments.filter(
      a => selectedCountry.includes(a.cname) && a.is_assign
    );
    
    const ageThreshold = parseInt(ageInput, 10);  // 从输入框读取年龄门槛
    if (isNaN(ageThreshold)) {
      alert('請輸入有效的年齡！');
      return;
    }

    const eligibleEmployees = filteredEmployees.filter(emp => {
      const birthDate = new Date(emp.birthday);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age >= ageThreshold;
    });

    setStatistics({
      totalEmployees: eligibleEmployees.length,
    });
  };

  // 计算某洲派遣的总员工数
  const calculateContinentStats = () => {
    if (!selectedContinent) {
      alert('請選擇一個洲！');
      return;
    }

    const continentCountries = countries.filter(c => c.continent === selectedContinent);
    const continentEmployees = assignments.filter(
      a => continentCountries.some(c => c.name === a.cname) && a.is_assign
    );

    setStatistics({
      totalEmployeesInContinent: continentEmployees.length,
    });
  };

  // 计算符合年龄条件的员工眷属的平均年龄和平均眷属人数
  const calculateFamilyStats = () => {
    const ageThreshold = parseInt(ageInput, 10);  // 从输入框读取年龄门槛
    if (isNaN(ageThreshold)) {
      alert('請輸入有效的年齡！');
      return;
    }

    // 过滤符合年龄条件的员工
    const eligibleEmployees = assignments.filter(emp => {
      const birthDate = new Date(emp.birthday);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age >= ageThreshold;
    });

    const families = eligibleEmployees.flatMap(emp => emp.family); // 假设每个员工有一个`family`字段，存储其眷属信息

    if (families.length === 0) {
      alert('沒有符合條件的員工或其眷屬！');
      return;
    }

    const averageAge = families.reduce((sum, fam) => sum + fam.age, 0) / families.length;
    const averageFamilySize = families.length / eligibleEmployees.length;

    setStatistics({
      averageFamilyAge: averageAge.toFixed(2),
      averageFamilySize: averageFamilySize.toFixed(2),
    });
  };
  
  //*************************************************** */

  // 处理国别的选择逻辑
  const handleCountrySelect = (e) => {
    const selected = e.target.value;
    if (selected === "all") {
      setSelectedCountry(countries.map(c => c.name));  // 选择"全选"
    } else {
      setSelectedCountry([selected]);  // 单一选择
    }
  };

  return (
    <div className="home-container">
      <h1>綜合</h1>
      <div className="section1">
        <label>
          國家名稱：
          <select
            value={selectedCountry}
            onChange={handleCountrySelect}
          >
            <option value="all">全選</option>
            <option value="">請選擇國家</option>
            {countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          年齡：
          <input
            type="number"
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
            placeholder="輸入年齡"
          />
        </label>

        <button onClick={calculateCountryAgeStats}>計算</button>
      </div>
        
      <div className="section2">
        <label>
          洲名稱：
          <select
            value={selectedContinent}
            onChange={(e) => setSelectedContinent(e.target.value)}
          >
            <option value="">請選擇洲</option>
            {["Asia", "Europe", "Africa", "North America", "South America", "Oceania"].map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select>
        </label>
          
        <button onClick={calculateContinentStats}>計算</button>
      </div>

      {/* 統計結果 */}
      <div className='result-section'>
        {statistics.totalEmployees !== undefined && (
          <div className="stats-result">
            <p>符合條件的總員工數：{statistics.totalEmployees}</p>
          </div>
        )}

        {statistics.totalEmployeesInContinent !== undefined && (
          <div className="stats-result">
            <p>該洲派遣的總員工數：{statistics.totalEmployeesInContinent}</p>
          </div>
        )}

        {statistics.averageFamilyAge !== undefined && (
          <div className="stats-result">
            <p>眷屬的平均年齡：{statistics.averageFamilyAge}</p>
            <p>平均眷屬人數：{statistics.averageFamilySize}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
