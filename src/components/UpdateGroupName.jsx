import React from 'react'
import { useForm } from 'react-hook-form'
import { updateGroupName } from '../services/chats'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

function UpdateGroupName({ groupId }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const queryClient = useQueryClient()

  const updateGroupNameHandler = async (data) => {
    try {
      const response = await updateGroupName(data)
      toast.success(response.data?.message)
      reset()
    } catch (error) {
      toast.error(error.response?.data?.message)
      reset()
    }
  }

  const updateGroupHandlerMutation = useMutation({
    mutationFn: updateGroupNameHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat', groupId]
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

  return (
    <form id="searchForm" className="mb-4" onSubmit={handleSubmit(updateGroupNamesubmitHandler)}>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-3 mb-3">New Group Name</label>
      <input type="text" id="name" name="name" className="mt-1 p-2 w-full border rounded text-gray-700" {...register('name', { required: 'Please Enter Group Name' })} />
      <p className='error'>{errors.name?.message}</p>

      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Update</button>
    </form>
  )
}

export default UpdateGroupName