import {createPortal} from "react-dom"
import { CreateNewChatModal } from "./components/CreateNewChatModal"
import { useState } from "react"

function App() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const createNewChat = () => {
    setShowModal(!showModal)
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full p-8 gap-4">
      <h1 className="text-[#ffdd33] font-bold">you wanna chat?</h1>
      <button className="text-lg bg-black text-[#ffdd33] p-1 hover:cursor-pointer" 
        onClick={createNewChat}>Create new chat</button>
      {showModal && createPortal(<CreateNewChatModal onClose={() => setShowModal(!showModal)}/>, document.body)}
    </div>
  )
}

export default App
