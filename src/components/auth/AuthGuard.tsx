import React from 'react'
import { useAuthenticationStatus } from '@nhost/react'
import { motion } from 'framer-motion'
import LoginForm from './LoginForm'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading AI Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your intelligent companion...
          </p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <>{children}</>
}