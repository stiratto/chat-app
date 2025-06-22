import { toast } from "sonner";
import type { IChatContext } from "../context/ChatContext";
import type { TUserContext } from "../context/UserContext";
import type { IChat, IMessage } from "../interfaces/IMessage";

// para poder usar hooks, usamos el createHandlers(), como parametro
// le pasariamos un contexto que contendria todos los hooks que
// necesitaramos en algun caso, ya que no estamos en un componente, es
// mejor que pasar cada hook como parametro a cada handler()

// websocket data type (ev.data)
interface TData {
   type: string
   [key: string]: string
}

// function handler
export type Handler = (data: TData) => void;

// contexto de los handlers
interface HandlersContext {
   setChats: IChatContext['setChats'],
   chats: IChatContext['chats'],
   setUser: TUserContext['setUser'],
   user: TUserContext['user']
}

// Record<string, Handler> nos permite acceder al handler haciendo
// createHandlers(ctx)[data.type]
export const createHandlers = (ctx: HandlersContext): Record<string, Handler> => ({
   "new_chat": (data) => {
      const newChat: IChat = {
         remoteId: data.from,
         id: ctx.user?.id ?? "",
         messages: []
      }

      ctx.setChats((prev) => prev ? [...prev, newChat] : [newChat])
   },
   "new_message": (data) => {

      // creamos un nuevo mensaje 
      const newMessage: IMessage = {
         host: "remote",
         message: data.message
      }

      // encontramos el chat en el estado global que tenga el id del
      // host que envia el mensaje
      const foundChat = ctx.chats?.find((chat) => chat.remoteId === data.from)

      console.log(ctx.chats)

      // actualizar el chat que tiene esa id
      const newChats = ctx.chats?.map((chat) => {
         // si encontramos el chat que ocurrio el mensaje
         if (chat.remoteId === data.from) {
            // creamos array con los mensajes anteriores, le ponemos
            // el nuevo mensaje

            const updatedMessages = [...chat.messages, newMessage]

            const updatedChat = {
               ...chat,
               messages: updatedMessages
            }


            return updatedChat
         }
         return chat
      })
      //
      // ctx.setChats(prev =>
      //    prev.map(chat =>
      //       chat.remoteId === data.from
      //          ? { ...chat, messages: [...chat.messages, newMessage] }
      //          : chat
      //    )
      // )
      //

      if (newChats) {
         ctx.setChats(newChats)
         toast.success("New message")
      }


   }
})

