import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useUserData } from '@nhost/react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
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
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-sm"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        transform transition-transform duration-300 ease-in-out
        fixed md:relative z-40 h-full
      `}>
        <Sidebar
          chats={chats}
          selectedChatId={chatId || null}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Sidebar backdrop on mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea chatId={chatId || null} />
      </div>
    </div>
  )
}