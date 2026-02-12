import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ConnectPage from './pages/ConnectPage';
import { useAuth } from './hooks/useAuth';
import './index.css';

function App() {
  // Initialize auth state listener
  useAuth();

  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-body)' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connect"
            element={
              <ProtectedRoute>
                <ConnectPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
