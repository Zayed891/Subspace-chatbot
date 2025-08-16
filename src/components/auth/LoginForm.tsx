import React, { useState } from 'react'
import {
  useSignInEmailPassword,
  useSignUpEmailPassword
} from '@nhost/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'                    // ← NEW
import { useNavigate } from 'react-router-dom'            // ← NEW

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()                          // ← NEW

  const {
    signInEmailPassword,
    isLoading: isSigningIn,
    error: signInError
  } = useSignInEmailPassword()

  const {
    signUpEmailPassword,
    isLoading: isSigningUp,
    error: signUpError
  } = useSignUpEmailPassword()

  const isLoading = isSigningIn || isSigningUp
  const error = signInError || signUpError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignUp) {
      const { error } = await signUpEmailPassword(email, password)
      if (!error) {
        // ① Notify the user
        toast.success(
          'Account created! Check your inbox (or spam) to verify your email.'
        )

        // ② Switch to sign-in after 5 s
        setTimeout(() => {
          setIsSignUp(false)           // stay on same page
          // navigate('/login')        // ← use this instead if you have a /login route
        }, 5000)
      }
    } else {
      await signInEmailPassword(email, password)
    }
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your AI chatbot assistant
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px">
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative mt-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="rounded-xl relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error.message}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : isSignUp ? (
                'Sign up'
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-500 text-sm"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
