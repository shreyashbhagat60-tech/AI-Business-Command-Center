import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SalesPrediction from './pages/SalesPrediction';
import ProfitPrediction from './pages/ProfitPrediction';
import CustomerChurn from './pages/CustomerChurn';
import CustomerSegmentation from './pages/CustomerSegmentation';
import AIAdvisor from './pages/AIAdvisor';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import apiService from './services/api';
import './App.css';

export const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await apiService.getHealth();
        setSystemHealth(health);
      } catch (err) {
        console.warn('Backend connection health check pending...', err.message);
      }
    };
    checkHealth();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Sidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            systemHealth={systemHealth}
          />

          <div className="main-wrapper">
            <Navbar
              setMobileOpen={setMobileOpen}
              systemHealth={systemHealth}
            />

            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/sales-prediction" element={<SalesPrediction />} />
              <Route path="/profit-prediction" element={<ProfitPrediction />} />
              <Route path="/customer-churn" element={<CustomerChurn />} />
              <Route path="/customer-segmentation" element={<CustomerSegmentation />} />
              <Route path="/ai-advisor" element={<AIAdvisor />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
