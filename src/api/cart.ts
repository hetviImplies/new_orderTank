import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import {BASE_URL} from '../types/data';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/company`,
    prepareHeaders,
  }),
  tagTypes: ['carts'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getCarts: builder.query({
      query: (params) => {
        return {
          url: 'get/cart',
          method: 'GET',
          params
        };
      },
      providesTags: ['carts'],
    }),
    addCart: builder.mutation({
      query: body => {
        return {
          url: 'add/cart',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['carts'],
    }),
    removeCart: builder.mutation({
      query: body => {
        return {
          url: `delete/cart`,
          method: 'DELETE',
          body,
        };
      },
      invalidatesTags: ['carts'],
    }),
    updateCart: builder.mutation({
      query: params => {
        return {
          url: `update/cart/${params?._id}`,
          method: 'PUT',
          body: params.body,
        };
      },
      invalidatesTags: ['carts'],
    }),
  }),
});

export const {
  useGetCartsQuery,
  useAddCartMutation,
  useRemoveCartMutation,
  useUpdateCartMutation,
} = cartApi;
