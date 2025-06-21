import { createContext, useContext, useEffect, useState } from "react";

interface TUser {
   id: string
}

interface ContextType {
   user: TUser | null,
   setUser: React.Dispatch<React.SetStateAction<TUser | null>>,
}

const UserContext = createContext<ContextType>({} as ContextType)

export const useUserContext = () => {
   const c = useContext(UserContext)
   return c
}

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<TUser | null>(() => {
      return JSON.parse(localStorage.getItem("user")!)
   })

   const fetchId = async () => {
      const res = await fetch("http://localhost:4000/getId")

      if (!res.ok) {
         throw new Error("Couldn't fetch id")
      }
      const data = await res.json()

      return data.id
   }

   useEffect(() => {
      const getId = async () => {
         const id = await fetchId()
         const newUser = {
            id,
         }
         setUser(newUser)
         localStorage.setItem("user", JSON.stringify(newUser))
      }

      if (!user) {
         getId()
      }
   }, [])

   return (
      <UserContext.Provider value={{ user, setUser }}>
         {children}
      </UserContext.Provider>
   )
}
