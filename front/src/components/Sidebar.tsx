import { useRef } from "react"
import { NavLink as Link } from "react-router"
import { useChatContext } from "../context/ChatContext"
import { useUserContext } from "../context/UserContext"

export function Sidebar() {
   const id = useRef<HTMLParagraphElement>(null)
   const {chats} = useChatContext()
   const {userId} = useUserContext()
   const copy = () => {
      navigator.clipboard.writeText(userId as string)
   }
   return (
      <div className="absolute left-0 h-screen w-full max-w-sm bg-black text-white flex flex-col border-r border-[#ffdd33] max-h-screen overflow-y-scroll">
         <p ref={id} className="self-start text-xs hover:cursor-pointer" onClick={copy}>{userId}</p>
         {chats?.map((chat) => (
            <Link to={`/chat/${userId}`} className="text-sm border-t border-b border-gray-600 p-2 space-y-4">
               <h1 className="text-[#ffdd33]">his id: {chat.receiverId}</h1>
               <h1>your id: {chat.id}</h1>
               <p className="text-gray-600 truncate">{chat.messages[0] ? chat.messages[0].message : "\"this is the last message sent between him and u\""}</p>
            </Link>
         ))}
      </div>
   )
}
