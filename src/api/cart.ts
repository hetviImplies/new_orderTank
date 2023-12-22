import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithAuthInterceptor, prepareHeaders} from './util';
import {BASE_URL} from '../types/data';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithAuthInterceptor({
    baseUrl: `${BASE_URL}/cart`,
    prepareHeaders,
  }),
  tagTypes: ['carts'],
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getCarts: builder.query({
      query: () => {
        return {
          url: 'get-all-user-cart',
          method: 'GET',
        };
      },
      providesTags: ['carts'],
    }),
    addCart: builder.mutation({
      query: body => {
        return {
          url: 'add-cart',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['carts'],
    }),
    removeCart: builder.mutation({
      query: body => {
        return {
          url: 'remove-cart',
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['carts'],
    }),
    updateCart: builder.mutation({
      query: params => {
        return {
          url: `update-cart?id=${params?._id}`,
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
