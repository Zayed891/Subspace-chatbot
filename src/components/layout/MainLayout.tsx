import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useUserData } from '@nhost/react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import ChatArea from '../chat/ChatArea'
import { Chat } from '../../types'
import { GET_CHATS, CREATE_CHAT } from '../../graphql/operations'

export default function MainLayout() {
  const navigate = useNavigate()
  const { chatId } = useParams<{ chatId?: string }>()
  const user = useUserData()

  const { data: chatsData, loading: chatsLoading, refetch: refetchChats } = useQuery(GET_CHATS)
  const [createChat] = useMutation(CREATE_CHAT)

  const chats: Chat[] = chatsData?.chats || []

  const handleSelectChat = (chatId: string) => {
    navigate(`/chat/${chatId}`)
    setIsSidebarOpen(false) // Close sidebar on mobile after selection
  }

  const handleNewChat = async () => {
    try {
      const { data } = await createChat({
        variables: {
          title: 'New Chat'
        }
      })

      if (data?.insert_chats_one) {
        const newChatId = data.insert_chats_one.id
        await refetchChats()
        navigate(`/chat/${newChatId}`)
        toast.success('New chat created!')
        setIsSidebarOpen(false) // Close sidebar on mobile after creation
      }
    } catch (error: any) {
      console.error('Error creating chat:', error)
      toast.error('Failed to create new chat')
    }
  }

  // Responsive layout
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (chatsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your chats...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed lg:relative z-40 h-full"
            >
              <Sidebar
                chats={chats}
                selectedChatId={chatId || null}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
              />
            </motion.div>
            
            {/* Mobile backdrop */}
            {window.innerWidth < 1024 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea chatId={chatId || null} />
      </div>
    </div>
  )
}