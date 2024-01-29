import { axiosPrivate } from "../common/axiosPrivate"

const backendURL = import.meta.env.VITE_BACKEND_URL

export const createChat = async (userId) => {
  const response = await axiosPrivate.post(`${backendURL}/chats`, { userId: userId })
  return response
}