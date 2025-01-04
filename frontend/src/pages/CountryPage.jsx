import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/country.css';

const CountryPage = () => {
  const [countries, setCountries] = useState([]);  // for stored table content
  //for search
  const [filteredCountries, setFilteredCountries] = useState([]); // 存儲過濾後的data
  const [searchQuery, setSearchQuery] = useState('');// 搜尋詞
  //for add
  const [showModal, setShowModal] = useState(false);  // 彈窗
  const [newCountry, setNewCountry] = useState({
    code: '',
    name: '',
    continent: '',
    headman: '',
    foreign_minister: '',
    contact_person: '',
    population: '',
    area: '',
    phone: '',
    is_ally: false,
    is_exit: true,
  });
  //for 統計
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState(''); // 選擇洲別
  const [selectedAllyStatus, setSelectedAllyStatus] = useState('all'); // 邦交國/非邦交國
  const [selectedCountries, setSelectedCountries] = useState([]); // 用于存储选择的国家
  const [availableCountries, setAvailableCountries] = useState([]);

  const [countryStatistics, setCountryStatistics] = useState({
    totalCountries: 0,
    totalPopulation: 0,
    totalAllies: 0,
    totalNonAllies: 0
  });
  const [popuStatistics, setPopuStatistics] = useState({
    totalCountries: 0,
    totalPopulation: 0
  });

  //加載時動作
  useEffect(() => {
    fetchCountries();
  }, []);

  //get resquset
  const fetchCountries = async () => {
    try {
      //分開 is_exit
      const response = await axios.get('http://localhost:3305/country'); 
      const activeDependents = response.data.filter(country => country.is_exit === true);
      const inactiveDependents = response.data.filter(country => country.is_exit === false);
      const sortedDependents = [...activeDependents, ...inactiveDependents];
      setCountries(sortedDependents); 
      setFilteredCountries(sortedDependents);  // 初始顯示ALL
    //   updateStatistics(response.data); 
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };
  
  //* 查詢處理 (只能輸入 code/name) ******************************
  const handleSearch = () => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = countries.filter(country => {
        return ( country.code.toLowerCase().includes(query)) || (country.name.toLowerCase().includes(query));     
      }); 
      console.log('filtered :', filtered );
      setFilteredCountries(filtered);  // 更新過濾後的資料
    } 
    else {
      setFilteredCountries(countries);  // 若搜尋框為空，顯示所有資料
    }
  };

  //* 新增處理 ***************************************************
  // 表單 前處裡 (輸入框改變時觸發)  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let valueToUse = value;
    // 對代碼進行處理，確保第二個字符為大寫
    if (name === 'code' && value.length > 1) {
      valueToUse = value[0].toUpperCase() + value[1].toUpperCase() + value.slice(2);
    }else if (name === 'phone') { //轉換資料型以符合格式
      valueToUse = value.replace(/\D/g, '');
     // valueToUse = `${valueToUse.slice(0, 3)}-${valueToUse.slice(3, 4)}-${valueToUse.slice(4, 7)}-${valueToUse.slice(7, 10)}-${valueToUse.slice(10)}`;

    } 
    else if (name === 'population' || name === 'area') {
      valueToUse = parseInt(value, 10);// 轉換為整數
    }
    //stored NewCountry[]
    setNewCountry({ 
      ...newCountry, 
      [name]: valueToUse 
    });
    };

  // 表單提交 NewCountry[]
  const handleSubmit = async (e) => {
    e.preventDefault();

    // // 檢查電話字數(輸入懬以限制)  
    if (newCountry.phone.length !== 14) {
      alert('電話格式錯誤！');
      return; // 停止表單提交
    }

    //check not null 
    if (!newCountry.code || !newCountry.name) {
      alert('格式錯誤！');
      return; // 停止提交
    }

    // 
    try {
      const response = await axios.post('http://localhost:3305/country', newCountry); //post 
      console.log('Country added:', response.data);

      setNewCountry({ //clear Madol content
        code: '',
        name: '',
        continent: '',
        headman: '',
        foreignMinister: '',
        contactPerson: '',
        population: '',
        area: '',
        phone: '',
        is_ally: false,
        is_exit: true,
      });
      setShowModal(false); //close madal
      fetchCountries(); // refrash data
    } catch (error) {
      console.error('Error adding country:', error);
      alert('伺服器錯誤，請檢查輸入資料格式是否正確！');
    }
  };
  
  
  // const isFormValid = () => {
  //   const { code, name, continent, headman, foreign_minister, contact_person, population, area, phone} = newCountry;
  //   return code && name && continent && headman && foreign_minister && contact_person && population && area && phone;
  // };

  // // 更新統計
  // const updateStatistics = (countries) => {
  //   const ally = countries.filter(country => country.is_ally);
  //   const nonAlly = countries.filter(country => !country.is_ally);
  //   setAllyCount(ally.length);
  //   setNonAllyCount(nonAlly.length);
  // };
  //* 統計計算處理*************************************************
  const handleCountriesStatistics = () => {
    let filtered = countries;
  
    // 根据所选洲进行过滤
    if (selectedContinent) {
      filtered = filtered.filter(country => country.continent === selectedContinent);
    }
  
    // 根据邦交国状态进行过滤
    if (selectedAllyStatus === 'ally') {
      filtered = filtered.filter(country => country.is_ally === true);
    } else if (selectedAllyStatus === 'non-ally') {
      filtered = filtered.filter(country => country.is_ally === false);
    }
  
    // 统计
    const totalCountries = filtered.length;
    const totalAllies = filtered.filter(country => country.is_ally === true).length;
    const totalNonAllies = filtered.filter(country => country.is_ally === false).length;
    
    // 设置统计结果
    setCountryStatistics({
      totalCountries,
      totalAllies,
      totalNonAllies,
    });
  };
  //更新符合条件的国家列表 for<select>
  const handleAllyStatusChange = (status) => {
    setSelectedAllyStatus(status);
  
    // 根据选择过滤国家列表
    if (status === 'ally') {
      setAvailableCountries(countries.filter(country => country.is_ally === true));
    } else if (status === 'non-ally') {
      setAvailableCountries(countries.filter(country => country.is_ally === false));
    } else {
      setAvailableCountries(countries); // 如果没有选择任何选项，显示所有国家
    }
  };

  const handlePopuStatistics = () => {
    let filtered = countries;
    
    // 根据邦交国状态进行过滤
    if (selectedAllyStatus === 'ally') {
      filtered = filtered.filter(country => country.is_ally === true);
    } else if (selectedAllyStatus === 'non-ally') {
      filtered = filtered.filter(country => country.is_ally === false);
    }
      
    // 根据所選國家 进行过滤
    if (selectedCountries.length > 0 && !selectedCountries.includes("all")) {
      filtered = filtered.filter(country => selectedCountries.includes(country.code));
    }
  
  
    // 统计
    const totalCountries = filtered.length;
     // 计算符合条件的总人口数
    const totalPopulation = filtered.reduce((acc, country) => acc + country.population, 0);
  
    // 设置统计结果
    setPopuStatistics({
      totalCountries,
      totalPopulation
    });
  };
  

  //* 顯示格式處理*************************************************
  // 電話格式化
  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, ''); //清除非數字字符
    
    //  3-1-3-3-4 格式
    let country = digits.slice(0, 3); //3
    let region = digits.slice(3, 4);  //1
    let area = digits.slice(4, 7);    //3 
    let local = digits.slice(7, 10);  //3 
    let line = digits.slice(10);      //other 
    if (digits.length === 14){
      return `${country}-${region}-${area}-${local}-${line}`;
    }
  };

  // 數字格式化(千位逗號)
  const formatNumber = (num) => {
    return new Intl.NumberFormat('zh-TW').format(num);
  };
   
  
  //**************************************************************
  return (
  <div className="container">
  <div className="country-container">
    <h2>國家資料</h2>

    {/* 搜索框 */}
    <div className="search-container">
      <input 
        type="text" 
        placeholder="輸入國家編號或名稱" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}  // 設置查詢值
      />
      <button onClick={handleSearch}>查詢</button>
    </div> 

    <div className="tool-container">
    {/* 新增*/}
    <div className="add-container">
      <button onClick={() => setShowModal(true)}>新增國家</button>
      {showModal && (
      <div className="modal-overlay" >
          <div className="modal-content">
          <h3>新增國家</h3>
            <label>
              代碼：
              <input
                type="text"
                name="code"
                maxLength="6"
                value={newCountry.code}
                onChange={handleInputChange}
              />
            </label>
            <label>
              名稱：
              <input
                type="text"
                name="name"
                maxLength="14"
                value={newCountry.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              所屬洲：
              <select
                type="text"
                name="continent"
                value={newCountry.continent}
                onChange={handleInputChange}
              >
                <option value="">選擇所屬洲</option>
                <option value="亞洲">亞洲</option>
                <option value="歐洲">歐洲</option>
                <option value="非洲">非洲</option>
                <option value="北美洲">北美洲</option>
                <option value="南美洲">南美洲</option>
                <option value="大洋洲">大洋洲</option>
              </select>
            </label>
            <label>
              元首：
              <input
                type="text"
                name="headman"
                maxLength="14"
                value={newCountry.headman}
                onChange={handleInputChange}
              />
            </label>
            <label>
              外交部長：
              <input
                type="text"
                name="foreign_minister"
                maxLength="14"
                value={newCountry.foreign_minister}
                onChange={handleInputChange}
              />
            </label>
            <label>
              聯絡人：
              <input
                type="text"
                name="contact_person"
                value={newCountry.contact_person}
                onChange={handleInputChange}
              />
            </label>
            <label>
              人口：
              <input
                type="text"
                name="population"
                maxLength="14" 
                placeholder="至多14位數"
                value={newCountry.population}
                onChange={handleInputChange}
              />
            </label>
            <label>
              面積：
              <input
                type="text"
                name="area"
                maxLength="14" 
                placeholder="至多14位數"
                value={newCountry.area}
                onChange={handleInputChange}
              />
            </label>
            <label>
              聯絡電話：
              <input
                type="text"
                name="phone"
                maxLength="18" // 限制最大長度
                placeholder="如: 019-1-123-123-1234"
                value={formatPhoneNumber(newCountry.phone)}
                onChange={handleInputChange}
              />
            </label>
            <label className="ally">
              邦交國：
              <input
                type="checkbox"
                name="is_ally"
                checked={newCountry.is_ally}
                onChange={(e) =>
                  setNewCountry({ ...newCountry, is_ally: e.target.checked })
                }
              />
            </label>

            <button className="cancel" onClick={(e) =>setShowModal(false)}>取消</button>
            <button className="confirm" onClick={handleSubmit} >確認</button>
            {/* <button className="confirm" onClick={handleSubmit} disabled={!isFormValid()}>確認</button> */}        
          </div>
        </div>
      )}
    </div>   

    {/* 統計 */}
    <div className="stats-container">
      <button onClick={() => {setShowStatsModal(true);handleCountriesStatistics();handlePopuStatistics();}}>統計</button>
      {showStatsModal && (
        <div className="modal-overlay">
        <div className="stats-modal-content">
          <span className="close" onClick={() =>setShowStatsModal(false)}>&times;</span>
          <h3>統計</h3>
          <div className="section1">
            <div className='filter'>
            <label>選擇洲：
              <select onChange={(e) => setSelectedContinent(e.target.value)} value={selectedContinent}>
                <option value="">所有洲</option>
                <option value="亞洲">亞洲</option>
                <option value="歐洲">歐洲</option>
                <option value="非洲">非洲</option>
                <option value="北美洲">北美洲</option>
                <option value="南美洲">南美洲</option>
                <option value="大洋洲">大洋洲</option>
              </select>
            </label>
            <button onClick={handleCountriesStatistics}>統計</button>
            </div>

            <div className="result">
              <p>總國家數：{countryStatistics.totalCountries}</p>
              <p>邦交國數：{countryStatistics.totalAllies}</p>
              <p>非邦交國數：{countryStatistics.totalNonAllies}</p>
            </div>
          </div>
          <hr/>
          <div className="section2">
          
          <div className='filter'>
            <label>選擇邦交國/非邦交國：
              <select onChange={(e) => handleAllyStatusChange(e.target.value)} value={selectedAllyStatus}>
                <option value="all">全選</option>
                <option value="ally">邦交國</option>
                <option value="non-ally">非邦交國</option>
              </select>
            </label>
            <label>選擇國家：
            <select  onChange={(e) => setSelectedCountries([...e.target.selectedOptions].map(option => option.value))}>
              <option key="all" value="all">全選</option>
              {availableCountries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            </label>

          <button onClick={handlePopuStatistics}>統 計</button>  
          </div>
          
          <div className="result">
            <p>符合條件的總人口數： {formatNumber(popuStatistics.totalPopulation)}</p>
          </div>


          </div>    
        </div>
        </div>
      )}
    </div>
    </div>
    {/* 資料表 */}
    <div className="table">
    <table id="countryTable">
      <thead>
      <tr>
        <th>代碼</th>
        <th>名稱</th>
        <th>所屬洲</th>
        <th>元首</th>
        <th>外交部長</th>
        <th>聯絡人</th>
        <th>領土面積</th>
        <th>人口數</th>
        <th>連絡電話</th>
        <th>邦交國</th>
        <th>狀態</th>
      </tr>
      </thead>
      <tbody>
        {filteredCountries.map((country,index)=>(
          <tr key={index} className={country.is_exit === false ? 'deleted' : ''}>
            <td>{country.code}</td>
            <td>{country.name}</td> 
            <td>{country.continent}</td>
            <td>{country.headman}</td>
            <td>{country.foreign_minister}</td>
            <td>{country.contact_person}</td>
            <td>{formatNumber(country.area)}</td>
            <td>{formatNumber(country.population)}</td> 
            <td>{formatPhoneNumber(country.phone)}</td>
            <td>{country.is_ally ? '是' : '否'}</td> 
            <td>{country.is_exit ? '正常' : '亡國'}</td> 
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </div>
  </div>
  );
}

export default CountryPage;
