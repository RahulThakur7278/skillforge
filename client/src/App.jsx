import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SkillExplorer from './pages/SkillExplorer';
import CareerPaths from './pages/CareerPaths';
import SkillGap from './pages/SkillGap';
import LearningHub from './pages/LearningHub';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/explorer" element={<SkillExplorer />} />
        <Route path="/careers" element={<CareerPaths />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/learning" element={<LearningHub />} />
      </Routes>
    </BrowserRouter>
  );
}
