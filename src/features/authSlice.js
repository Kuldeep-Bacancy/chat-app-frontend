import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

const accessToken = localStorage.getItem('accessToken') || Cookies.get('accessToken')
const refreshToken = localStorage.getItem('refreshToken') || Cookies.get('refreshToken')

const initialState = {
  accessToken: accessToken,
  refreshToken: refreshToken,
  isAuthenticated: accessToken ? true : false,
  userData: accessToken ? jwtDecode(accessToken) : {}
}

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.userData = jwtDecode(action.payload.accessToken)
    },
    logout: (state, action) => {
      state.accessToken = ""
      state.refreshToken = "" 
      state.isAuthenticated = false
      state.userData = ""
    }
  }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer

