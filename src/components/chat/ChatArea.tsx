import React, { useState } from 'react'
import { useMutation, useSubscription } from '@apollo/client'
import { useUserData } from '@nhost/react'
import { toast } from 'react-hot-toast'
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
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-medium mb-2">Welcome to AI Chatbot</h2>
          <p>Select a chat from the sidebar or create a new one to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}
