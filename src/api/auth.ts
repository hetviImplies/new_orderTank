import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import queryString from 'query-string';
import {BASE_URL} from '../types/data';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/auth`,
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
    register: builder.mutation({
      query: body => {
        console.log('Body: ', body);
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendEmailMutation,
} = authApi;
