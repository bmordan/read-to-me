import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ResponsiveHeader from './ResponsiveHeader';
import ReadToMePage from './pages/ReadToMePage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import { TranscriptProvider } from './context/TranscriptContext';

function App() {
  return (
    <TranscriptProvider>
      <Router>
        <ResponsiveHeader />
        <main className="px-5">
          <Routes>
            <Route path="/read-to-me" element={<ReadToMePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>Copyright 2026 Herosima</p>
        </footer>
      </Router>
    </TranscriptProvider>
  );
}

export default App;
