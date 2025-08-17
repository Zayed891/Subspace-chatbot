import React, { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/client'
import { useUserData } from '@nhost/react'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { Message } from '../../types'
import {
  INSERT_MESSAGE,
  SEND_MESSAGE_ACTION,
  SUBSCRIBE_TO_MESSAGES
} from '../../graphql/operations'

interface ChatAreaProps {
  chatId: string | null
}

export default function ChatArea({ chatId }: ChatAreaProps) {
  const user = useUserData()
  const [isLoading, setIsLoading] = useState(false)

  const [insertMessage] = useMutation(INSERT_MESSAGE)
  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION)

  const { data: messagesData } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
    skip: !chatId
  })

  const messages: Message[] = messagesData?.messages || []

  const handleSendMessage = async (content: string) => {
    if (!chatId) return

    setIsLoading(true)
    try {
      /* ➊ Insert the user’s message */
      await insertMessage({
        variables: { chatId, content, isUser: true }
      })

      /* ➋ Trigger the bot via Action → n8n */
      const { data } = await sendMessageAction({
        variables: { chat_id: chatId, content }
      })

      /* ➌ Check for errors but DO NOT insert the bot row here.
            n8n already wrote it, and the subscription will deliver it. */
      if (!data?.sendMessage?.success) {
        throw new Error(
          data?.sendMessage?.message || 'Failed to get bot response'
        )
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast.error(error.message || 'Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <SparklesIcon className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Welcome to AI Assistant
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
          >
            Your intelligent companion for conversations, questions, and creative tasks. 
            Select a chat from the sidebar or create a new one to get started.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Natural Conversations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Engage in natural, flowing conversations with advanced AI
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Creative Tasks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get help with writing, brainstorming, and creative projects
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Responses</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get quick, accurate answers to your questions and queries
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Online • Ready to help</p>
          </div>
        </div>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />

      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}
