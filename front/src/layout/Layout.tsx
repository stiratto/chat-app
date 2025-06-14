import React from "react"
import { useUserContext } from "../context/UserContext"
import { Sidebar } from "../components/Sidebar"
import { Outlet } from "react-router"

export default function Layout() {
   const {userId} = useUserContext()
   
   return (
      <div className="">
         <span className="text-white bg-[#181818] text-xs absolute top-0">Your ID: {userId}</span>
         <Sidebar/>
         <div>
            <Outlet/>
         </div>
      </div>
   )
}
