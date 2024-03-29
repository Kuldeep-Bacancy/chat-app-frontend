import React, { useState } from 'react'
import AsyncSelect from "react-select/async"
import { searchUsers } from '../services/users'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form'
import { updateGroupMembers } from '../services/chats'
import { toast } from 'react-toastify'

function UpdateGroupMembers({ groupId, groupUsers }) {
  const queryClient = useQueryClient()
  const { control, handleSubmit, formState: { errors }, reset } = useForm()
  const [query, setQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState(groupUsers)

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const loadOptions = async () => {
    const response = await searchUsers({ search: query });
    const allOptions = response.data?.data?.filter((ele) => ele?.username?.includes(query)) || []
    const options = allOptions.map((option) => { return { value: option?._id, label: option?.username, color: '#0052CC' } })
    return options
  }

  const updateGroupMembersHandler = async () => {
    try {
      const newData = { groupId: groupId, userIds: selectedOption.map((user) => user.value) }
      const response = await updateGroupMembers(newData)
      toast.success(response?.data?.message)
      queryClient.invalidateQueries({
        queryKey: ['chat', groupId],
      });
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const updateGroupMembersMutation = useMutation({
    mutationFn: updateGroupMembersHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat', groupId]
      })
    }
  })

  const updateGroupMembersSubmitHandler = (data) => {
    updateGroupMembersMutation.mutate(data)
  }

  return (
    <form id='group-members-Form' onSubmit={handleSubmit(updateGroupMembersSubmitHandler)}>
      <label htmlFor="users[]" className="block text-sm font-medium text-gray-700 mt-3 mb-3">Members</label>
      <Controller
        control={control}
        name='users'
        render={({ field }) => (
          <AsyncSelect {...field} 
            onChange={handleChange} 
            onInputChange={(value) => setQuery(value)} 
            loadOptions={loadOptions} 
            value={selectedOption}
            isMulti

          />
        )}
      />
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Update</button>
    </form>
  )
}

export default UpdateGroupMembers