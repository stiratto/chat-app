import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useUserContext } from "./UserContext";
import { useChatContext } from "./ChatContext";
import type { IChat, IMessage } from "../interfaces/IMessage";
import { toast } from "sonner";

interface TWebSocketContext {
   webSocket: WebSocket | null,
   setWebSocket: Dispatch<SetStateAction<WebSocket | null>>
}

const WebSocketContext = createContext<TWebSocketContext | null>(null)


export const useWebSocketContext = () => {
   const context = useContext(WebSocketContext)
   return context
}

export const WebSocketContextProvider = ({ children }: { children: ReactNode }) => {
   const [webSocket, setWebSocket] = useState<WebSocket | null>(null)
   const { user } = useUserContext()
   const { chats, setChats } = useChatContext()

   useEffect(() => {
      if (!user) return
      const { id } = user
      if (webSocket) return
      const socket = new WebSocket(`ws://localhost:4000/connect?userId=${id}`)
      setWebSocket(socket)

      socket.onmessage = (ev) => {
         const data = JSON.parse(ev.data)
         if (data.type === "new_chat") {
            console.log(data)
            const newChat: IChat = {
               remoteId: data.from,
               id: user.id,
               messages: []
            }
            console.log(newChat)
            setChats((prev) => prev ? [...prev, newChat] : [newChat])
         } else if (data.type === "new_message") {

            toast.success("New message")

            const newMessage: IMessage = {
               host: "remote",
               message: data.message
            }

            const foundChat = chats?.find((chat) => chat.remoteId === data.from)

            if (!foundChat) return

            // actualizar el chat que tiene esa id
            const newChats = chats?.map((chat) => {
               if (chat.remoteId === data.from) {
                  const updatedMessages = [...(chat.messages ?? []), { ...newMessage }]
                  return {
                     ...chat,
                     messages: updatedMessages
                  }

               }
               return chat
            })

            if (newChats) setChats(newChats)
         }
      }
   }, [user])

   return (
      <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>{children}</WebSocketContext.Provider>
   )
}
