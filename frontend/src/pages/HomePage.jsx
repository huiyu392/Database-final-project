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

  // const calculateStats = () => {

  //   // 根据选定洲和国家筛选员工数据
  //   const filteredEmployeesByContinent = employees.filter((employee) => {
  //     return (
  //       (selectedContinent === "all" || 
  //         assignments.some((assignment) => assignment.e_id === employee.e_id && assignment.code === selectedContinent)) 
  //     );
  //   });

  //   const filteredEmployeesByCountry = filteredEmployeesByContinent.filter((employee) => {
  //     return selectedCountry === "all" || 
  //       assignments.some((assignment) => assignment.e_id === employee.e_id && assignment.code === selectedCountry);
  //   });

  //   // 1. 该州总员工数
  //   const totalEmployeesInContinent = filteredEmployeesByContinent.length;

  //   // 2. 该州该国总员工数
  //   const totalEmployeesInCountry = filteredEmployeesByCountry.length;

  //   // 3. 符合年齡條件的員工数
  //   const ageFilteredEmployees = filteredEmployeesByCountry.filter((employee) => {
  //     const employeeAge = new Date().getFullYear() - new Date(employee.birth).getFullYear();
  //     if (ageInput === "") {return ageInput === ""}  
  //     // ||  parseInt(employeeAge) >= parseInt(ageInput);
  //   });
    
  //   // 4. 眷屬信息处理
  //   const dependentAges = dependents.filter((dependent) => 
  //     ageFilteredEmployees.some((employee) => employee.e_id === dependent.e_id)
  //   );

  //   // 计算眷属的平均年齡与平均眷属人数
  //   const totalDependentAge = dependentAges.reduce((sum, dependent) => {
  //     const dependentAge = new Date().getFullYear() - new Date(dependent.birth).getFullYear();
  //     return sum + dependentAge;
  //   }, 0);

  //   const averageFamilyAge = dependentAges.length > 0 ? totalDependentAge / dependentAges.length : 0;
    
  //   const totalFamilySize = dependents.filter((dependent) => 
  //     ageFilteredEmployees.some((employee) => employee.e_id === dependent.e_id)
  //   ).length;

  //   const averageFamilySize = ageFilteredEmployees.length > 0 ? totalFamilySize / ageFilteredEmployees.length : 0;

  //   // 更新统计数据
  //   setStatistics({
  //     totalEmployeesInContinent,
  //     totalEmployeesInCountry,
  //     ageFilteredEmployeeCount: ageFilteredEmployees.length,
  //     averageFamilyAge,
  //     averageFamilySize,
  //   });
  // };
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
              //setSelectedCountry("all"); // 當選擇洲時重置國家選擇
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
        {/* <p>該洲總員工數：{statistics.totalEmployeesInContinent}</p>
        <p>該洲該國總員工數：{statistics.totalEmployeesInCountry}</p> */}
        <p>符合年齡條件的員工數：{statistics.ageFilteredEmployeeCount}</p>
        <p>平均眷屬年齡：{statistics.averageFamilyAge}</p>
        <p>平均眷屬人數：{statistics.averageFamilySize}</p>
      </div>
    </div>
  );
};

export default HomePage;
