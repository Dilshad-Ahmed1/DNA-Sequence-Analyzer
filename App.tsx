import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalysisToolPage from './pages/AnalysisToolPage';
import InfoPage from './pages/InfoPage';




function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisToolPage />} />
            <Route path="/info" element={<InfoPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;