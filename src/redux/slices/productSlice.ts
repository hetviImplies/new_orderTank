import { createSlice } from '@reduxjs/toolkit'

const initialState: any = {
    productData: {},
  };

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setproductData: (state, action) => { state.productData = action.payload },
    }
})

export const { setproductData } = productSlice.actions
export default productSlice.reducer