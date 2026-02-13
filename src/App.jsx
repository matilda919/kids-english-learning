import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChildProvider } from './contexts/ChildContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import AgeSelectionPage from './pages/age-selection/AgeSelectionPage';
import PlaygroundPage from './pages/playground/PlaygroundPage';
import LearnNewWordsPage from './pages/learn/LearnNewWordsPage';
import ReviewWordsPage from './pages/learn/ReviewWordsPage';
import CategoryLearnPage from './pages/learn/CategoryLearnPage';
import CategoryLearnStartPage from './pages/learn/CategoryLearnStartPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  const [selectedAge, setSelectedAge] = useState(null);

  useEffect(() => {
    // 检查本地存储是否有已选择的年龄
    const storedAge = localStorage.getItem('selectedAge');
    if (storedAge) {
      setSelectedAge(storedAge);
    }
  }, []);

  const handleAgeSelect = (ageLevel) => {
    setSelectedAge(ageLevel);
    localStorage.setItem('selectedAge', ageLevel);
    // 触发自定义事件让ChildContext更新
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AuthProvider>
      <ChildProvider>
        <Router>
          {/* 如果没有选择年龄，先显示年龄选择页面 */}
          {!selectedAge ? (
            <Routes>
              <Route path="/age-selection" element={<AgeSelectionPage onAgeSelect={handleAgeSelect} />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="*" element={<Navigate to="/age-selection" replace />} />
            </Routes>
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/age-selection" element={<Navigate to="/" replace />} />
                <Route path="/playground" element={<PlaygroundPage />} />
                <Route path="/learn" element={<Navigate to="/learn/new" replace />} />
                <Route path="/learn/new" element={<LearnNewWordsPage />} />
                <Route path="/learn/review" element={<ReviewWordsPage />} />
                <Route path="/learn/category/:categoryId" element={<CategoryLearnPage />} />
                <Route path="/learn/category/:categoryId/start" element={<CategoryLearnStartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          )}
        </Router>
      </ChildProvider>
    </AuthProvider>
  );
}

export default App;
