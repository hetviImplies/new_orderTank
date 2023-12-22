import { createSlice } from '@reduxjs/toolkit'

const initialState: any = {
    categoryData: {},
  };

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategoryData: (state, action) => { state.categoryData = action.payload },
    }
})

export const { setCategoryData } = categorySlice.actions
export default categorySlice.reducer