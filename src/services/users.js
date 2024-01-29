import { axiosPublic } from "../common/axiosPublic";
import { axiosPrivate } from "../common/axiosPrivate"

const backendURL = import.meta.env.VITE_BACKEND_URL

export const loginUser = async (data) => {
  const response = await axiosPublic.post(`${backendURL}/users/login`, data, { withCredentials: true })
  return response
}

export const registerUser = async (data) => {
  const response = await axiosPublic.post(`${backendURL}/users/register`, data)
  return response
}

export const logoutUser = async (data) => {
  const response = await axiosPrivate.delete(`${backendURL}/users/logout`)
  return response
}

export const forgetPassword = async (data) => {
  const response = await axiosPublic.post(`${backendURL}/users/forget-password`, data)
  return response
}

export const resetPassword = async (data) => {
  const response = await axiosPublic.post(`${backendURL}/users/reset-password`, data)
  return response
}

export const searchUsers = async (data) => {
  const { search } = data
  const response = await axiosPrivate.get(`${backendURL}/users?search=${search}`)
  return response
}