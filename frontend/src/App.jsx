import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import VisualizationPage from './pages/VisualizationPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assess" element={<AssessmentPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/visualize" element={<VisualizationPage />} />
      </Routes>
    </div>
  );
}

export default App;