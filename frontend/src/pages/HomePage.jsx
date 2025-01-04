import React, { useState, useEffect } from 'react';
import axios from 'axios';

import '../styles/home.css';

const HomePage = () => {
  const [assignments, setAssignments] = useState([]); 
  const [employees, setEmployees] = useState([]); 
  const [countries, setCountries] = useState([]); 
  const [dependents, setDependents] = useState([]);  

  const [selectedContinent, setSelectedContinent] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [ageInput, setAgeInput] = useState("");  // 年齡輸入框

  const [statistics, setStatistics] = useState({
    totalEmployeesInContinent: 0,
    totalEmployeesInCountry: 0,
    ageFilteredEmployeeCount: 0,
    averageFamilyAge: 0,
    averageFamilySize: 0,
  });

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

 // 计算统计数据
 const calculateStats = () => {

  let filteredEmployees = employees.filter((employee) => {
    // 过滤员工：洲、国家、年齡
    const isContinentMatch = selectedContinent === "all" || employee.continent === selectedContinent;
    const isCountryMatch = selectedCountry === "all" || employee.country === selectedCountry;
    const isAgeMatch = (ageInput ? parseInt(calculateAge(employee.birth)) >= parseInt(ageInput) : true);
    return isContinentMatch && isCountryMatch && isAgeMatch;
  });

  const totalEmployees = filteredEmployees.length;

  // 获取所有符合条件员工的眷属
  const filteredDependents = dependents.filter((dependent) => 
    filteredEmployees.some(employee => employee.e_id === dependent.e_id)
  );

  // 计算眷属的平均年龄和平均家庭人数
  const totalFamilyAge = filteredDependents.reduce((acc, dep) => {
    const age = calculateAge(dep.birth);
    return acc + age;
  }, 0);

  const averageFamilyAge = totalFamilyAge / filteredDependents.length || 0;
  const averageFamilySize = filteredDependents.length / totalEmployees || 0;

  setStatistics({
    totalEmployeesInContinent: totalEmployees,
    totalEmployeesInCountry: filteredEmployees.length,
    ageFilteredEmployeeCount: totalEmployees,
    averageFamilyAge: averageFamilyAge.toFixed(2),
    averageFamilySize: averageFamilySize.toFixed(2),
  });
};

// 计算年龄
const calculateAge = (birthDate) => {
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};
  return (
    <div className="home-container">
      <h1>綜合資料統計</h1>
      <div className="filter">
        <label>
          洲名稱：
          <select
            value={selectedContinent}
            onChange={(e) => {
              setSelectedContinent(e.target.value);
            }}
          >
            <option value="all">全選</option>
            {["亞洲", "歐洲", "非洲", "北美洲", "南美洲", "大洋洲"].map((continent) => (
              <option key={continent} value={continent}>
                {continent}
              </option>
            ))}
          </select>
        </label>

        <label>
          國家名稱：
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="all">全選</option>
            {countries
              .filter(
                (country) =>
                  selectedContinent === "all" || country.continent === selectedContinent
              )
              .map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
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

        <button onClick={calculateStats}>統計</button>
      </div>

      <div className="result">
        <h2>統計結果</h2>
        <p>符合年齡條件的員工數：{statistics.ageFilteredEmployeeCount}</p>
        <p>平均眷屬年齡：{statistics.averageFamilyAge}</p>
        <p>平均眷屬人數：{statistics.averageFamilySize}</p>
      </div>
    </div>
  );
};

export default HomePage;
