import React from 'react'
import { 
  PlusIcon, 
  ChatBubbleLeftIcon, 
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useSignOut, useUserData } from '@nhost/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Chat } from '../../types'

interface SidebarProps {
  chats: Chat[]
  selectedChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
}

export default function Sidebar({ chats, selectedChatId, onSelectChat, onNewChat }: SidebarProps) {
  const { signOut } = useSignOut()
  const user = useUserData()
  const { isDark, toggleTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full shadow-lg transition-colors duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chats</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? (
              <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          New Chat
        </motion.button>
        
        {/* Search */}
        <div className="relative mt-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center">
            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No chats found' : 'No chats yet. Start a new conversation!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative group cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                    selectedChatId === chat.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                  onMouseEnter={() => setHoveredChatId(chat.id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedChatId === chat.id ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {chat.title}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                          {formatTimestamp(chat.updated_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        Last message preview...
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete button on hover */}
                  <AnimatePresence>
                    {hoveredChatId === chat.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement delete functionality
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 transition-colors">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Sign out"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`sidebar-item flex items-center gap-3 ${
                  selectedChatId === chat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Sign out"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}