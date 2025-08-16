import { gql } from '@apollo/client'

export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      content
      is_user
      created_at
    }
  }
`

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      updated_at
    }
  }
`

export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chatId: uuid!, $content: String!, $isUser: Boolean = true) {
    insert_messages_one(object: {
      chat_id: $chatId, 
      content: $content, 
      is_user: $isUser
    }) { 
      id 
      content 
      is_user 
      created_at 
    }
  }
`

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content) {
      success
      message
      bot_response
    }
  }
`

export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      content
      is_user
      created_at
    }
  }
`