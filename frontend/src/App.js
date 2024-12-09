import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import EmployeePage from './pages/EmployeePage';
import CountryPage from './pages/CountryPage';
import AssignPage from './pages/AssignPage';
import DependentPage from './pages/DependentPage';


function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />

        <div style={{ marginLeft: '250px', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/country" element={<CountryPage />} />
            <Route path="/dependent" element={<DependentPage />} />
            <Route path="/assignment" element={<AssignPage />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
