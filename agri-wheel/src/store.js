import { configureStore } from '@reduxjs/toolkit'
import addCropReducer from './reducers/addCropSlice'
import userReducer from './reducers/userSlice'

export const store = configureStore({
  reducer: {
    counter: addCropReducer,
    user: userReducer,
  },
})