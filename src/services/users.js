import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL

export const forgetPassword = async (data) => {
  const response = await axios.post(`${backendURL}/users/forget-password`, data)
  return response
}

export const resetPassword = async (data) => {
  const response = await axios.post(`${backendURL}/users/reset-password`, data)
  return response
}