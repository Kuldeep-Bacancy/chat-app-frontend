import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { updateGroupName, updateGroupMembers } from '../services/chats'
import AsyncSelect from "react-select/async"
import { searchUsers } from '../services/users'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify'

function GroupSettingsModal({ setShowModal, groupId, groupUsers }) {
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const { register: groupMembersRegister, control, handleSubmit: groupMembersSubmit, formState: { errors: groupMembersErrors } } = useForm()
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState(groupUsers)

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const updateGroupNameHandler = async (data) => {
    try {
      const response = await updateGroupName(data)
      toast.success(response.data?.message)
      reset()
    } catch (error) {
      setShowModal(false)
      toast.error(error.response?.data?.message)
      reset()
    }
  }

  const updateGroupHandlerMutation = useMutation({
    mutationFn: updateGroupNameHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat', groupId ]
      }),
      queryClient.invalidateQueries({
        queryKey: ['chats']
      })
    }
  })

  const updateGroupNamesubmitHandler = (data) => {
    const newData = { ...data, groupId: groupId }
    updateGroupHandlerMutation.mutate(newData)
  }

  const updateGroupMemberssubmitHandler = (data) => {
    console.log("data", data);
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
                Group Settings
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
              <form id="searchForm" className="mb-4" onSubmit={handleSubmit(updateGroupNamesubmitHandler)}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-3 mb-3">New Group Name</label>
                <input type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded text-gray-700" {...register('name', { required: 'Please Enter Group Name' })} />
                <p className='error'>{errors.name?.message}</p>

                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Update</button>
              </form>

              <form onSubmit={groupMembersSubmit(updateGroupMemberssubmitHandler)}>
                <label htmlFor="users" className="block text-sm font-medium text-gray-700 mt-3 mb-3">Members</label>
                <Controller
                  control={control}
                  name='users'
                  render={({ field }) => (
                    <AsyncSelect {...field } onChange={handleChange} onInputChange={(value) => setQuery(value)} loadOptions={loadOptions} value={selectedOption} isMulti />
                  )}
                />

                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Update</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

export default GroupSettingsModal