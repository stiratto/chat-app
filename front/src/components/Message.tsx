export default function Message ({children, host}: {children: React.ReactNode, host: "remote" | "host"}) {
   return (
         host === "remote" ? (
            <div className="remote-message bg-white text-black shadow-lg rounded-xl w-max p-2 text-lg">{children}</div>
         ) : 
            <div className="self-end bg-gray-500 p-2 text-lg rounded-xl host-message ">{children}</div>
         

   ) 
}
