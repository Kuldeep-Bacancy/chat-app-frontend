import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { searchUsers } from '../services/users'
import { createChat } from '../services/chats'
import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'


function SearchUserModal({ setShowModal }) {
  const queryClient = useQueryClient() 
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [searchResults, setSearchResults] = useState([])

  const handleSearchForm = async (data) => {
    const response = await searchUsers(data)
    setSearchResults(response.data?.data)
  }

  const createChatHandler = async (userId) => {
    try {
      const response = await createChat(userId)
      queryClient.invalidateQueries({
        queryKey: ['chats']
      })
      setShowModal(false)
      toast.success(response.data?.message)
    } catch (error) {
      setShowModal(false)
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl text-gray-700">
                Search User By Name or Email
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-gray h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <form id="searchForm" className="mb-4" onSubmit={handleSubmit(handleSearchForm)}>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                <input type="text" id="search" name="search" className="mt-1 p-2 w-full border rounded text-gray-700" { ...register('search',{ required: 'Please Enter Search keyword'})} />
                <p className='error'>{errors.search?.message}</p>

                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Search</button>
              </form>

              <div>
                <h3 className="text-xl text-gray-800 mb-2">Search Results:</h3>
                <ul>
                  {
                    searchResults.length > 0 ?
                      searchResults.map(user => (
                        <li 
                          key={user._id} 
                          className='text-gray-800 hover:border border-solid border-blue-500 border-t-2 border-b-2 py-2 px-1 cursor-pointer'
                          onClick={() => { createChatHandler(user._id)}}
                        >
                          {user.username} - {user.email}
                        </li>
                      )) 
                      : 
                      <p className='text-gray-700 text-center'>No results found.</p>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default SearchUserModal