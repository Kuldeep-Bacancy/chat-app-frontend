import React, { useEffect, useState } from 'react';
import { fetchChat } from '../services/chats';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import GroupSettingsModal from './GroupSettingsModal';
import { createMessage, getMessages } from '../services/messages';
import { useForm } from 'react-hook-form';
import io from "socket.io-client"

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
  const socket = io(import.meta.env.VITE_SOCKET_URL, { transports: ['websocket', 'polling', 'flashsocket'] })

  const queryClient = useQueryClient()

  useEffect(() => {
    socket.emit("join-chat", chatId)

    return () => {
      socket.disconnect();
    }
  }, [chatId])


  useEffect(() => {
    socket.on('message-received', (newMessage) => {
      if (chatId != newMessage?.chat?._id) return
      queryClient.invalidateQueries({
        queryKey: ['messages', chatId],
      });
    })
  }, [chatId])

  const userInfo = useSelector((state) => state.authentication.userData);
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const chat = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChat(chatId),
    enabled: !!chatId
  });

  const messages = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId),
    enabled: !!chatId
  });

  const sendMessageHandler = async (data) => {
    try {
      const res = await createMessage(data);
      socket.emit("new-message", res?.data?.data)
      reset();
    } catch (error) {
      console.log('error', error.response);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', chatId],
      });
    },
  });

  const sendMessageSubmitHandler = (data) => {
    sendMessageMutation.mutate({ ...data, chatId: chatId });
  };

  const chatData = chat.data?.data?.data;
  const groupUsers = chatData?.users?.map((option) => ({
    value: option?._id,
    label: option?.username,
    color: '#0052CC',
  }));
  const chatName = chatData?.isGroupChat ? chatData?.name : chatData?.users?.find((user) => user._id !== userInfo._id)?.username;

  return (
    <div className="flex flex-col bg-gray-400 w-2/3 p-2">
      <div className="flex items-center justify-between mb-2 bg-blue-500 p-2 rounded-md">
        <h2 className="text-xl font-bold text-white">{chatName}</h2>
        {chatData?.isGroupChat && (
          <button className="text-white hover:text-gray-200" onClick={() => setShowModal(true)}>
            <svg xmlns="http://www.w3.org/2000/s/*-/*//-/-/-/-/-/-*//*/-*/-*/-*/vg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14 12 8" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
        )}
        {showModal && <GroupSettingsModal setShowModal={setShowModal} groupId={chatData._id} groupUsers={groupUsers} />}
      </div>

      {/* Messages with selected person */}
      <div className="flex-grow mb-2">
        {messages?.data?.data?.data.map((message, index) => (
          <div key={index} className={`flex items-start ${message.sender._id === userInfo._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`bg-${message.sender._id === userInfo._id ? 'blue' : 'yellow'}-500 text-white p-2 rounded-md mb-1`}>
              <div className="flex items-center">
                {
                  message.chat?.isGroupChat && <div className="font-bold mr-2">{message.sender.username}:</div>
                }
                <div>{message.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input for new messages */}
      <div className="flex gap-2 mx-2">
        <form onSubmit={handleSubmit(sendMessageSubmitHandler)} className="flex-grow flex items-center">
          <input
            type="text"
            placeholder="Type your message here"
            className="bg-white border p-2 rounded-l-md focus:outline-none focus:border-blue-500 flex-grow"
            {...register('content', { required: 'Content is required!' })}
          />
          <button
            className="bg-blue-500 p-2 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            type="submit"
          >
            {/* Change the send icon or use your own */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatView;
