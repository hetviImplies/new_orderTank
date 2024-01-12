import {createSlice} from '@reduxjs/toolkit';

const initialState: any = {
  addressData: [],
};

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddressList: (state, action) => {
      state.addressData = action.payload;
    },
  },
});

export const {setAddressList} = addressSlice.actions;
export default addressSlice.reducer;
