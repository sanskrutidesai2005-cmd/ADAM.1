import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import SymptomChecker from './pages/SymptonChecker';
import MedicineTracker from './pages/MedicineTracker';
import History from './pages/History';
import EmergencyContacts from './pages/EmergencyContacts';
import AIChat from './pages/AIChat';
import Profile from './pages/Profile';
import ResultAnalysis from './pages/ResultAnalysis';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/symptoms" element={
          <Layout>
            <SymptomChecker />
          </Layout>
        } />
        <Route path="/medicines" element={
          <Layout>
            <MedicineTracker />
          </Layout>
        } />
        <Route path="/history" element={
          <Layout>
            <History />
          </Layout>
        } />
        <Route path="/chat" element={
          <Layout>
            <AIChat />
          </Layout>
        } />
        <Route path="/emergency" element={
          <Layout>
            <EmergencyContacts />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <Profile />
          </Layout>
        } />
        <Route path="/result/:id" element={
          <Layout>
            <ResultAnalysis />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
