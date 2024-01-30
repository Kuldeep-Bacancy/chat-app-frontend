import React, { useState } from 'react';
import { fetchChat } from '../services/chats';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import GroupSettingsModal from './GroupSettingsModal';

function ChatView({ chatId }) {
  if (!chatId) {
    return (
      <div className="flex flex-col bg-gray-400 w-2/3 p-2">
        <div className="text-center p-4 bg-yellow-200 rounded-lg w-full max-w-md">
          Click on a chat to start a conversation
        </div>
      </div>
    );
  }

  const userInfo = useSelector(state => state.authentication.userData)
  const [inputMessage, setInputMessage] = useState('');
  const [showModal, setShowModal] = useState(false)

  const chat = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChat(chatId)
  })

  const chatData = chat.data?.data?.data
  const groupUsers = chatData?.users.map((option) => { return { value: option?._id, label: option?.username, color: '#0052CC' } })

  // Sample static data for testing
  const chatName = chatData?.isGroupChat ? chatData?.name : chatData?.users.find((user) => user._id !== userInfo._id)?.username
  const staticMessages = [
    { content: 'Hello!', sender: userInfo._id },
    { content: 'Hi there!', sender: 'otherUser456' },
    { content: 'How are you?', sender: userInfo._id },
    // Add more static messages as needed
  ];

  const [messages, setMessages] = useState(staticMessages);

  const handleSendMessage = () => {
    // Implement your logic to send messages
    // You can add the sent message to the 'messages' state
    // Clear the input field after sending the message
    const newMessage = { content: inputMessage, sender: userInfo._id };
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  return (
    <div className='flex flex-col bg-gray-400 w-2/3 p-2'>
      <div className='flex items-center justify-between mb-2 bg-blue-500 p-2 rounded-md'>
        <h2 className='text-xl font-bold text-white'>{chatName}</h2>
        {
          chatData?.isGroupChat &&
          <button className='text-white hover:text-gray-200' onClick={() => setShowModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14 12 8" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
        }
        {
          showModal && <GroupSettingsModal setShowModal={setShowModal} groupId={chatData._id} groupUsers={groupUsers} />
        }
      </div>

      {/* Messages with selected person */}
      <div className='flex-grow mb-2'>
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start ${message.sender === userInfo._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`bg-${message.sender === userInfo._id ? 'blue' : 'gray'}-500 text-white p-2 rounded-md mb-1`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input for new messages */}
      <div className='flex gap-2 mx-2'>
        <input
          type='text'
          placeholder='Type your message here'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className='bg-white flex-grow border p-2'
        />
        <button onClick={handleSendMessage} className='bg-gray-500 p-2 text-white'>
          {/* Change the send icon or use your own */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatView;