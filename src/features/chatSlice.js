import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  selectedChat: '',
  showNotifications: false
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    addNotifications: (state, action) => {
      state.notifications = action.payload
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload
    },
    setShowNotifications: (state, action) => {
      state.showNotifications = action.payload
    }
  }
})

export const { addNotifications, setSelectedChat, setShowNotifications } = chatSlice.actions

export default chatSlice.reducer