import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import StudyActivities from './pages/StudyActivities';
import StudyActivityLaunch from './pages/StudyActivityLaunch';
import StudyActivityShow from './pages/StudyActivityShow';
import Words from './pages/Words';
import WordDetail from './pages/WordDetail';
import WordGroups from './pages/WordGroups';
import GroupDetail from './pages/GroupDetail';
import StudySessions from './pages/StudySessions';
import StudySessionDetail from './pages/StudySessionDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study-activities" element={<StudyActivities />} />
            <Route path="/study-activities/:id" element={<StudyActivityShow />} />
            <Route path="/study-activities/:id/launch" element={<StudyActivityLaunch />} />
            <Route path="/words" element={<Words />} />
            <Route path="/words/:id" element={<WordDetail />} />
            <Route path="/word-groups" element={<WordGroups />} />
            <Route path="/word-groups/:id" element={<GroupDetail />} />
            <Route path="/sessions" element={<StudySessions />} />
            <Route path="/sessions/:id" element={<StudySessionDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
