import { createContext, useContext, useEffect, useState } from "react";
import type { IChat } from "../interfaces/IMessage";
interface IChatContext {
   chats: IChat[] | null,
   setChats: React.Dispatch<React.SetStateAction<IChat[] | null>>
}

const ChatContext = createContext<IChatContext | null>(null)

export const useChatContext = () => {
   const context = useContext(ChatContext)
   if (!context) {
      throw new Error('useChatContext must be used within chatcontext')
   }
   return context 
}

export const ChatContextProvider = ({children}: {children: React.ReactNode}) => {
   const [chats, setChats] = useState<IChat[] | null>(() => {
      return JSON.parse(localStorage.getItem('messages')!)
   })

   useEffect(() => {
      localStorage.setItem('messages', JSON.stringify(chats)) 
   }, [chats])

   return (
      <ChatContext.Provider value={{chats, setChats}}>
         {children}
      </ChatContext.Provider>
   )
}
