import { axiosPrivate } from "../common/axiosPrivate"

const backendURL = import.meta.env.VITE_BACKEND_URL

export const createMessage = async (data) => {
  const response = await axiosPrivate.post(`${backendURL}/messages`, data, { headers: { "Content-Type": "multipart/form-data" } })
  return response
}

export const getMessages = async (chatId) => {
  const response = await axiosPrivate.get(`${backendURL}/messages/${chatId}`)
  return response
} 

export const deleteMessage = async (msgId) => {
  const response = await axiosPrivate.delete(`${backendURL}/messages/${msgId}`)
  return response
}

export const deleteAllMessages = async (chatId) => {
  const response = await axiosPrivate.post(`${backendURL}/messages/${chatId}`)
  return response
}