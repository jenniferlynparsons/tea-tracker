import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeaProvider } from './contexts/TeaContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import TeaListPage from './pages/TeaListPage';
import TeaDetailPage from './pages/TeaDetailPage';
import AddTeaPage from './pages/AddTeaPage';
import EditTeaPage from './pages/EditTeaPage';
import Navbar from './components/Navigation/Navbar';
import HomePage from './pages/HomePage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <PreferencesProvider>
        <TeaProvider>
          <Router basename="/tea-tracker">
            <div className="App">
              <Navbar />
              <main>
                <Suspense fallback={<div className="loading">Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/collection" element={<TeaListPage />} />
                    <Route path="/tea/new" element={<AddTeaPage />} />
                    <Route path="/tea/:id" element={<TeaDetailPage />} />
                    <Route path="/tea/:id/edit" element={<EditTeaPage />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
          </Router>
        </TeaProvider>
      </PreferencesProvider>
    </ErrorBoundary>
  );
}

export default App;
