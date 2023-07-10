import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userInfo: {

  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      // console.log(action.payload, 'payload')
      state.userInfo = action.payload
    },

  },
})
export const { updateUserInfo } = userSlice.actions

export default userSlice.reducer