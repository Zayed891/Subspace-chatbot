# AI Chatbot Application

A modern, production-ready React chatbot application built with Vite, Tailwind CSS, Nhost, and n8n integration.

## Features

- **Authentication**: Secure login/signup with Nhost
- **Real-time Messaging**: Live chat updates using GraphQL subscriptions
- **AI Integration**: Bot responses powered by n8n webhooks
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Chat Management**: Create, select, and manage multiple chat sessions
- **Security**: Row-level security (RLS) with JWT authentication

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4 with custom animations
- **Backend**: Nhost (PostgreSQL + Hasura GraphQL)
- **Authentication**: Nhost Auth
- **Real-time**: GraphQL Subscriptions
- **AI Integration**: n8n webhook via Hasura Actions
- **Routing**: React Router v6

## Quick Start

1. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update environment variables with your Nhost project details
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npx vite build
   npm run preview
   ```

## Database Schema

### Tables

**chats**
- `id` (UUID, Primary Key)
- `title` (Text, Default: 'New Chat')
- `user_id` (UUID, Foreign Key to auth.users)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**messages**
- `id` (UUID, Primary Key)
- `chat_id` (UUID, Foreign Key to chats.id)
- `content` (Text)
- `is_user` (Boolean, Default: true)
- `created_at` (Timestamp)

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own chats and messages
- JWT authentication required for all operations

## Hasura Action Configuration

**Action Name**: `sendMessage`

**Type Definition**:
```graphql
type Mutation {
  sendMessage(chat_id: uuid!, content: String!): SendMessageOutput
}

type SendMessageOutput {
  success: Boolean!
  message: String
  bot_response: String
}
```

**Webhook URL**: `https://zayed89.app.n8n.cloud/webhook-test/chatbot`

**Request Transform**:
```json
{
  "input": {
    "chat_id": "{{$body.input.chat_id}}", 
    "content": "{{$body.input.content}}"
  },
  "session_variables": "{{$body.session_variables}}"
}
```

## Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthGuard.tsx      # Route protection
│   │   └── LoginForm.tsx      # Authentication UI
│   ├── chat/
│   │   ├── ChatArea.tsx       # Main chat interface
│   │   ├── MessageList.tsx    # Message display
│   │   └── MessageInput.tsx   # Message composition
│   └── layout/
│       ├── MainLayout.tsx     # App layout wrapper
│       └── Sidebar.tsx        # Chat navigation
├── graphql/
│   └── operations.ts          # GraphQL queries/mutations
├── lib/
│   ├── nhost.ts              # Nhost client config
│   └── apollo.ts             # Apollo GraphQL client
├── types/
│   └── index.ts              # TypeScript interfaces
└── App.tsx                   # Root component
```

## Features

### Authentication
- Email/password signup and login
- Persistent sessions with JWT tokens
- Protected routes with AuthGuard

### Chat Functionality
- Create new chat sessions
- Real-time message updates via subscriptions
- Message history persistence
- Responsive chat bubbles with timestamps

### AI Integration
- Messages sent to n8n webhook via Hasura actions
- Bot responses automatically inserted into chat
- Loading states and error handling

### UI/UX
- Modern, clean interface design
- Smooth animations and transitions
- Mobile-responsive layout
- Loading spinners and toast notifications

## Testing Checklist

- [ ] User registration and login
- [ ] Protected route access
- [ ] Create new chat session
- [ ] Send user messages
- [ ] Receive bot responses
- [ ] Real-time message updates
- [ ] Mobile responsiveness
- [ ] Error handling and loading states

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_NHOST_SUBDOMAIN=your-nhost-subdomain
VITE_NHOST_REGION=your-nhost-region
VITE_HASURA_ENDPOINT=your-hasura-endpoint
```

## License

MIT License - see LICENSE file for details.