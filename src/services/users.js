import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL

export const loginUser = async (data) => {
  const response = await axios.post(`${backendURL}/users/login`, data)
  return response
}

export const registerUser = async (data) => {
  const response = await axios.post(`${backendURL}/users/register`, data)
  return response
}

export const logoutUser = async (data) => {
  const response = await axios.delete(`${backendURL}/users/logout`)
  return response
}

export const forgetPassword = async (data) => {
  const response = await axios.post(`${backendURL}/users/forget-password`, data)
  return response
}

export const resetPassword = async (data) => {
  const response = await axios.post(`${backendURL}/users/reset-password`, data)
  return response
}