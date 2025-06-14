import { createContext, useContext, useEffect, useState } from "react";

interface ContextType {
   userId: string | null,
   setUserId: React.Dispatch<React.SetStateAction<string | null>>
}

const UserContext = createContext<ContextType>({} as ContextType)

export const useUserContext = () => {
   const c = useContext(UserContext)
   return c
}



export const UserContextProvider = ({children}: {children: React.ReactNode}) => {
   const [userId, setUserId] = useState<string | null>(() => {
      return localStorage.getItem("id")
   })

   // cuando id cambie (se haga setId desde un componente), guardar
   // esa id en el localStorage solo si no hay una id
   useEffect(() => {
      if (userId !== null && !localStorage.getItem("id")) {
         localStorage.setItem("id", userId)
      }

   }, [userId])

   return (
      <UserContext.Provider value={{userId, setUserId}}>
         {children}
      </UserContext.Provider>
   )
}
