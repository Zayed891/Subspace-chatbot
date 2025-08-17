import React, { useState } from 'react'
import {
  useSignInEmailPassword,
  useSignUpEmailPassword
} from '@nhost/react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const {
    signInEmailPassword,
    isLoading: isSigningIn
  } = useSignInEmailPassword()

  const {
    signUpEmailPassword,
    isLoading: isSigningUp
  } = useSignUpEmailPassword()

  const [formError, setFormError] = useState<string | null>(null)

  const isLoading = isSigningIn || isSigningUp

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (isSignUp) {
      const { error } = await signUpEmailPassword(email, password)
      if (!error) {
        toast.success(
          'Account created! Check your inbox (or spam) to verify your email.'
        )
        setTimeout(() => {
          setIsSignUp(false)           // or navigate('/login')
        }, 5000)
      } else {
        setFormError(error.message)
      }
    } else {
      const { error } = await signInEmailPassword(email, password)
      if (error) {
        // ↙ Detect “user not found”
        if (error.message === 'invalid-username-password') {
          const msg = 'No account found. Please sign up first.'
          toast.error(msg)
          setFormError(msg)
        } else {
          setFormError(error.message)
        }
      }
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
          {/* Email */}
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email address"
            className="appearance-none rounded-xl block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password + eye toggle */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              placeholder="Password"
              className="mt-4 rounded-xl block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Inline error */}
          {formError && (
            <div className="text-red-600 text-sm text-center">{formError}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : isSignUp ? (
              'Sign up'
            ) : (
              'Sign in'
            )}
          </button>

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

