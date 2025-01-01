import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Quiz from './pages/Quiz/Quiz';
import RegionSelection from './pages/RegionSelection/RegionSelection';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/region-selection" element={<RegionSelection />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
