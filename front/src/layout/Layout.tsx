import { useUserContext } from "../context/UserContext"
import { Sidebar } from "../components/Sidebar"
import { Outlet } from "react-router"
import { toast, Toaster } from "sonner"
import { Dot } from "lucide-react"
import { useRef } from "react"

export default function Layout() {
   const { user } = useUserContext()
   const { id } = user!

   const idRef = useRef<HTMLSpanElement>(null)

   const copy = () => {
      navigator.clipboard.writeText(idRef.current?.innerText as string)
      toast.success("ID copied")
   }


   return (
      <>
         <Toaster
            icons={{
               success: null,
               warning: null,
               info: null,
               error: null,
            }}

            toastOptions={{
               style: {
                  background: 'black',
                  color: '#ffdd33',
                  borderColor: "#ffdd33",
                  borderRadius: "0"
               }
            }}
         />

         <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] min-h-screen">
            <Sidebar />
            <div className="flex flex-col justify-center items-center relative">
               <p
                  className="absolute top-0 w-full text-white bg-black/50 flex items-center text-sm cursor-pointer"
                  onClick={copy}

               >
                  <Dot />
                  <span>Your id: <span ref={idRef}>{id}</span></span>
               </p>

               <Outlet />
            </div>
         </div>

      </>
   )
}
