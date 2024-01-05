import {createSlice} from '@reduxjs/toolkit';
import {AuthState} from '../../types/auth';

const initialState: AuthState = {
  userInfo: {},
  authenticated: false,
  token: '',
  from: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.userInfo = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
    authReset: () => initialState,
  },
});

export const {
  setCurrentUser,
  setToken,
  setIsAuthenticated,
  authReset,
} = authSlice.actions;
export default authSlice.reducer;
