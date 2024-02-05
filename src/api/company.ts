import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import queryString from 'query-string';
import Config from 'react-native-config';

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${Config.API_URL}/company`,
    prepareHeaders,
    paramsSerializer: function (params: any) {
      return queryString.stringify(params, {arrayFormat: 'index'});
    },
  }),
  tagTypes: ['company'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getCompany: builder.query({
      query: id => {
        return {
          url: `/${id}`,
          method: 'GET',
        };
      },
      providesTags: ['company'],
    }),
    addCompany: builder.mutation({
      query: body => {
        return {
          url:'',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['company'],
    }),
    updateCompany: builder.mutation({
      query: body => {
        return {
          url: `/${body.id}`,
          method: 'PUT',
          body: body.params,
        };
      },
      invalidatesTags: ['company'],
    }),
    createAddress: builder.mutation({
      query: body => {
        return {
          url: `${body.companyId}/add/address`,
          method: 'POST',
          body: body.params,
        };
      },
      // invalidatesTags: ['company'],
    }),
    updateAddress: builder.mutation({
      query: body => {
        return {
          url: `${body.companyId}/updateAddress/${body.addressId}`,
          method: 'PUT',
          body: body.params,
        };
      },
      // invalidatesTags: ['company'],
    }),
    removeAddress: builder.mutation({
      query: body => {
        return {
          url: `${body.companyId}/removeAddress/${body.addressId}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['company'],
    }),
  }),
});

export const {
  useGetCompanyQuery,
  useAddCompanyMutation,
  useUpdateCompanyMutation,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useRemoveAddressMutation
} = companyApi;
