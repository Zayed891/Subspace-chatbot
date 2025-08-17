import React, { useState } from 'react'
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface MessageInputProps {
  onSendMessage: (content: string) => void
  isLoading: boolean
}

export default function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault()
      handleSubmit(e as any)
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = Math.min(element.scrollHeight, 120) + 'px'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    adjustTextareaHeight(e.target)
  }

  const characterCount = message.length
  const maxCharacters = 2000
  const isNearLimit = characterCount > maxCharacters * 0.8

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={`relative rounded-2xl border-2 transition-all duration-200 ${
          isFocused 
            ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
            : 'border-gray-200 dark:border-gray-700'
        } bg-gray-50 dark:bg-gray-800`}>
          <div className="flex items-end gap-3 p-4">
            {/* Attachment button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Attach file (coming soon)"
            >
              <PaperClipIcon className="h-5 w-5" />
            </motion.button>
            
            {/* Message input */}
            <div className="flex-1">
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Type your message... (Ctrl+Enter to send)"
                rows={1}
                disabled={isLoading}
                maxLength={maxCharacters}
                className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none resize-none disabled:opacity-50"
                style={{ minHeight: '24px', maxHeight: '120px' }}
              />
            </div>
            
            {/* Send button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!message.trim() || isLoading || characterCount > maxCharacters}
              className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Character counter and shortcuts */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-2">
          <div className="flex items-center space-x-4">
            <span>Press Ctrl+Enter to send</span>
            <span>Shift+Enter for new line</span>
          </div>
          <span className={`${isNearLimit ? 'text-orange-500' : ''} ${
            characterCount > maxCharacters ? 'text-red-500' : ''
          }`}>
            {characterCount}/{maxCharacters}
          </span>
        </div>
      </form>
    </div>
  )
}

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50"
            style={{ minHeight: '42px', maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px]"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  )
}