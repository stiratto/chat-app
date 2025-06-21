import { useEffect, useRef, useState, type FormEvent } from "react"
import { useChatContext } from "../context/ChatContext"
import type { IChat } from "../interfaces/IMessage"
import { useUserContext } from "../context/UserContext"
import { toast } from "sonner"

export function CreateNewChatModal({ onClose }: { onClose: () => void }) {
   const ref = useRef<HTMLDivElement>(null)
   const { chats, setChats } = useChatContext()
   const { user } = useUserContext()
   const [receiverId, setReceiverId] = useState<string>("")

   const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
         onClose()
      }
   }

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setReceiverId(e.target.value)
   }

   const onSubmit = async (e: FormEvent) => {
      e.preventDefault()

      const existsRemoteId = await fetch(`http://localhost:4000/checkId?id=${receiverId}`)
      const data = await existsRemoteId.json()
      if (!existsRemoteId.ok) {
         toast.error(data)
         return
      }

      const alreadyHasChat = chats?.find((chat) => chat.remoteId === receiverId)
      if (alreadyHasChat) {
         toast.error("You already have a chat with that id!")
         return
      }

      const newChat: IChat = {
         remoteId: receiverId,
         messages: [],
         id: user?.id!,
      }

      setChats((prev) => [...(prev || []), newChat])

      startChat(newChat)
   }


   const startChat = async (chat: IChat) => {
      const res = await fetch("http://localhost:4000/initiateChat", {
         method: 'POST',
         body: JSON.stringify(chat)
      })

      if (!res.ok) return

      const data = await res.json()
      console.log(data)
   }



   useEffect(() => {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
   }, [])

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
         <div ref={ref} className="bg-black text-white text-sm w-full max-w-xl flex flex-col items-center justify-center h-[50vh] gap-8">
            <form className="flex items-center gap-4" onSubmit={onSubmit}>
               <input placeholder="what's their id?" onChange={handleChange} className="border border-gray-600 px-4 outline-none"></input>
               <button className="border border-gray-600">create chat</button>
            </form>
         </div>
      </div>

   )
}
