import React, { useEffect, useMemo, useState, useRef } from 'react';
import { fetchChat } from '../services/chats';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import GroupSettingsModal from './GroupSettingsModal';
import { createMessage, getMessages, deleteAllMessages, deleteMessage } from '../services/messages';
import { useForm } from 'react-hook-form';
import io from "socket.io-client"
import { formatTimestamp } from '../helpers/DateHelpers';
import ButtonLoader from './others/ButtonLoader';
import { toast } from 'react-toastify';


function ChatView({ chatId }) {
  const socket = useMemo(() => {
    return io(import.meta.env.VITE_SOCKET_URL, { transports: ['websocket', 'polling', 'flashsocket'] })
  }, [chatId])


  const queryClient = useQueryClient()
  const userInfo = useSelector((state) => state.authentication.userData);
  const [showModal, setShowModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredMessage, setHoverdMessage] = useState(null)
  const [deleteMessageId, setDeleteMessageId] = useState(null)
  const { register, handleSubmit, reset } = useForm();
  const optionsRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      socket.emit("join-chat", chatId)
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }

    return () => {
      socket.disconnect();
    }
  }, [chatId, socket])

  useEffect(() => {
    socket.on('message-received', (newMessage) => {
      if (chatId != newMessage?.chat?._id) return
      queryClient.invalidateQueries({
        queryKey: ['messages', chatId],
      });
    })
  }, [chatId])

  useEffect(() => {
    setShowOptions(false)
  }, [chatId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        // Click outside the options menu, close it
        setShowOptions(false);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Detach event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsRef]);

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
      const files = Object.values(data.attachments)
      const newData = { chatId: data.chatId, content: data.content, attachments: files }
      const res = await createMessage(newData);
      socket.emit("new-message", res?.data?.data)
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message)
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

  const deleteMessageHandler = async (msgId) => {
    try {
      if (confirm("Are You sure you want to delete this message? You are no longer to see this message!")) {
        setDeleteMessageId(msgId)
        await deleteMessage(msgId)
        setDeleteMessageId(null)
      }
    } catch (error) {
      setDeleteMessageId(null)
    }
  }

  const deleteMessageMutation = useMutation({
    mutationFn: (msgId) => deleteMessageHandler(msgId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', chatId],
      });
    },
  })

  const deleteAllMessagesHandler = async (chatId) => {
    try {
      const res = await deleteAllMessages(chatId)
      toast.success(res.data?.message)
      setShowOptions(false)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  const deleteAllMessagesMutation = useMutation({
    mutationFn: (chatId) => deleteAllMessagesHandler(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages', chatId],
      });
    },
  })

  const typingHandler = () => {
    if (!typing) {
      setTyping(true);
      socket.emit("typing", chatId);
    }

    //debounce/throttle function
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chatId);
        setTyping(false);
      }
    }, timerLength);
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const chatData = chat.data?.data?.data;
  const groupUsers = chatData?.users?.map((option) => ({
    value: option?._id,
    label: option?.username,
    color: '#0052CC'
  }));
  const groupAdminName = chatData?.groupAdmin?.username
  const chatName = chatData?.isGroupChat ? chatData?.name : chatData?.users?.find((user) => user._id !== userInfo._id)?.username;

  return (
    <div className="flex flex-col bg-gray-400 w-2/3 p-2">
      {
        chatId
          ?
          (
            <>
              <div className="flex items-center justify-between mb-2 bg-blue-500 p-2 rounded-md">
                <h2 className="text-xl font-bold text-white">{chatName}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-white hover:text-gray-200 focus:outline-none"
                    onClick={toggleOptions}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6 12 12 12 18"
                      />
                    </svg>
                  </button>
                  {chatData?.isGroupChat && (
                    <button
                      className="text-white hover:text-gray-200 focus:outline-none"
                      onClick={() => setShowModal(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 cursor-pointer"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 14 12 8"
                        />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </button>
                  )}
                </div>
                {showModal && <GroupSettingsModal setShowModal={setShowModal} groupId={chatData._id} groupUsers={groupUsers} groupAdminName={groupAdminName} />}
              </div>
              {showOptions && (
                <div
                  ref={optionsRef}
                  className="absolute right-2 top-10 bg-white shadow-lg p-2 rounded-md max-w-xs z-10"
                >
                  <button 
                    className="block w-full text-left hover:bg-gray-100 p-2"
                    onClick={() => { deleteAllMessagesMutation.mutate(chatId) } }
                  >
                    Clear Chat
                  </button>
                </div>
              )}
              <div className="flex-grow mb-2">
                {
                  messages.isLoading ? (
                    <div className="text-center p-4 bg-gray-200 rounded-lg w-full">
                      Loading messages...
                    </div>
                  ) :
                    (
                      messages?.data?.data?.data.map((message, index) => (
                        <div 
                          key={index} 
                          className={`flex items-start ${message.sender._id === userInfo._id ? 'justify-end' : 'justify-start'} ${deleteMessageMutation.status == 'pending' && deleteMessageId == message._id ? 'animate-pulse' : ''}`}
                        >
                          <div
                            className={`bg-${message.sender._id === userInfo._id ? 'blue' : 'yellow'}-500 text-white p-2 rounded-md mb-1 relative`}
                            onMouseEnter={() => setHoverdMessage(message._id)}
                            onMouseLeave={() => setHoverdMessage(null)}
                          >
                            <div className="flex items-center">
                              {message.chat?.isGroupChat && <div className="font-bold mr-2">{message.sender.username}:</div>}
                              <div>{message.content}</div>
                            </div>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className='attachments'>
                                <ul>
                                  {message.attachments.map((attachment, attachmentIndex) => (
                                    <li key={attachmentIndex}>
                                      <a href={attachment.url} target="_blank" rel="noopener noreferrer">{attachment.name}</a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">{formatTimestamp(message.createdAt)}</div>
                            { /* Delete Button */}
                            {
                              (hoveredMessage === message._id && message.sender._id === userInfo._id) && (
                                <button
                                  className="absolute top-0 right-0 text-white hover:text-gray-200 focus:outline-none ml-2"
                                  onClick={() => { deleteMessageMutation.mutate(message._id) } }
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              )
                            }
                          </div>
                        </div>
                      ))

                    )
                }
              </div>
              {
                istyping &&
                <div className="flex items-center justify-start mb-2">
                  <div className="animate-typing">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              }
              <div className="flex gap-2 mx-2">
                <form onSubmit={handleSubmit(sendMessageSubmitHandler)} className="flex-grow flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message here"
                    className="bg-white border p-2 rounded-l-md focus:outline-none focus:border-blue-500 flex-grow"
                    {...register('content', { required: 'Content is required!' })}
                    onChange={typingHandler}
                  />
                  <label htmlFor="fileInput" className="bg-blue-200 text-gray-600 p-2 text-white mx-1 cursor-pointer">
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      accept="image/x-png,image/gif,image/jpeg"
                      multiple
                      {...register('attachments')}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                      />
                    </svg>
                  </label>
                  <button
                    className="bg-blue-500 p-2 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    type="submit"
                    disabled={sendMessageMutation.status == 'pending'}
                  >
                    {
                      sendMessageMutation.status == 'pending' ? (
                        <ButtonLoader />
                      ) : (
                        // Display the send icon when not loading
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                      )
                    }
                  </button>
                </form>
              </div>
            </>
          )

          :

          (
            <div className="flex flex-col h-full">
              <div className="text-center p-4 bg-yellow-200 rounded-lg w-full">
                Click on a chat to start a conversation
              </div>
            </div>
          )
      }
    </div>
  );
}

export default ChatView;
