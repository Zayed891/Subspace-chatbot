import React from 'react'
import { PlusIcon, ChatBubbleLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useSignOut, useUserData } from '@nhost/react'
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

  return (
    <div className="w-64 bg-sidebar-bg border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {chats.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
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