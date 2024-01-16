import {createSlice} from '@reduxjs/toolkit';

const initialState: any = {
  cartCompany: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartCompany: (state, action) => {
      state.cartCompany = action.payload;
    },
  },
});

export const {setCartCompany} = cartSlice.actions;
export default cartSlice.reducer;
