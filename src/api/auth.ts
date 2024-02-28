import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import Config from 'react-native-config';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/auth`,
    prepareHeaders,
    // paramsSerializer: function (params: any) {
    //   return queryString.stringify(params, {arrayFormat: 'bracket'});
    // },
  }),
  tagTypes: ['CurrentUser'],
  endpoints: builder => ({
    login: builder.mutation({
      query: body => ({
        url: 'login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CurrentUser'],
    }),
    getCurrentUser: builder.query({
      query: () => {
        return {
          url: 'me',
          method: 'GET',
        };
      },
      providesTags: ['CurrentUser'],
    }),
    updateCurrentUser: builder.mutation({
      query: body => {
        return {
          url: 'updateProfile',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['CurrentUser'],
    }),
    register: builder.mutation({
      query: body => {
        return {
          url: 'register',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['CurrentUser'],
    }),
    forgotPassword: builder.mutation({
      query: body => ({
        url: 'forgot-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CurrentUser'],
    }),
    resetPassword: builder.mutation({
      query: params => ({
        url: `reset-password?token=${params?.hash}`,
        method: 'POST',
        body: params.body,
      }),
      invalidatesTags: ['CurrentUser'],
    }),
    resendEmail: builder.mutation({
      query: body => ({
        url: 'resend-verify-email',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CurrentUser'],
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
      invalidatesTags: ['CurrentUser'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendEmailMutation,
  useLogoutMutation
} = authApi;
