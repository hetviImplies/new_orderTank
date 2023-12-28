import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import {BASE_URL} from '../types/data';
import queryString from 'query-string';

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/company`,
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
          url: id,
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
          url: body._id,
          method: 'PUT',
          body: body.params,
        };
      },
      invalidatesTags: ['company'],
    }),
    getSupplier: builder.query({
      query: params => {
        return {
          url: 'sellers/get',
          method: 'GET',
          params,
        };
      },
      providesTags: ['company'],
    }),
    companyRequest: builder.mutation({
      query: body => {
        return {
          url: 'request/send',
          method: 'POST',
          body,
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
      invalidatesTags: ['company'],
    }),
    updateAddress: builder.mutation({
      query: body => {
        return {
          url: `${body.companyId}/updateAddress/${body.addressId}`,
          method: 'PUT',
          body: body.params,
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
  useGetSupplierQuery,
  useCompanyRequestMutation,
  useCreateAddressMutation,
  useUpdateAddressMutation
} = companyApi;
