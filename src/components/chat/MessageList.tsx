import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { Message } from '../../types'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }
  return (
    <div className="flex-1 relative">
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Send a message to begin chatting with your AI assistant. I'm here to help with any questions you have!
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.is_user ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`relative max-w-sm lg:max-w-md xl:max-w-lg ${
                    message.is_user ? 'ml-auto' : 'mr-auto'
                  }`}>
                    {/* Avatar for bot messages */}
                    {!message.is_user && (
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                          <span className="text-white text-sm">🤖</span>
                        </div>
                        <div className="flex-1">
                          <div className={message.is_user ? 'message-user' : 'message-bot'}>
                            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className={`text-xs ${
                                message.is_user ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                              <button
                                onClick={() => copyMessage(message.content, message.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                title="Copy message"
                              >
                                {copiedMessageId === message.id ? (
                                  <CheckIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <ClipboardDocumentIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* User messages */}
                    {message.is_user && (
                      <div className={message.is_user ? 'message-user' : 'message-bot'}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            message.is_user ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <button
                            onClick={() => copyMessage(message.content, message.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-blue-600"
                            title="Copy message"
                          >
                            {copiedMessageId === message.id ? (
                              <CheckIcon className="h-4 w-4 text-blue-100" />
                            ) : (
                              <ClipboardDocumentIcon className="h-4 w-4 text-blue-100" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mb-1">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-dot"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="message-bot">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}