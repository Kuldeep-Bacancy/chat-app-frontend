import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getCurrentUserChats } from '../services/chats';
import { useSelector } from 'react-redux';
import ChatView from './ChatView';

function Chat() {
  const { data: chatsData, isLoading, isError } = useQuery({
    queryKey: ['chats'],
    queryFn: getCurrentUserChats
  })

  const [selectedChat, setSelectedChat] = useState('');

  const userInfo = useSelector((state) => state.authentication.userData);

  return (
    <div className="flex h-screen">
      <div className="bg-gray-200 w-1/3 border-r border-gray-300">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Contacts</h2>
          {isLoading && <p>Loading...</p>}
          {isError && <p>Error loading chats</p>}
          {chatsData && (
            <ul>
              {
                chatsData.data.data.map((chat) => (
                <li
                  key={chat._id}
                  className={`mb-1 cursor-pointer border-b border-gray-300 py-2 px-4 ${selectedChat === chat._id ? 'bg-blue-200' : 'hover:bg-blue-100'
                    }`}
                  onClick={() => setSelectedChat(chat._id)}
                >
                  {chat.isGroupChat ? (
                    <span className="text-blue-500">{chat.name}</span>
                  ) : (
                    chat.users.find((user) => user._id !== userInfo._id)?.username
                  )}
                </li>
              ))
              }
            </ul>
          )}
        </div>
      </div>
      <ChatView chatId={selectedChat} />
    </div>
  );
}

export default Chat;
