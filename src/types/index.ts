export interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  content: string
  is_user: boolean
  created_at: string
}

export interface SendMessageResponse {
  success: boolean
  message: string
  bot_response: string
}