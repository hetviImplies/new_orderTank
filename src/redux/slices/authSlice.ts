import {companyApi} from './../../api/company';
import {createSlice} from '@reduxjs/toolkit';
import {AuthState} from '../../types/auth';

const initialState: AuthState = {
  userInfo: {},
  authenticated: false,
  token: '',
  from: '',
  companyId: '',
  companyLogo: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.userInfo = action.payload;
    },
    setCompanyId: (state, action) => {
      state.companyId = action.payload;
    },
    setCompanyLogo: (state, action) => {
      state.companyLogo = action.payload;
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
  setCompanyId,
  setCompanyLogo
} = authSlice.actions;
export default authSlice.reducer;
