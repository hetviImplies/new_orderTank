import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {setCurrentUser} from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const baseQueryWithAuthInterceptor = (args: any) => {
  const baseQuery: any = fetchBaseQuery(args);
  return async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);
    if (
      result.error &&
      (result.error.status === 401 || result.error.originalStatus === 401)
    ) {
      api.dispatch(setCurrentUser(null));
    }
    return result;
  };
};
export const prepareHeaders = async (headers: any, {getState}: any) => {
  // getState().auth.token ||
  const token = await AsyncStorage.getItem('token');
  // if (token) headers.set('token', `${token}`);
  console.log('TOKEN',getState().auth.token,'.........', await AsyncStorage.getItem('token'));
  if (getState().auth.token || await AsyncStorage.getItem('token')) {
    headers.set('Authorization', `Bearer ${getState().auth.token || await AsyncStorage.getItem('token')}`);
  }
  return headers;
};
// (args: FetchBaseQueryArgs) => BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
