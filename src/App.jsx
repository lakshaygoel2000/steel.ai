import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProjectForm from './components/project/ProjectForm';
import ChatInterface from './components/chatbot/ChatInterface';
import LoginPage from './components/auth/LoginPage';
import Header from './components/layout/Header';

export default function App() {
  const [projectParams, setProjectParams] = useState(null);

  // Enable v7_startTransition future flag
  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, v7_startTransition: true },
      ''
    );
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/model"
            element={
              <ProtectedRoute>
                {!projectParams ? (
                  <ProjectForm onSubmit={setProjectParams} />
                ) : (
                  <ChatInterface projectParams={projectParams} />
                )}
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
