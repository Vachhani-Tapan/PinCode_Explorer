import { configureStore } from '@reduxjs/toolkit';
import pincodeReducer from './slices/pincodeSlice';

export const store = configureStore({
  reducer: {
    pincode: pincodeReducer,
  },
});
