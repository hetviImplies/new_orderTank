import {createSlice} from '@reduxjs/toolkit';

const initialState: any = {
  cartData: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
  },
});

export const {setCartData} = cartSlice.actions;
export default cartSlice.reducer;
