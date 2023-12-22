import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import { BASE_URL } from '../types/data';

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/address/`,
    prepareHeaders,
  }),
  tagTypes: ['address'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getAddress: builder.query({
      query: () => {
        return {
          url: 'get-all-address',
          method: 'GET',
        };
      },
      providesTags: ['address'],
    }),
    createAddress: builder.mutation({
      query: body => {
        return {
          url: 'create-address',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['address'],
    }),
    updateAddress: builder.mutation({
      query: (body) => {
        return {
          url: `update-address?id=${body?.id}`,
          method: 'PUT',
          body:body?.params,
        };
      },
      invalidatesTags: ['address'],
    }),
    deleteAddress: builder.mutation({
      query: body => {
        return {
          url: `delete-address?id=${body?.id}`,
          method: 'DELETE',
          body,
        };
      },
      invalidatesTags: ['address'],
    }),
  }),
});

export const {
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
