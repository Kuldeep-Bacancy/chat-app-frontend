import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getCurrentUserChats } from '../services/chats';
import { useSelector } from 'react-redux';
import ChatView from './ChatView';


function Chat() {
  const chats = useQuery({
    queryKey: ['chats'],
    queryFn: getCurrentUserChats
  })

  const [selectedChat, setSelectedChat] = useState("")

  const userInfo = useSelector(state => state.authentication.userData)

  return (
    <div className='flex h-screen'>
      <div className='bg-gray-200 w-1/3'>
        {/* Contacts */}
        <div className='p-2 border-r border-gray-300'>
          <h2 className='text-xl font-semibold mb-2'>Contacts</h2>
          <ul>
            {chats?.data?.data?.data.map((chat) => (
              <li
                key={chat._id}
                className={`mb-1 cursor-pointer border-b border-gray-300 py-1 px-2 ${selectedChat === chat._id ? 'text-blue-500' : 'hover:text-blue-500'
                  }`}
                onClick={() => setSelectedChat(chat._id)}
              >
                {chat.isGroupChat ? chat.name : chat.users.find((user) => user._id !== userInfo._id)?.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ChatView chatId={selectedChat} />
    </div>
  );
}

export default Chat;