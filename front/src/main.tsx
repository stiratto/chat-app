import { createRoot } from 'react-dom/client'
import './index.css'
import { UserContextProvider } from './context/UserContext.tsx'
import { ChatContextProvider } from './context/ChatContext.tsx'
import { RouterProvider } from 'react-router'
import { router } from './router.tsx'

createRoot(document.getElementById('root')!).render(
  <UserContextProvider>
    <ChatContextProvider>
      <RouterProvider router={router}/>
    </ChatContextProvider>
  </UserContextProvider>
)
