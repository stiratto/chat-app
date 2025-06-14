import { useEffect, useState } from "react"
import Message from "./Message"
import { useUserContext } from "../context/UserContext"
import type { IMessage } from "../interfaces/IMessage"
import { useChatContext } from "../context/ChatContext"
import { useParams } from "react-router"

export default function() {
   const {id} = useParams()
   const [message, setMessage] = useState<string>("")
   const {userId, setUserId} = useUserContext()
   const {chats, setChats} = useChatContext()
   const [messages, setMessages] = useState<IMessage[]>([])
   const [webSocket, setWebSocket] = useState<WebSocket>()
   const [receiverUserId, setReceiverUserId] = useState<string>("")

   const fetchId = async () => {
      try {
         const alreadyHasId = localStorage.getItem("id")
         if (!alreadyHasId) {
            const response = await fetch("http://localhost:4000/getId")
            const data = await response.json()
            setUserId(data.id)
            window.location.reload()
         }
      }catch(err: any) {
         throw new Error(`Failed to fetch id: ${err.message}`)
      }
   }

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value)
   }

   const sendMessage = (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault()
      const newMessage: IMessage = {
         host: "host",
         message: message
      } 
      setMessages((prev) => [...prev, newMessage])
      
      const newSocketMessage = {
         userId: userId,
         message: message,
         to: receiverUserId
      }
      webSocket?.send(JSON.stringify(newSocketMessage))
      
      setMessage("")
   }


   const keyWasPressed = () => {
      console.log("user is chatting")
   }
   
   const startChat = () => {
      const ws = new WebSocket(`ws://localhost:4000?id=${userId}`)
      ws.onopen = () => {
         console.log("connection opened")
      }

     
      ws.onmessage = (ev) => {
         const newMessage = {
            host: "remote" as "remote",
            message: ev.data as string
         }
         setMessages(prev => [...prev, newMessage])
      }

      setWebSocket(ws)
   }


   const getReceiverId = (e: React.ChangeEvent<HTMLInputElement>) => {
      setReceiverUserId(e.target.value)
   }

   useEffect(() => {
      const debounce = setTimeout(async () => {
         const response = await fetch(`http://localhost:4000/checkId?id=${receiverUserId}`)
         if (response.status === 400) {
            console.log("id not found")
         }
         const data = await response.json()
         console.log(data)
      }, 300)

      return () => {
         clearTimeout(debounce)
      }
   }, [receiverUserId])

   useEffect(() => {
      document.querySelector(".message-input")?.addEventListener("keydown", keyWasPressed)
      fetchId() 

      startChat()
   }, [])

   return (
      <div className="p-8 w-full max-w-3xl h-96 text-white rounded-3xl flex flex-col bg-black shadow-xl relative">
         <h1>{id}</h1>
         <div className="messages-container gap-4 w-full max-w-3xl h-96 text-white rounded-3xl flex flex-col shadow-xl relative">
            {messages?.map((m) => (
               <Message host={m.host}>{m.message}</Message>
            ))}
         </div>

         <input 
            value={receiverUserId} 
            onChange={getReceiverId} 
            placeholder="Who will receive this message? (ID)" 
            className="text-lg outline-none rounded-t-3xl text-black bg-white px-4 py-2 absolute top-0 w-full self-center"></input>
         <form onSubmit={sendMessage} className="absolute bottom-0 self-center w-full">
            <input 
               value={message} 
               disabled={receiverUserId.length === 0}
               onChange={handleChange} 
               className="message-input bg-white text-black text-lg  w-full rounded-b-3xl rounded-br-none outline-none py-2 px-4">
            </input>
         </form>
      </div>
   )
}
