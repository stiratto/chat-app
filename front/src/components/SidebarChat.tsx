import { NavLink as Link } from "react-router"
import type { IChat } from "../interfaces/IMessage"

export const SidebarChat = ({ chat, userId }: { chat: IChat, userId: string }) => {
   return (
      <Link to={`/chat/${chat.remoteId}`} className="text-sm border-t border-b border-gray-600 p-2 space-y-4">
         <h1 className="text-[#ffdd33]">his id: {chat.remoteId}</h1>
         <h1>your id: {chat.id}</h1>
         <p className="text-gray-600 truncate">{chat.messages[0] ? chat.messages[0].message : "\"this is the last message sent between him and u\""}</p>
      </Link>
   )
}
