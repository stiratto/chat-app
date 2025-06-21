export default function Message({ children, host }: { children: React.ReactNode, host: "remote" | "host" }) {
   return (
      host === "remote" ? (
         <div>
            <span className="text-xs text-[#ffdd33]">not you</span>
            <div className="remote-message bg-[#566168]  text-white shadow-lg rounded-xl w-max p-2 text-lg">
               {children}
            </div>
         </div>
      ) :
         <div className="self-end">
            <span className="text-xs text-[#ffdd33]">you</span>
            <div className="self-end bg-gray-500 p-2 text-lg rounded-xl host-message max-w-sm break-all">
               {children}
            </div>
         </div>


   )
}
