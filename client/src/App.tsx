import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load tool routes
const Merge = lazy(() => import('./pages/Merge'));
const Split = lazy(() => import('./pages/Split'));
const Compress = lazy(() => import('./pages/Compress'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" richColors closeButton theme="system" />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Tool routes */}
            <Route path="/merge" element={<ProtectedRoute><Merge /></ProtectedRoute>} />
            <Route path="/split" element={<ProtectedRoute><Split /></ProtectedRoute>} />
            <Route path="/compress" element={<ProtectedRoute><Compress /></ProtectedRoute>} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
