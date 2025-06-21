import { createRoot } from 'react-dom/client'
import './index.css'
import { UserContextProvider } from './context/UserContext.tsx'
import { ChatContextProvider } from './context/ChatContext.tsx'
import { RouterProvider } from 'react-router'
import { router } from './router.tsx'
import { WebSocketContextProvider } from './context/WebSocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <UserContextProvider>
    <ChatContextProvider>
      <WebSocketContextProvider>
        <RouterProvider router={router} />
      </WebSocketContextProvider>
    </ChatContextProvider>
  </UserContextProvider>
)
