import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useUserContext } from "./UserContext";
import { useChatContext } from "./ChatContext";
import { createHandlers, type Handler } from "../lib/socketEventHandler";

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
   const { user, setUser } = useUserContext()
   const { chats, setChats } = useChatContext()
   const handlers = useRef<Record<string, Handler>>({})

   useEffect(() => {
      const handlersCreated = createHandlers({ setChats, chats, setUser, user })
      handlers.current = handlersCreated
   }, [chats, user])

   useEffect(() => {
      if (!user) return
      const { id } = user
      if (webSocket) return
      const SOCKET_API_URL = import.meta.env.VITE_SOCKET_API_URL

      const socket = new WebSocket(`${SOCKET_API_URL}/connect?userId=${id}`)
      setWebSocket(socket)

      // we can use useRef() (it has the most recent value no matter
      // what, doesn't relies on re-renders)
      // or use the context directly but state getters would be
      // obsolete always, just setters would be useful if we pass the
      // context manually to the createHandlers in this useEffect,
      // this is because we would be instantiating createHandlers in
      // the moment this effects runs, the getters would have the data
      // of this moment, like a snapshot of this and only moment, so
      // it's just better to use useRef()
      //

      socket.onmessage = (ev) => {
         const data = JSON.parse(ev.data)
         const { current: executeHandler } = handlers
         const handler = executeHandler[data.type]
         handler(data)
      }


   }, [user])

   return (
      <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>{children}</WebSocketContext.Provider>
   )
}
