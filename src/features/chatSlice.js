import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  selectedChat: ''
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
    }
  }
})

export const { addNotifications, setSelectedChat } = chatSlice.actions

export default chatSlice.reducer