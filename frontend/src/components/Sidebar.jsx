import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css'; 

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>人員外派資訊系統</h2>
      <nav>
        <ul>
          <li><Link to="/">首頁</Link></li>
          <li><Link to="/employee">員工資料</Link></li>
          <li><Link to="/country">國家資料</Link></li>
          <li><Link to="/assignment">員工派駐資料</Link></li>   
          <li><Link to="/dependent">員工眷屬資料</Link></li>
        </ul> 
      </nav>
    </aside>
  );
};

export default Sidebar;
