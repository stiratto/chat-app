import { createContext, useContext, useEffect, useState } from "react";
import type { IChat } from "../interfaces/IMessage";

export interface IChatContext {
   chats: IChat[],
   setChats: React.Dispatch<React.SetStateAction<IChat[]>>
}

const ChatContext = createContext<IChatContext | null>(null)

export const useChatContext = () => {
   const context = useContext(ChatContext)
   if (!context) {
      throw new Error('useChatContext must be used within chatcontext')
   }
   return context
}

export const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [chats, setChats] = useState<IChat[]>(() => {
      try {
         const stored = localStorage.getItem('messages')
         console.log(stored)
         return JSON.parse(stored!) ?? []
      } catch (err) {
         return []
      }
   })

   useEffect(() => {
      console.log("new chats:", chats)
      localStorage.setItem('messages', JSON.stringify(chats))
   }, [chats])

   return (
      <ChatContext.Provider value={{ chats, setChats }}>
         {children}
      </ChatContext.Provider>
   )
}
