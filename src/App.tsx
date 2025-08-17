import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { NhostProvider } from '@nhost/react'
import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { nhost } from './lib/nhost'
import { apolloClient } from './lib/apollo'
import AuthGuard from './components/auth/AuthGuard'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <ThemeProvider>
      <NhostProvider nhost={nhost}>
        <ApolloProvider client={apolloClient}>
          <Router>
            <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <AuthGuard>
                <Routes>
                  <Route path="/" element={<Navigate to="/chat" replace />} />
                  <Route path="/chat" element={<MainLayout />} />
                  <Route path="/chat/:chatId" element={<MainLayout />} />
                </Routes>
              </AuthGuard>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'dark:bg-gray-800 dark:text-white',
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </ApolloProvider>
      </NhostProvider>
    </ThemeProvider>
  )
}

export default App