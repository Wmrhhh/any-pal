import { useState } from "react"
import { Search, CirclePlus } from 'lucide-react';
import { addConversation } from '../db/useChatDB'
import { useNavigate } from "react-router-dom";
// import useConversationActions from "../hooks/useConversationActions";

export default function SearchBox() {

  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const handleAdd = async () => {
    const id = await addConversation('DeepSeek')
    navigate(`/chat/${id}`)
  }

  return (
    <div className="flex items-center">
      <div
        className="flex w-65 h-8 dark:bg-[#3a3a3b] bg-[#fafafa] my-3 ml-4 rounded-md p-1 items-center"
      >
        <Search className="dark:text-[#757576] w-4 h-4" />
        <input
          type="text" value={searchValue}
          className=" dark:text-[#7b7b80] text-[15px] pl-1 w-full caret-[#19ac70]"
          placeholder="搜索"
          onChange={e => setSearchValue(e.target.value)}
        />
      </div >
      <div
        className="w-8 h-8 flex items-center justify-center mx-auto dark:hover:bg-[#3f3f40] hover:bg-[#dbdbdd] rounded-md"
        onClick={handleAdd}
      >
        <CirclePlus
          className="dark:text-[#cdcdce] text-[#282828] w-5 h-5"
        />
      </div>

    </div>

  )
}