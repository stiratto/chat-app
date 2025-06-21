import { useEffect, useRef, useState } from "react"

import Message from "./Message"
import { useUserContext } from "../context/UserContext"
import type { IMessage } from "../interfaces/IMessage"
import { useParams } from "react-router"
import { useWebSocketContext } from "../context/WebSocketContext"
import { useChatContext } from "../context/ChatContext"

export default function Chat() {
   const { id } = useParams()
   const [message, setMessage] = useState<string>("")
   const { user } = useUserContext()
   const { id: userId } = user!
   const { chats, setChats } = useChatContext()
   const [messages, setMessages] = useState<IMessage[]>([])
   const { webSocket } = useWebSocketContext()!
   const messagesContainerRef = useRef<HTMLDivElement>(null)


   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value)
   }

   const sendMessage = (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault()
      if (message.length === 0) return

      const newMessage: IMessage = {
         host: "host",
         message: message
      }

      setMessages((prev) => [...prev, newMessage])

      const newSocketMessage = {
         userId: userId,
         message: message,
         to: id
      }

      const currentChat = chats?.find((chat) => chat.remoteId === id)

      const newChats = chats?.map((chat) => {

         if (chat?.remoteId === currentChat?.remoteId) {
            return {
               ...chat,
               messages: [...chat.messages, newMessage]
            }
         }
         return chat
      })


      webSocket?.send(JSON.stringify(newSocketMessage))
      if (newChats) setChats(newChats)
      setMessage("")
   }


   useEffect(() => {
      const currentChat = chats?.find((chat) => chat.remoteId === id)
      setMessages(currentChat?.messages ?? [])
      if (messagesContainerRef && messagesContainerRef.current) {
         messagesContainerRef.current.scrollTop = messagesContainerRef.current?.scrollHeight
      }

   }, [chats])

   useEffect(() => {
      messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current.scrollHeight })
   }, [messages])

   return (
      <div className="w-full max-w-3xl h-96 text-white flex flex-col bg-[#242424] relative items-center justify-center shadow-4xl border border-[#3e4145] ">
         <div ref={messagesContainerRef} className="messages-container gap-4 w-full max-w-3xl min-h-full max-h-96 text-white flex flex-col shadow-xl relative overflow-y-scroll pb-24 pt-8 px-4 no-scrollbar">
            {messages?.map((m, i) => (
               <Message key={i} host={m.host}>{m.message}</Message>
            ))}
         </div>

         <form onSubmit={sendMessage} className="absolute bottom-0 self-center w-full">
            <input
               value={message}
               onChange={handleChange}
               placeholder="write something"
               className="message-input bg-[#242424] border-t-1 border-[#3e4145] text-white text-lg  w-full outline-none py-2 px-4 placeholder:text-sm">
            </input>
         </form>
      </div>
   )
}
