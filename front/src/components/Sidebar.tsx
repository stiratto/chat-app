import { useChatContext } from "../context/ChatContext"
import { useUserContext } from "../context/UserContext"
import { SidebarChat } from "./SidebarChat"

export function Sidebar() {
   const { chats } = useChatContext()
   const { user } = useUserContext()

   const { id: userId } = user!

   return (
      <aside className="min-h-screen w-full max-w-sm bg-black text-white flex-col border-r border-[#ffdd33] max-h-screen overflow-y-scroll hidden xl:flex ">
         {chats?.map((chat) => (
            <SidebarChat chat={chat} userId={userId} />
         ))}
      </aside>
   )
}
