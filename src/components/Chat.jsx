import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getCurrentUserChats } from '../services/chats';
import { useSelector } from 'react-redux';
import ChatView from './ChatView';
import LoadingList from './others/LoadingList';
import { FaCircle } from 'react-icons/fa';
import 'react-icons/fa';

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
          {isLoading && <LoadingList count={4}/>}
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
                      <span className="text-blue-500 flex items-center justify-between">{chat.name}</span>
                    ) : (
                      <>
                        <span className="flex items-center justify-between">
                          {chat.users.find((user) => user._id !== userInfo._id)?.username}
                          {chat.users.find((user) => user._id !== userInfo._id) && (
                            <FaCircle className="text-green-500 ml-2" />
                        )}
                        </span>
                      </>
                    )}
                    <span className="text-gray-500 text-sm">
                      {
                        chat.latestMessage && chat.isGroupChat ? `${chat.latestMessage.sender.username}: ${chat.latestMessage.content}` : chat.latestMessage?.content
                      }
                    </span>
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
