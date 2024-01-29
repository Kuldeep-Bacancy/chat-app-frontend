import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getCurrentUserChats } from '../services/chats';
import { useSelector } from 'react-redux';


function Chat() {
  const chats = useQuery({
    queryKey: ['chats'],
    queryFn: getCurrentUserChats
  })

  const userInfo = useSelector(state => state.authentication.userData)

  return (
    <div className='flex h-screen'>
      <div className='bg-gray-200 w-1/3'>
        {/* Contacts */}
        <div className='p-2 border-r border-gray-300'>
          <h2 className='text-xl font-semibold mb-2'>Contacts</h2>
          <ul>
            {chats?.data?.data?.data.map(chat => (
              <li key={chat._id} className='mb-1 cursor-pointer hover:text-blue-500 border-b border-gray-300 py-1 px-2'>
                {chat.isGroupChat ? chat.name : chat.users.find((user) => user._id != userInfo._id )?.username }
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='flex flex-col bg-gray-400 w-2/3 p-2'>
        <div className='flex-grow'>
          {/* Messages with selected person */}
          {/* Static chat messages go here */}
        </div>
        <div className='flex gap-2 mx-2'>
          <input
            type='text'
            placeholder='Type your message here'
            className='bg-white flex-grow border p-2'
          />
          <button className='bg-gray-500 p-2 text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;