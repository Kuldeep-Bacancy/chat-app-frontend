import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { deleteAllMessages } from '../services/messages';
import { toast } from 'react-toastify';


function ClearChat({ chatId, setShowOptions }) {
  const queryClient = useQueryClient()
  const optionsRef = useRef(null);

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

  return (
    <div
      ref={optionsRef}
      className="absolute right-2 top-10 bg-white shadow-lg p-2 rounded-md max-w-xs z-10"
    >
      <button
        className="block w-full text-left hover:bg-gray-100 p-2"
        onClick={() => { deleteAllMessagesMutation.mutate(chatId) }}
      >
        Clear Chat
      </button>
    </div>
  )
}

export default ClearChat