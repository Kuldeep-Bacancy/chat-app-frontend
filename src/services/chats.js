import { axiosPrivate } from "../common/axiosPrivate"

const backendURL = import.meta.env.VITE_BACKEND_URL

export const createChat = async (userId) => {
  const response = await axiosPrivate.post(`${backendURL}/chats`, { userId: userId })
  return response
}

export const getCurrentUserChats = async () => {
  const response = await axiosPrivate.get(`${backendURL}/chats`)
  return response
}

export const createGroup = async (data) => {
  const response = await axiosPrivate.post(`${backendURL}/chats/group`, data)
  return response
}

export const updateGroupName = async (data) => {
  const response = await axiosPrivate.put(`${backendURL}/chats/update-group-name`, data)
  return response
}

export const updateGroupMembers = async (data) => {
  const response = await axiosPrivate.put(`${backendURL}/chats/update-group-members`, data)
  return response
}

export const fetchChat = async (chatId) => {
  const response = await axiosPrivate.get(`${backendURL}/chats/${chatId}`)
  return response
}