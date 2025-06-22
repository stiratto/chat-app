import { createContext, useContext, useEffect, useState } from "react";

interface TUser {
   id: string
}

export interface TUserContext {
   user: TUser | null,
   setUser: React.Dispatch<React.SetStateAction<TUser | null>>,
}

const UserContext = createContext<TUserContext>({} as TUserContext)

export const useUserContext = () => {
   const c = useContext(UserContext)
   return c
}

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
   const HTTP_API_URL = import.meta.env.VITE_HTTP_API_URL
   const fetchId = async () => {

      const res = await fetch(`${HTTP_API_URL}/getId`)

      if (!res.ok) {
         throw new Error("Couldn't fetch id")
      }
      const data = await res.json()

      return data.id
   }

   const [user, setUser] = useState<TUser | null>(() => {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
   })

   useEffect(() => {
      const stored = localStorage.getItem("user")

      if (!stored) {
         const getId = async () => {
            const id = await fetchId()
            const newUser = {
               id,
            }
            setUser(newUser)
            localStorage.setItem("user", JSON.stringify(newUser))
         }
         getId()
      }

   }, [])

   return (
      <UserContext.Provider value={{ user, setUser }}>
         {children}
      </UserContext.Provider>
   )
}
