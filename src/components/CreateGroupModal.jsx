import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { createGroup } from '../services/chats'
import AsyncSelect from "react-select/async"
import { searchUsers } from '../services/users'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateGroupModal({ setShowGroupModal }) {
  const queryClient = useQueryClient() 
  const { register, control, handleSubmit, formState: { errors } } = useForm()
  const [query, setQuery] = useState("");

  const createGroupHandler = async (data) => {
    try {
      const newData = { name: data?.name, userIds: data.users.map((user) => user.value) }
      const response = await createGroup(newData)
      setShowGroupModal(false)
      toast.success(response.data?.message)
    } catch (error) {
      setShowGroupModal(false)
      toast.error(error.response?.data?.message)
    }
  }

  const createGroupMutation = useMutation({
    mutationFn: createGroupHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chats']
      })
    }
  })

  const submitHandler = (data) => {
    createGroupMutation.mutate(data)
  }

  const loadOptions = async () => {
    const response = await searchUsers({ search: query });
    const allOptions = response.data?.data?.filter((ele) => ele?.username?.includes(query)) || []
    const options = allOptions.map((option) => { return { value: option?._id, label: option?.username, color: '#0052CC' } })
    return options
  };

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
                Create Group
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowGroupModal(false)}
              >
                <span className="bg-transparent text-gray h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <form id="searchForm" className="mb-4" onSubmit={handleSubmit(submitHandler)}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Group Name</label>
                <input type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded text-gray-700" {...register('name', { required: 'Please Enter Group Name' })} />
                <p className='error'>{errors.name?.message}</p>

                <label htmlFor="users[]" className="block text-sm font-medium text-gray-700">Members</label>
                <Controller
                  control={control}
                  name='users'
                  render={({ field }) => (
                    <AsyncSelect {...field } onInputChange={(value) => setQuery(value)} loadOptions={loadOptions} isMulti />
                  )}
                />

                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Create</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default CreateGroupModal