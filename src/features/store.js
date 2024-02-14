import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import chatReducer from './chatSlice'

const store = configureStore({
  reducer: {
    authentication: authReducer,
    chat: chatReducer
  }
})

export default store;