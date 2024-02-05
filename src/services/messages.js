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