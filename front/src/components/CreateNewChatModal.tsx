import { useEffect, useRef, useState, type FormEvent } from "react"
import { useChatContext } from "../context/ChatContext"
import type { IChat } from "../interfaces/IMessage"
import { useUserContext } from "../context/UserContext"

export function CreateNewChatModal({onClose}: {onClose: () => void}) {
   const ref = useRef<HTMLDivElement>(null)
   const {chats, setChats} = useChatContext()
   const {userId} = useUserContext()
   const [receiverId, setReceiverId] = useState<string>("")

   const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
         onClose()
      }
   }

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setReceiverId(e.target.value)
   }

   const onSubmit = (e: FormEvent) => {
      e.preventDefault()
      const newChat: IChat = {
         receiverId,
         messages: [],
         id: userId!,
      }
      setChats((prev) => [...(prev || []), newChat])
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
