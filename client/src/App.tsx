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
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load tool routes
const Merge = lazy(() => import('./pages/Merge'));
const Split = lazy(() => import('./pages/Split'));
const Compress = lazy(() => import('./pages/Compress'));
const Repair = lazy(() => import('./pages/Repair'));
const ToImage = lazy(() => import('./pages/ToImage'));
const Protect = lazy(() => import('./pages/Protect'));
const ToWord = lazy(() => import('./pages/ToWord'));
const ToExcel = lazy(() => import('./pages/ToExcel'));

function App() {
  return (
    <Router>
      <ErrorBoundary>
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
              {/* Existing tool routes */}
              <Route path="/merge" element={<ProtectedRoute><Merge /></ProtectedRoute>} />
              <Route path="/split" element={<ProtectedRoute><Split /></ProtectedRoute>} />
              <Route path="/compress" element={<ProtectedRoute><Compress /></ProtectedRoute>} />

              {/* New tool routes */}
              <Route path="/repair" element={<ProtectedRoute><Repair /></ProtectedRoute>} />
              <Route path="/to-image" element={<ProtectedRoute><ToImage /></ProtectedRoute>} />
              <Route path="/protect" element={<ProtectedRoute><Protect /></ProtectedRoute>} />
              <Route path="/to-word" element={<ProtectedRoute><ToWord /></ProtectedRoute>} />
              <Route path="/to-excel" element={<ProtectedRoute><ToExcel /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
